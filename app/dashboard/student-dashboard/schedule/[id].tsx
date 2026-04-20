import AppText from "@/components/ui/AppText";
import Avatar from "@/components/ui/Avatar";
import Input from "@/components/ui/Input";
import Linkify from "@/components/ui/Linkify";
import colors from "@/constants/colors";
import {
  getStudentScheduleById,
  getStudentScheduleMessages,
  getSelfProfile,
  sendStudentScheduleMessage,
  cancelStudentSchedule,
  requestStudentAssistance,
} from "@/lib/api";
import {
  formatGrade,
  formatTimeCT,
  formatName,
  parseScheduleDateTimeCT,
  getRgbValues,
} from "@/lib/utils";
import { router, useLocalSearchParams } from "expo-router";
import { jwtDecode } from "jwt-decode";
import {
  ArrowLeftIcon,
  Blocks,
  BookOpenIcon,
  Calendar,
  CircleDollarSignIcon,
  Clock,
  GraduationCapIcon,
  Hourglass,
  MapPin,
  Monitor,
  SendHorizonalIcon,
  UsersRound,
} from "lucide-react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import { io, Socket } from "socket.io-client";
import { Audio } from "expo-av";

const SOCKET_URL = "https://arch-city-tutors-server.onrender.com";

async function playReceiveSound() {
  try {
    await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
    const { sound } = await Audio.Sound.createAsync(
      require("@/assets/sounds/message-receive.mp3"),
    );
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) sound.unloadAsync();
    });
  } catch {}
}

async function playSendSound() {
  try {
    await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
    const { sound } = await Audio.Sound.createAsync(
      require("@/assets/sounds/message-send.wav"),
    );
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) sound.unloadAsync();
    });
  } catch {}
}

type ScheduleStatus = "ACTIVE" | "COMPLETED" | "CANCELED" | "COMPENSATED";
type Tab = "details" | "chat";

interface ScheduleDetail {
  id: string;
  title: string;
  status: ScheduleStatus;
  duration: string;
  location: string;
  tutorRate: number;
  selectedInPersonLocation: string | null;
  createdAt: string;
  availability: { date: string; time: string } | null;
  tutor: {
    id: string;
    profileImgUrl: string | null;
    firstName: string;
    lastName: string;
    email: string | null;
    phone: string | null;
    subjects: string[];
    grades: string[];
    providesVirtual: boolean;
    providesInPerson: boolean;
    inPersonLocation: string | null;
    otherInPersonLocations: string[];
    fortyFiveMinutesVirtualRate: number | null;
    sixtyMinutesVirtualRate: number | null;
    fortyFiveMinutesInPersonRate: number | null;
    sixtyMinutesInPersonRate: number | null;
    schoolDistrict: string | null;
    isCurrentlyTeachingInClassroom: boolean;
  } | null;
}

interface Message {
  id: string;
  senderId: string;
  sentByAdmin: boolean;
  type: string;
  content: string;
  fileLink: string | null;
  createdAt: string;
}

interface MyProfile {
  id: string;
  firstName: string;
  lastName: string;
  profileImgUrl: string | null;
}

const STATUS_COLORS: Record<ScheduleStatus, { dot: string; label: string }> = {
  ACTIVE: { dot: "#f97316", label: "Upcoming" },
  CANCELED: { dot: "#cc1220", label: "Canceled" },
  COMPLETED: { dot: "#66bc46", label: "Completed" },
  COMPENSATED: { dot: "#66bc46", label: "Compensated" },
};

function formatDuration(duration: string) {
  if (duration === "FORTY_FIVE_MINUTES") return "45 mins";
  if (duration === "SIXTY_MINUTES") return "60 mins";
  return duration;
}

function useCountdown(target: Date | null) {
  const [cd, setCd] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    completed: boolean;
  } | null>(null);

  useEffect(() => {
    if (!target || isNaN(target.getTime())) return;
    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) {
        setCd({ days: 0, hours: 0, minutes: 0, seconds: 0, completed: true });
        return;
      }
      setCd({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
        completed: false,
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [target]);

  return cd;
}

function InfoChip({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoChip}>
      <View style={styles.infoChipIcon}>{icon}</View>
      <View style={styles.infoChipText}>
        <AppText style={styles.infoChipLabel}>{label}</AppText>
        <AppText style={styles.infoChipValue}>{value}</AppText>
      </View>
    </View>
  );
}

export default function StudentScheduleDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [schedule, setSchedule] = useState<ScheduleDetail | null>(null);
  const [myProfile, setMyProfile] = useState<MyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [msgText, setMsgText] = useState("");
  const [sending, setSending] = useState(false);
  const [myId, setMyId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<Tab>("details");
  const [sessionStarted, setSessionStarted] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [assistanceOpen, setAssistanceOpen] = useState(false);
  const [assistanceMsg, setAssistanceMsg] = useState("");
  const [sendingAssistance, setSendingAssistance] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const socketRef = useRef<Socket | null>(null);

  const startTarget = useMemo(() => {
    if (!schedule?.availability) return null;
    return parseScheduleDateTimeCT(
      schedule.availability.date,
      schedule.availability.time,
    );
  }, [schedule?.availability?.date, schedule?.availability?.time]);

  const endTarget = useMemo(() => {
    if (!startTarget) return null;
    const durationMs =
      schedule?.duration === "FORTY_FIVE_MINUTES" ? 45 * 60000 : 60 * 60000;
    return new Date(startTarget.getTime() + durationMs);
  }, [startTarget, schedule?.duration]);

  const startsIn = useCountdown(startTarget);
  const endsIn = useCountdown(endTarget);

  useEffect(() => {
    if (startsIn?.completed) setSessionStarted(true);
  }, [startsIn?.completed]);

  useEffect(() => {
    SecureStore.getItemAsync("token").then((token) => {
      if (token) {
        try {
          const decoded = jwtDecode<{ id: string }>(token);
          setMyId(decoded.id);
        } catch {}
      }
    });
  }, []);

  useEffect(() => {
    if (!myId) return;
    const socket = io(SOCKET_URL, { transports: ["websocket"] });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join-room", { userId: myId });
    });

    socket.on(
      "get-message",
      (msg: {
        senderId: string;
        type: string;
        content: string;
        fileLink: string | null;
      }) => {
        const incoming: Message = {
          id: `${Date.now()}-${Math.random()}`,
          senderId: msg.senderId,
          sentByAdmin: false,
          type: msg.type,
          content: msg.content,
          fileLink: msg.fileLink,
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, incoming]);
        playReceiveSound();
        setTimeout(
          () => scrollRef.current?.scrollToEnd({ animated: true }),
          100,
        );
      },
    );

    return () => {
      socket.emit("leave-room");
      socket.disconnect();
    };
  }, [myId]);

  const loadMessages = useCallback(async () => {
    if (!id) return;
    try {
      const data = await getStudentScheduleMessages(id);
      setMessages(data ?? []);
    } catch {}
  }, [id]);

  useEffect(() => {
    const load = async () => {
      try {
        const [scheduleData, profile] = await Promise.all([
          getStudentScheduleById(id),
          getSelfProfile(),
        ]);
        setSchedule(scheduleData);
        setMyProfile(profile);
        await loadMessages();
      } catch {
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id, loadMessages]);

  useEffect(() => {
    if (activeTab === "chat" && messages.length > 0) {
      setTimeout(
        () => scrollRef.current?.scrollToEnd({ animated: false }),
        150,
      );
    }
  }, [activeTab, messages.length]);

  const handleSend = async () => {
    if (!msgText.trim() || sending || !id || !schedule?.tutor) return;
    setSending(true);
    const text = msgText.trim();
    setMsgText("");
    try {
      const msg = await sendStudentScheduleMessage(id, text);
      setMessages((prev) => [...prev, msg]);
      playSendSound();
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);

      socketRef.current?.emit("send-message", {
        scheduleId: id,
        senderId: myId,
        receiverId: schedule.tutor.id,
        type: "TEXT",
        fileType: null,
        senderProfileImgUrl: myProfile?.profileImgUrl ?? null,
        senderName: myProfile
          ? formatName(myProfile.firstName, myProfile.lastName)
          : "",
        content: text,
        fileLink: null,
      });
    } catch {
    } finally {
      setSending(false);
    }
  };

  const handleCancelSchedule = () => {
    Alert.alert(
      "Cancel Schedule",
      "Are you sure you want to cancel this session? This action cannot be undone.",
      [
        { text: "Keep Session", style: "cancel" },
        {
          text: "Cancel session",
          style: "destructive",
          onPress: async () => {
            if (!id) return;
            setCanceling(true);
            try {
              await cancelStudentSchedule(id);
              setSchedule((prev) =>
                prev ? { ...prev, status: "CANCELED" } : prev,
              );
            } catch {
              Alert.alert(
                "Error",
                "Failed to cancel the session. Please try again.",
              );
            } finally {
              setCanceling(false);
            }
          },
        },
      ],
    );
  };

  const handleSendAssistance = async () => {
    if (!assistanceMsg.trim() || !id) return;
    setSendingAssistance(true);
    try {
      await requestStudentAssistance(id, assistanceMsg.trim());
      setAssistanceOpen(false);
      setAssistanceMsg("");
      Alert.alert("Sent", "Your assistance request has been sent to our team.");
    } catch {
      Alert.alert("Error", "Failed to send request. Please try again.");
    } finally {
      setSendingAssistance(false);
    }
  };

  const tutorName = schedule?.tutor
    ? formatName(schedule.tutor.firstName, schedule.tutor.lastName)
    : "Tutor";

  const statusColors = schedule ? STATUS_COLORS[schedule.status] : null;

  return (
    <KeyboardAvoidingView
      style={[styles.main, { paddingTop: insets.top }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          style={styles.backBtn}
        >
          <ArrowLeftIcon size={20} color={colors.primary} />
        </TouchableOpacity>
        <AppText style={styles.headerTitle} numberOfLines={1}>
          {schedule?.title ?? "Schedule Detail"}
        </AppText>
        <View style={{ width: 40 }} />
      </View>

      {/* Tab bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setActiveTab("details")}
          style={[
            styles.tabBtn,
            activeTab === "details" && styles.tabBtnActive,
          ]}
        >
          <AppText
            style={[
              styles.tabBtnText,
              activeTab === "details" && styles.tabBtnTextActive,
            ]}
          >
            Details
          </AppText>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setActiveTab("chat")}
          style={[styles.tabBtn, activeTab === "chat" && styles.tabBtnActive]}
        >
          <AppText
            style={[
              styles.tabBtnText,
              activeTab === "chat" && styles.tabBtnTextActive,
            ]}
          >
            Chat
          </AppText>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator />
        </View>
      ) : !schedule ? (
        <View style={styles.center}>
          <AppText style={styles.errorText}>Schedule not found</AppText>
        </View>
      ) : activeTab === "details" ? (
        /* ── DETAILS TAB ── */
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollInner}
          showsVerticalScrollIndicator={false}
        >
          {/* Countdown — ACTIVE only */}
          {schedule.status === "ACTIVE" && startTarget !== null && (
            <View style={styles.countdownCard}>
              <View style={styles.countdownHalf}>
                {!sessionStarted ? (
                  startsIn && !startsIn.completed ? (
                    <>
                      <AppText style={styles.countdownLabel}>Starts in</AppText>
                      <AppText style={styles.countdownValue}>
                        {startsIn.days}d {startsIn.hours}h {startsIn.minutes}m{" "}
                        {startsIn.seconds}s
                      </AppText>
                    </>
                  ) : (
                    <AppText
                      style={[styles.countdownValue, { color: "#66bc46" }]}
                    >
                      Session started
                    </AppText>
                  )
                ) : endsIn && !endsIn.completed ? (
                  <>
                    <AppText style={styles.countdownLabel}>Ends in</AppText>
                    <AppText style={styles.countdownValue}>
                      {endsIn.days}d {endsIn.hours}h {endsIn.minutes}m{" "}
                      {endsIn.seconds}s
                    </AppText>
                  </>
                ) : (
                  <AppText
                    style={[styles.countdownValue, { color: colors.accent }]}
                  >
                    Session ended
                  </AppText>
                )}
              </View>
              <View style={styles.countdownDivider} />
              <View style={styles.countdownHalf}>
                <AppText style={styles.countdownLabel}>Session rate</AppText>
                <AppText
                  style={[styles.countdownValue, { color: colors.accent }]}
                >
                  ${schedule.tutorRate.toFixed(2)}
                </AppText>
              </View>
            </View>
          )}

          {/* Session info card */}
          <View style={styles.card}>
            <View style={styles.cardTopRow}>
              {statusColors && (
                <View
                  style={[
                    styles.statusPill,
                    { backgroundColor: `${statusColors.dot}22` },
                  ]}
                >
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: statusColors.dot },
                    ]}
                  />
                  <AppText
                    style={[styles.statusLabel, { color: statusColors.dot }]}
                  >
                    {statusColors.label}
                  </AppText>
                </View>
              )}
              <View style={styles.ratePill}>
                <AppText style={styles.ratePillText}>
                  ${schedule.tutorRate.toFixed(2)}
                </AppText>
              </View>
            </View>

            <AppText style={styles.sessionTitle}>{schedule.title}</AppText>
            <AppText style={styles.cardIdText}>
              #{schedule.id.toUpperCase()}
            </AppText>

            <View style={styles.cardDivider} />

            <View style={styles.infoGrid}>
              {schedule.availability && (
                <InfoChip
                  icon={<Calendar size={15} color={colors.accent} />}
                  label="Date"
                  value={schedule.availability.date}
                />
              )}
              {schedule.availability && (
                <InfoChip
                  icon={<Clock size={15} color={colors.accent} />}
                  label="Time"
                  value={schedule.availability.time}
                />
              )}
              <InfoChip
                icon={<Hourglass size={15} color={colors.accent} />}
                label="Duration"
                value={formatDuration(schedule.duration)}
              />
              <InfoChip
                icon={
                  schedule.location === "VIRTUAL" ? (
                    <Monitor size={15} color={colors.accent} />
                  ) : (
                    <UsersRound size={15} color={colors.accent} />
                  )
                }
                label="Location"
                value={
                  schedule.location === "VIRTUAL" ? "Virtual" : "In-person"
                }
              />
            </View>
          </View>

          {/* Action buttons — ACTIVE only */}
          {schedule.status === "ACTIVE" && (
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={styles.assistanceBtn}
                onPress={() => setAssistanceOpen(true)}
              >
                <AppText style={styles.assistanceBtnText}>
                  Get assistance
                </AppText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.cancelBtn, canceling && { opacity: 0.6 }]}
                onPress={handleCancelSchedule}
                disabled={canceling}
              >
                <AppText style={styles.cancelBtnText}>
                  {canceling ? "Canceling..." : "Cancel session"}
                </AppText>
              </TouchableOpacity>
            </View>
          )}

          {/* Tutor card */}
          {schedule.tutor && (
            <View style={styles.heroCard}>
              {/* Avatar + name row */}
              <View style={styles.heroTop}>
                <Avatar
                  profileImgUrl={schedule.tutor.profileImgUrl ?? undefined}
                  name={tutorName}
                  width={50}
                  height={50}
                />
                <View style={styles.heroInfo}>
                  <AppText style={styles.heroName}>{tutorName}</AppText>
                  <View style={styles.heroGradeRow}>
                    <Blocks
                      size={12}
                      color={`rgba(${getRgbValues(colors.primary)}, 0.4)`}
                    />
                    <AppText style={styles.heroGrade}>Tutor</AppText>
                  </View>
                </View>
              </View>

              {/* Info rows */}
              {schedule.tutor.subjects.length > 0 && (
                <View style={styles.heroRow}>
                  <View style={styles.heroRowIcon}>
                    <BookOpenIcon
                      size={16}
                      color={`rgba(${getRgbValues(colors.primary)}, 1)`}
                    />
                  </View>
                  <View style={styles.heroRowContent}>
                    <AppText style={styles.heroRowLabel}>Subjects:</AppText>
                    <AppText style={styles.heroRowValue}>
                      {schedule.tutor.subjects.join(", ")}
                    </AppText>
                  </View>
                </View>
              )}

              {schedule.tutor.grades.length > 0 && (
                <View style={styles.heroRow}>
                  <View style={styles.heroRowIcon}>
                    <Blocks
                      size={16}
                      color={`rgba(${getRgbValues(colors.primary)}, 1)`}
                    />
                  </View>
                  <View style={styles.heroRowContent}>
                    <AppText style={styles.heroRowLabel}>Grades:</AppText>
                    <AppText style={styles.heroRowValue}>
                      {schedule.tutor.grades.map(formatGrade).join(", ")}
                    </AppText>
                  </View>
                </View>
              )}

              {(schedule.tutor.providesVirtual ||
                schedule.tutor.providesInPerson) && (
                <View style={styles.heroRow}>
                  <View style={styles.heroRowIcon}>
                    <GraduationCapIcon
                      size={16}
                      color={`rgba(${getRgbValues(colors.primary)}, 1)`}
                    />
                  </View>
                  <View style={styles.heroRowContent}>
                    <AppText style={styles.heroRowLabel}>Provides:</AppText>
                    <AppText style={styles.heroRowValue}>
                      {[
                        schedule.tutor.providesVirtual ? "Virtual" : null,
                        schedule.tutor.providesInPerson ? "In-person" : null,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </AppText>
                  </View>
                </View>
              )}

              {schedule.tutor.inPersonLocation && (
                <View style={styles.heroRow}>
                  <View style={styles.heroRowIcon}>
                    <MapPin
                      size={16}
                      color={`rgba(${getRgbValues(colors.primary)}, 1)`}
                    />
                  </View>
                  <View style={styles.heroRowContent}>
                    <AppText style={styles.heroRowLabel}>
                      In-person location:
                    </AppText>
                    <AppText style={styles.heroRowValue}>
                      {schedule.tutor.inPersonLocation}
                    </AppText>
                  </View>
                </View>
              )}

              {schedule.tutor.otherInPersonLocations.length > 0 && (
                <View style={styles.heroRow}>
                  <View style={styles.heroRowIcon}>
                    <MapPin
                      size={16}
                      color={`rgba(${getRgbValues(colors.primary)}, 1)`}
                    />
                  </View>
                  <View style={styles.heroRowContent}>
                    <AppText style={styles.heroRowLabel}>
                      Other in-person locations:
                    </AppText>
                    <AppText style={styles.heroRowValue}>
                      {schedule.tutor.otherInPersonLocations.join(", ")}
                    </AppText>
                  </View>
                </View>
              )}

              {(schedule.tutor.fortyFiveMinutesVirtualRate != null ||
                schedule.tutor.sixtyMinutesVirtualRate != null) && (
                <View style={styles.heroRow}>
                  <View style={styles.heroRowIcon}>
                    <CircleDollarSignIcon
                      size={16}
                      color={`rgba(${getRgbValues(colors.primary)}, 1)`}
                    />
                  </View>
                  <View style={styles.heroRowContent}>
                    <AppText style={styles.heroRowLabel}>
                      Virtual rates:
                    </AppText>
                    <View style={styles.heroRateInline}>
                      {schedule.tutor.fortyFiveMinutesVirtualRate != null && (
                        <>
                          <AppText style={styles.heroRateAmount}>
                            ${schedule.tutor.fortyFiveMinutesVirtualRate}
                          </AppText>
                          <AppText style={styles.heroRateSuffix}>
                            {" "}
                            45mins
                          </AppText>
                        </>
                      )}
                      {schedule.tutor.fortyFiveMinutesVirtualRate != null &&
                        schedule.tutor.sixtyMinutesVirtualRate != null && (
                          <AppText style={styles.heroRateSep}> ~ </AppText>
                        )}
                      {schedule.tutor.sixtyMinutesVirtualRate != null && (
                        <>
                          <AppText style={styles.heroRateAmount}>
                            ${schedule.tutor.sixtyMinutesVirtualRate}
                          </AppText>
                          <AppText style={styles.heroRateSuffix}>
                            {" "}
                            60mins
                          </AppText>
                        </>
                      )}
                    </View>
                  </View>
                </View>
              )}

              {(schedule.tutor.fortyFiveMinutesInPersonRate != null ||
                schedule.tutor.sixtyMinutesInPersonRate != null) && (
                <View style={styles.heroRow}>
                  <View style={styles.heroRowIcon}>
                    <CircleDollarSignIcon
                      size={16}
                      color={`rgba(${getRgbValues(colors.primary)}, 1)`}
                    />
                  </View>
                  <View style={styles.heroRowContent}>
                    <AppText style={styles.heroRowLabel}>
                      In-person rates:
                    </AppText>
                    <View style={styles.heroRateInline}>
                      {schedule.tutor.fortyFiveMinutesInPersonRate != null && (
                        <>
                          <AppText style={styles.heroRateAmount}>
                            ${schedule.tutor.fortyFiveMinutesInPersonRate}
                          </AppText>
                          <AppText style={styles.heroRateSuffix}>
                            {" "}
                            45mins
                          </AppText>
                        </>
                      )}
                      {schedule.tutor.fortyFiveMinutesInPersonRate != null &&
                        schedule.tutor.sixtyMinutesInPersonRate != null && (
                          <AppText style={styles.heroRateSep}> ~ </AppText>
                        )}
                      {schedule.tutor.sixtyMinutesInPersonRate != null && (
                        <>
                          <AppText style={styles.heroRateAmount}>
                            ${schedule.tutor.sixtyMinutesInPersonRate}
                          </AppText>
                          <AppText style={styles.heroRateSuffix}>
                            {" "}
                            60mins
                          </AppText>
                        </>
                      )}
                    </View>
                  </View>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      ) : (
        /* ── CHAT TAB ── */
        <>
          <ScrollView
            ref={scrollRef}
            style={styles.scroll}
            contentContainerStyle={styles.chatScrollInner}
            showsVerticalScrollIndicator={false}
          >
            {schedule.location === "IN_PERSON" &&
            schedule.selectedInPersonLocation ? (
              <View style={styles.locationBanner}>
                <MapPin size={15} color={colors.accent} />
                <View style={{ flex: 1 }}>
                  <AppText style={styles.locationLabel}>
                    MEETING LOCATION
                  </AppText>
                  <AppText style={styles.locationValue}>
                    {schedule.selectedInPersonLocation}
                  </AppText>
                </View>
              </View>
            ) : null}

            {messages.length === 0 ? (
              <View style={styles.center}>
                <AppText style={styles.noMessages}>
                  {schedule.status === "ACTIVE"
                    ? "No messages yet — say hi!"
                    : "No messages in this session"}
                </AppText>
              </View>
            ) : (
              <View style={styles.messagesContainer}>
                {messages.map((msg) => {
                  const isMe = msg.senderId === myId && !msg.sentByAdmin;
                  const isSentByAdmin = msg.sentByAdmin;
                  return (
                    <View
                      key={msg.id}
                      style={[
                        styles.msgRow,
                        isMe ? styles.msgRowRight : styles.msgRowLeft,
                      ]}
                    >
                      <View
                        style={[
                          styles.bubble,
                          isMe
                            ? styles.bubbleMe
                            : isSentByAdmin
                              ? styles.bubbleAdmin
                              : styles.bubbleOther,
                        ]}
                      >
                        {isSentByAdmin && (
                          <AppText style={styles.adminLabel}>Admin</AppText>
                        )}
                        <Linkify
                          text={msg.content}
                          textStyle={[
                            styles.bubbleText,
                            isMe && styles.bubbleTextMe,
                          ]}
                          isMe={isMe}
                        />
                        <AppText
                          style={[
                            styles.bubbleTime,
                            isMe && styles.bubbleTimeMe,
                          ]}
                        >
                          {formatTimeCT(msg.createdAt)}
                        </AppText>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </ScrollView>

          {schedule.status === "ACTIVE" ? (
            <View
              style={[styles.inputBar, { paddingBottom: insets.bottom + 8 }]}
            >
              <View style={styles.inputWrap}>
                <Input
                  value={msgText}
                  onChangeText={setMsgText}
                  placeholder="Type a message…"
                />
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleSend}
                disabled={sending || !msgText.trim()}
                style={[
                  styles.sendBtn,
                  (!msgText.trim() || sending) && styles.sendBtnDisabled,
                ]}
              >
                <SendHorizonalIcon size={18} color={colors.secondary} />
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={[styles.inactiveBar, { paddingBottom: insets.bottom + 8 }]}
            >
              <AppText style={styles.inactiveText}>
                You cannot interact anymore.
              </AppText>
            </View>
          )}
        </>
      )}
      {/* Assistance modal */}
      <Modal
        visible={assistanceOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setAssistanceOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <AppText style={styles.modalTitle}>Get assistance</AppText>
            <AppText style={styles.modalDesc}>
              Describe your issue and our team will get back to you as soon as
              possible.
            </AppText>
            <TextInput
              style={styles.modalInput}
              placeholder="Describe your issue..."
              placeholderTextColor={`rgba(${getRgbValues(colors.primary)}, 0.35)`}
              value={assistanceMsg}
              onChangeText={setAssistanceMsg}
              multiline
              numberOfLines={4}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => {
                  setAssistanceOpen(false);
                  setAssistanceMsg("");
                }}
              >
                <AppText style={styles.modalCancelText}>Cancel</AppText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalSendBtn,
                  (!assistanceMsg.trim() || sendingAssistance) &&
                    styles.modalSendBtnDisabled,
                ]}
                onPress={handleSendAssistance}
                disabled={!assistanceMsg.trim() || sendingAssistance}
              >
                <AppText style={styles.modalSendText}>
                  {sendingAssistance ? "Sending..." : "Send"}
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  main: { flex: 1, backgroundColor: colors.foreground1 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  errorText: {
    fontSize: 14,
    color: `rgba(${getRgbValues(colors.primary)}, 0.4)`,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 25,
    paddingVertical: 15,
    backgroundColor: colors.secondary,
    borderBottomWidth: 1,
    borderBottomColor: `rgba(${getRgbValues(colors.primary)}, 0.06)`,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.foreground1,
    borderRadius: 12,
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
    textAlign: "center",
    marginHorizontal: 8,
  },

  // Tab bar
  tabBar: {
    flexDirection: "row",
    backgroundColor: colors.secondary,
    borderBottomWidth: 1,
    borderBottomColor: `rgba(${getRgbValues(colors.primary)}, 0.1)`,
    paddingHorizontal: 25,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabBtnActive: { borderBottomColor: colors.accent },
  tabBtnText: {
    fontSize: 14,
    fontWeight: "500",
    color: `rgba(${getRgbValues(colors.primary)}, 0.4)`,
  },
  tabBtnTextActive: { color: colors.accent, fontWeight: "600" },

  scroll: { flex: 1 },
  scrollInner: { padding: 25, gap: 12, paddingBottom: 40 },

  // Hero card (dark navy) — student info
  heroCard: {
    backgroundColor: colors.secondary,
    borderRadius: 20,
    padding: 25,
    gap: 20,
  },
  heroTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  heroInfo: { flex: 1 },
  heroName: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 5,
  },
  heroGradeRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  heroGrade: {
    fontSize: 12,
    color: `rgba(${getRgbValues(colors.primary)}, 0.45)`,
    fontWeight: "500",
  },
  heroRow: {
    flexDirection: "row",
    gap: 12,
  },
  heroRowIcon: {
    width: 22,
    marginTop: 2,
    alignItems: "center",
  },
  heroRowContent: {
    flex: 1,
    gap: 4,
  },
  heroRowLabel: {
    fontSize: 12,
    color: `rgba(${getRgbValues(colors.primary)}, 0.5)`,
  },
  heroRowValue: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.primary,
    lineHeight: 20,
  },
  heroRateInline: {
    flexDirection: "row",
    alignItems: "baseline",
    flexWrap: "wrap",
  },
  heroRateAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.accent,
  },
  heroRateSuffix: {
    fontSize: 12,
    color: `rgba(${getRgbValues(colors.primary)}, 0.5)`,
  },
  heroRateSep: {
    fontSize: 14,
    color: `rgba(${getRgbValues(colors.primary)}, 0.35)`,
  },
  // Session card top row
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ratePill: {
    backgroundColor: `rgba(${getRgbValues(colors.accent)}, 0.12)`,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  ratePillText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.accent,
  },
  cardIdText: {
    fontSize: 10,
    fontWeight: "600",
    color: `rgba(${getRgbValues(colors.primary)}, 0.3)`,
    letterSpacing: 0.8,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusLabel: { fontSize: 12, fontWeight: "600" },

  // Session info card
  card: {
    backgroundColor: colors.secondary,
    borderRadius: 20,
    padding: 25,
    gap: 15,
  },
  sessionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.primary,
    lineHeight: 24,
  },
  cardDivider: {
    height: 1,
    backgroundColor: `rgba(${getRgbValues(colors.primary)}, 0.06)`,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  infoChip: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.foreground1,
    borderRadius: 14,
    padding: 12,
  },
  infoChipIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: `rgba(${getRgbValues(colors.accent)}, 0.1)`,
    justifyContent: "center",
    alignItems: "center",
  },
  infoChipText: { flex: 1 },
  infoChipLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: `rgba(${getRgbValues(colors.primary)}, 0.4)`,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 5,
  },
  infoChipValue: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.primary,
  },

  // Countdown card
  countdownCard: {
    backgroundColor: colors.secondary,
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
  },
  countdownHalf: { flex: 1, alignItems: "center" },
  countdownDivider: {
    width: 1,
    height: 40,
    backgroundColor: `rgba(${getRgbValues(colors.primary)}, 0.08)`,
    marginHorizontal: 16,
  },
  countdownLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: `rgba(${getRgbValues(colors.primary)}, 0.4)`,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 5,
  },
  countdownValue: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary,
    textAlign: "center",
  },

  // Chat tab
  chatScrollInner: { padding: 25, gap: 25, flexGrow: 1 },
  locationBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 15,
    backgroundColor: `rgba(${getRgbValues(colors.accent)}, 0.06)`,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: `rgba(${getRgbValues(colors.accent)}, 0.12)`,
  },
  locationLabel: {
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
    color: colors.accent,
    marginBottom: 5,
  },
  locationValue: { fontSize: 12, fontWeight: "500", color: colors.primary },
  noMessages: {
    fontSize: 14,
    color: `rgba(${getRgbValues(colors.primary)}, 0.4)`,
    textAlign: "center",
    paddingVertical: 20,
  },
  messagesContainer: { gap: 8 },
  msgRow: { flexDirection: "row" },
  msgRowRight: { justifyContent: "flex-end" },
  msgRowLeft: { justifyContent: "flex-start" },
  bubble: {
    maxWidth: "80%",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
    gap: 4,
  },
  bubbleMe: { backgroundColor: colors.primary, borderBottomRightRadius: 4 },
  bubbleOther: {
    backgroundColor: colors.secondary,
    borderBottomLeftRadius: 4,
  },
  bubbleAdmin: {
    backgroundColor: `rgba(${getRgbValues(colors.accent)}, 0.08)`,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: `rgba(${getRgbValues(colors.accent)}, 0.15)`,
  },
  adminLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.accent,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  bubbleText: { fontSize: 14, color: colors.primary, lineHeight: 20 },
  bubbleTextMe: { color: colors.secondary },
  bubbleTime: {
    fontSize: 10,
    color: `rgba(${getRgbValues(colors.primary)}, 0.4)`,
    alignSelf: "flex-end",
  },
  bubbleTimeMe: { color: `rgba(${getRgbValues(colors.secondary)}, 0.5)` },

  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 25,
    paddingTop: 15,
    backgroundColor: colors.secondary,
    borderTopWidth: 1,
    borderTopColor: `rgba(${getRgbValues(colors.primary)}, 0.1)`,
  },
  inputWrap: { flex: 1 },
  sendBtn: {
    width: 48,
    height: 48,
    backgroundColor: colors.accent,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  sendBtnDisabled: { opacity: 0.4 },
  inactiveBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: colors.secondary,
    borderTopWidth: 1,
    borderTopColor: `rgba(${getRgbValues(colors.primary)}, 0.06)`,
    alignItems: "center",
  },
  inactiveText: {
    fontSize: 13,
    color: `rgba(${getRgbValues(colors.primary)}, 0.45)`,
    textAlign: "center",
    paddingBottom: 4,
  },

  // Action buttons
  actionsRow: { flexDirection: "row", gap: 10 },
  assistanceBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: `rgba(${getRgbValues(colors.success)}, 0.1)`,
    borderWidth: 1,
    borderColor: `rgba(${getRgbValues(colors.success)}, 0.25)`,
  },
  assistanceBtnText: { fontSize: 14, fontWeight: "600", color: colors.success },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: `rgba(${getRgbValues(colors.accent)}, 0.08)`,
    borderWidth: 1,
    borderColor: `rgba(${getRgbValues(colors.accent)}, 0.2)`,
  },
  cancelBtnText: { fontSize: 14, fontWeight: "600", color: colors.accent },

  // Assistance modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    paddingHorizontal: 25,
  },
  modalSheet: {
    backgroundColor: colors.secondary,
    borderRadius: 24,
    padding: 25,
    gap: 16,
  },
  modalTitle: { fontSize: 17, fontWeight: "700", color: colors.primary },
  modalDesc: {
    fontSize: 13,
    color: `rgba(${getRgbValues(colors.primary)}, 0.5)`,
    lineHeight: 20,
  },
  modalInput: {
    backgroundColor: colors.foreground1,
    borderRadius: 14,
    padding: 14,
    fontSize: 14,
    color: colors.primary,
    minHeight: 100,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: `rgba(${getRgbValues(colors.primary)}, 0.08)`,
  },
  modalActions: { flexDirection: "row", gap: 10 },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: colors.foreground1,
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: "600",
    color: `rgba(${getRgbValues(colors.primary)}, 0.6)`,
  },
  modalSendBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: colors.primary,
  },
  modalSendBtnDisabled: { opacity: 0.4 },
  modalSendText: { fontSize: 14, fontWeight: "600", color: colors.secondary },
});
