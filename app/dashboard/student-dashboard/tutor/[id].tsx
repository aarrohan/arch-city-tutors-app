import AppText from "@/components/ui/AppText";
import Avatar from "@/components/ui/Avatar";
import colors from "@/constants/colors";
import {
  bookMultipleTutor,
  bookTutor,
  getTutorAvailabilities,
  getTutorProfile,
} from "@/lib/api";
import { formatGrade, getRgbValues } from "@/lib/utils";
import { router, useLocalSearchParams } from "expo-router";
import {
  ArrowLeftIcon,
  BadgeCheckIcon,
  BlocksIcon,
  BookOpenIcon,
  BriefcaseIcon,
  CircleDollarSignIcon,
  ClockIcon,
  GraduationCapIcon,
  MapPinIcon,
  MonitorIcon,
  SchoolIcon,
  UsersRoundIcon,
  XIcon,
} from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface InstituteHistory {
  id: string;
  type: "EDUCATION" | "EMPLOYMENT";
  title: string;
  institute: string;
  startDate: string;
  endDate: string;
}

interface TutorProfile {
  id: string;
  firstName: string;
  lastName: string;
  profileImgUrl: string | null;
  bio: string | null;
  isCurrentlyTeachingInClassroom: boolean;
  providesVirtual: boolean;
  providesInPerson: boolean;
  inPersonLocation: string | null;
  otherInPersonLocations: string[];
  fortyFiveMinutesVirtualRate: number | null;
  sixtyMinutesVirtualRate: number | null;
  fortyFiveMinutesInPersonRate: number | null;
  sixtyMinutesInPersonRate: number | null;
  subjects: string[];
  grades: string[];
  schoolDistrict: string | null;
  userInstituteHistories: InstituteHistory[];
  totalSchedules: number;
}

interface Availability {
  id: string;
  date: string;
  time: string;
  isBooked: boolean;
}

type BookStep = 1 | 2 | 3 | 4 | 5;

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function parseDateMMDDYYYY(dateStr: string): Date {
  const [mm, dd, yyyy] = dateStr.split("-").map(Number);
  return new Date(yyyy, mm - 1, dd);
}

// ─── Booking Modal ──────────────────────────────────────────────────────────

function BookingModal({
  visible,
  onClose,
  tutor,
}: {
  visible: boolean;
  onClose: () => void;
  tutor: TutorProfile;
}) {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<BookStep>(1);
  const [title, setTitle] = useState("");
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [avLoading, setAvLoading] = useState(false);
  const [selectedAvailabilityId, setSelectedAvailabilityId] = useState("");
  const [selectedDuration, setSelectedDuration] = useState<45 | 60 | 0>(0);
  const [selectedLocation, setSelectedLocation] = useState<
    "virtual" | "in-person" | ""
  >("");
  const [selectedInPersonLocation, setSelectedInPersonLocation] = useState("");
  const [booking, setBooking] = useState(false);

  const reset = () => {
    setStep(1);
    setTitle("");
    setSelectedAvailabilityId("");
    setSelectedDuration(0);
    setSelectedLocation("");
    setSelectedInPersonLocation("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const loadAvailabilities = useCallback(async () => {
    setAvLoading(true);
    try {
      const data = await getTutorAvailabilities(tutor.id);
      setAvailabilities(data);
    } catch {
      setAvailabilities([]);
    } finally {
      setAvLoading(false);
    }
  }, [tutor.id]);

  useEffect(() => {
    if (visible && step === 2) {
      loadAvailabilities();
    }
  }, [visible, step, loadAvailabilities]);

  const handleBook = async () => {
    if (booking) return;
    setBooking(true);
    try {
      const data = await bookTutor(tutor.id, {
        availabilityId: selectedAvailabilityId,
        duration: selectedDuration as number,
        location: selectedLocation as string,
        title,
        ...(selectedLocation === "in-person" && selectedInPersonLocation
          ? { selectedInPersonLocation }
          : {}),
      });
      handleClose();
      if (data.url) {
        await Linking.openURL(data.url);
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ?? "Something went wrong";
      Alert.alert("Error", msg);
    } finally {
      setBooking(false);
    }
  };

  const sessionRate = () => {
    if (selectedDuration === 45) {
      return selectedLocation === "virtual"
        ? tutor.fortyFiveMinutesVirtualRate
        : tutor.fortyFiveMinutesInPersonRate;
    }
    return selectedLocation === "virtual"
      ? tutor.sixtyMinutesVirtualRate
      : tutor.sixtyMinutesInPersonRate;
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={[bStyles.overlay, { paddingTop: insets.top }]}>
        <View style={bStyles.sheet}>
          {/* Header */}
          <View style={bStyles.header}>
            <AppText style={bStyles.headerTitle}>Book now</AppText>
            {!booking && (
              <TouchableOpacity onPress={handleClose} style={bStyles.closeBtn}>
                <XIcon size={20} color={colors.primary} />
              </TouchableOpacity>
            )}
          </View>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={[
              bStyles.body,
              { paddingBottom: insets.bottom + 20 },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {/* Step 1: Title */}
            {step === 1 && (
              <View>
                <AppText style={bStyles.label}>Give it a title:</AppText>
                <TextInput
                  style={bStyles.input}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Algebra Preparation for Midterm"
                  placeholderTextColor={`rgba(${getRgbValues(colors.primary)}, 0.35)`}
                />
                <View style={bStyles.btnRow}>
                  <TouchableOpacity
                    style={[
                      bStyles.btn,
                      title.length === 0 && bStyles.btnDisabled,
                    ]}
                    onPress={() => {
                      if (title.length > 0) {
                        setSelectedAvailabilityId("");
                        setStep(2);
                      }
                    }}
                  >
                    <AppText style={bStyles.btnText}>Next</AppText>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleClose}>
                    <AppText style={bStyles.linkText}>Close</AppText>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Step 2: Availability */}
            {step === 2 && (
              <View>
                <AppText style={bStyles.label}>
                  Choose a date and time from the tutor&apos;s availability:
                </AppText>

                {avLoading ? (
                  <ActivityIndicator style={{ marginVertical: 20 }} />
                ) : availabilities.length === 0 ? (
                  <View style={bStyles.emptyBox}>
                    <AppText style={bStyles.emptyText}>
                      No available slots.
                    </AppText>
                  </View>
                ) : (
                  availabilities.map((av) => {
                    const parsed = parseDateMMDDYYYY(av.date);
                    const dayLabel = daysOfWeek[parsed.getDay()];
                    const isSelected = selectedAvailabilityId === av.id;
                    return (
                      <View key={av.id} style={bStyles.avRow}>
                        <View style={bStyles.avCard}>
                          <AppText style={bStyles.avDate}>
                            {av.date} ({dayLabel})
                          </AppText>
                          <View style={bStyles.avTimeRow}>
                            <ClockIcon
                              size={13}
                              color={`rgba(${getRgbValues(colors.primary)}, 0.5)`}
                            />
                            <AppText style={bStyles.avTime}>{av.time}</AppText>
                          </View>
                          <TouchableOpacity
                            style={[
                              bStyles.selectBtn,
                              isSelected && bStyles.selectBtnActive,
                            ]}
                            onPress={() => setSelectedAvailabilityId(av.id)}
                          >
                            <AppText
                              style={[
                                bStyles.selectBtnText,
                                isSelected && bStyles.selectBtnTextActive,
                              ]}
                            >
                              {isSelected ? "Selected" : "Select"}
                            </AppText>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  })
                )}

                <View style={bStyles.btnRow}>
                  <TouchableOpacity
                    style={[
                      bStyles.btn,
                      !selectedAvailabilityId && bStyles.btnDisabled,
                    ]}
                    onPress={() => {
                      if (selectedAvailabilityId) {
                        setSelectedDuration(0);
                        setStep(3);
                      }
                    }}
                  >
                    <AppText style={bStyles.btnText}>Next</AppText>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setStep(1)}>
                    <AppText style={bStyles.linkText}>Go back</AppText>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Step 3: Duration */}
            {step === 3 && (
              <View>
                <AppText style={bStyles.label}>Select the duration:</AppText>

                {[45 as const, 60 as const].map((dur) => {
                  const vRate =
                    dur === 45
                      ? tutor.fortyFiveMinutesVirtualRate
                      : tutor.sixtyMinutesVirtualRate;
                  const iRate =
                    dur === 45
                      ? tutor.fortyFiveMinutesInPersonRate
                      : tutor.sixtyMinutesInPersonRate;
                  const isSelected = selectedDuration === dur;
                  return (
                    <View key={dur} style={bStyles.durationCard}>
                      <View style={bStyles.durationInfo}>
                        <View style={bStyles.durationLabelRow}>
                          <ClockIcon size={14} color={colors.primary} />
                          <AppText style={bStyles.durationLabel}>
                            {dur} minutes
                          </AppText>
                        </View>
                        <View style={bStyles.rateLines}>
                          {vRate != null && vRate > 0 && (
                            <AppText style={bStyles.rateLine}>
                              Virtual:{" "}
                              <AppText style={bStyles.rateValue}>
                                ${vRate}
                              </AppText>
                            </AppText>
                          )}
                          {iRate != null && iRate > 0 && (
                            <AppText style={bStyles.rateLine}>
                              In-person:{" "}
                              <AppText style={bStyles.rateValue}>
                                ${iRate}
                              </AppText>
                            </AppText>
                          )}
                        </View>
                      </View>
                      <TouchableOpacity
                        style={[
                          bStyles.selectBtn,
                          isSelected && bStyles.selectBtnActive,
                        ]}
                        onPress={() => setSelectedDuration(dur)}
                      >
                        <AppText
                          style={[
                            bStyles.selectBtnText,
                            isSelected && bStyles.selectBtnTextActive,
                          ]}
                        >
                          {isSelected ? "Selected" : "Select"}
                        </AppText>
                      </TouchableOpacity>
                    </View>
                  );
                })}

                <View style={bStyles.btnRow}>
                  <TouchableOpacity
                    style={[
                      bStyles.btn,
                      selectedDuration === 0 && bStyles.btnDisabled,
                    ]}
                    onPress={() => {
                      if (selectedDuration !== 0) {
                        setSelectedLocation("");
                        setStep(4);
                      }
                    }}
                  >
                    <AppText style={bStyles.btnText}>Next</AppText>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setStep(2)}>
                    <AppText style={bStyles.linkText}>Go back</AppText>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Step 4: Location */}
            {step === 4 && (
              <View>
                <AppText style={bStyles.label}>Select the location:</AppText>

                {tutor.providesVirtual && (
                  <TouchableOpacity
                    style={[
                      bStyles.locationCard,
                      selectedLocation === "virtual" &&
                        bStyles.locationCardActive,
                    ]}
                    onPress={() => {
                      setSelectedLocation("virtual");
                      setSelectedInPersonLocation("");
                    }}
                  >
                    <View style={bStyles.locationRow}>
                      <MonitorIcon
                        size={16}
                        color={
                          selectedLocation === "virtual"
                            ? colors.accent
                            : colors.primary
                        }
                      />
                      <AppText
                        style={[
                          bStyles.locationLabel,
                          selectedLocation === "virtual" && {
                            color: colors.accent,
                          },
                        ]}
                      >
                        Virtual
                      </AppText>
                    </View>
                    {selectedLocation === "virtual" && (
                      <AppText style={bStyles.selectedTag}>Selected</AppText>
                    )}
                  </TouchableOpacity>
                )}

                {tutor.providesInPerson && (
                  <>
                    <TouchableOpacity
                      style={[
                        bStyles.locationCard,
                        selectedLocation === "in-person" &&
                          bStyles.locationCardActive,
                      ]}
                      onPress={() => {
                        setSelectedLocation("in-person");
                        setSelectedInPersonLocation(
                          tutor.inPersonLocation ?? "",
                        );
                      }}
                    >
                      <View style={bStyles.locationRow}>
                        <UsersRoundIcon
                          size={16}
                          color={
                            selectedLocation === "in-person"
                              ? colors.accent
                              : colors.primary
                          }
                        />
                        <AppText
                          style={[
                            bStyles.locationLabel,
                            selectedLocation === "in-person" && {
                              color: colors.accent,
                            },
                          ]}
                        >
                          In-person
                        </AppText>
                      </View>
                      {selectedLocation === "in-person" && (
                        <AppText style={bStyles.selectedTag}>Selected</AppText>
                      )}
                    </TouchableOpacity>

                    {selectedLocation === "in-person" &&
                      tutor.otherInPersonLocations.length > 0 && (
                        <View style={bStyles.locationSubList}>
                          <AppText style={bStyles.locationSubLabel}>
                            Select meeting location:
                          </AppText>
                          {[
                            tutor.inPersonLocation ?? "",
                            ...tutor.otherInPersonLocations,
                          ].map((loc, i) => (
                            <TouchableOpacity
                              key={i}
                              style={[
                                bStyles.locationSubItem,
                                selectedInPersonLocation === loc &&
                                  bStyles.locationSubItemActive,
                              ]}
                              onPress={() => setSelectedInPersonLocation(loc)}
                            >
                              <AppText
                                style={[
                                  bStyles.locationSubItemText,
                                  selectedInPersonLocation === loc && {
                                    color: colors.accent,
                                  },
                                ]}
                              >
                                {loc}
                              </AppText>
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}
                  </>
                )}

                <View style={bStyles.btnRow}>
                  <TouchableOpacity
                    style={[
                      bStyles.btn,
                      selectedLocation === "" && bStyles.btnDisabled,
                    ]}
                    onPress={() => {
                      if (selectedLocation !== "") setStep(5);
                    }}
                  >
                    <AppText style={bStyles.btnText}>Next</AppText>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setStep(3)}>
                    <AppText style={bStyles.linkText}>Go back</AppText>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Step 5: Confirm */}
            {step === 5 && (
              <View>
                <AppText style={bStyles.confirmText}>
                  You are almost there! Please review the details before
                  proceeding. To confirm the booking you need to pay{" "}
                  <AppText style={bStyles.confirmHighlight}>
                    $5 non-refundable
                  </AppText>{" "}
                  scheduling fee. When the session is completed, you need to pay{" "}
                  <AppText style={bStyles.confirmHighlight}>
                    ${sessionRate()}
                  </AppText>{" "}
                  to the tutor for{" "}
                  <AppText style={bStyles.confirmHighlight}>
                    {selectedDuration} minutes
                  </AppText>{" "}
                  which will take place{" "}
                  <AppText style={bStyles.confirmHighlight}>
                    {selectedLocation === "virtual"
                      ? "virtually"
                      : `in-person${selectedInPersonLocation ? ` at ${selectedInPersonLocation}` : ""}`}
                  </AppText>
                  .
                </AppText>

                <View style={bStyles.btnRow}>
                  <TouchableOpacity
                    style={[bStyles.btn, booking && bStyles.btnDisabled]}
                    onPress={handleBook}
                  >
                    {booking ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <AppText style={bStyles.btnText}>
                        Confirm & pay $5
                      </AppText>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setStep(4)}>
                    <AppText style={bStyles.linkText}>Go back</AppText>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// ─── Book Multiple Modal ─────────────────────────────────────────────────────

interface SelectedAvailability {
  id: string;
  dateStr: string;
  title: string;
  duration: 45 | 60;
  location: "virtual" | "in-person" | "";
  selectedInPersonLocation: string;
}

function BookMultipleModal({
  visible,
  onClose,
  tutor,
  availabilities,
}: {
  visible: boolean;
  onClose: () => void;
  tutor: TutorProfile;
  availabilities: Availability[];
}) {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<1 | 2>(1);
  const [selected, setSelected] = useState<SelectedAvailability[]>([]);
  const [booking, setBooking] = useState(false);

  const reset = () => {
    setStep(1);
    setSelected([]);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const allConfigured =
    selected.length >= 2 &&
    selected.every(
      (s) =>
        s.title &&
        s.duration &&
        s.location &&
        (s.location !== "in-person" || s.selectedInPersonLocation),
    );

  const handleBook = async () => {
    if (booking) return;
    setBooking(true);
    try {
      const data = await bookMultipleTutor(
        tutor.id,
        selected.map((s) => ({
          id: s.id,
          title: s.title,
          duration: s.duration,
          location: s.location,
          ...(s.selectedInPersonLocation
            ? { selectedInPersonLocation: s.selectedInPersonLocation }
            : {}),
        })),
      );
      handleClose();
      if (data.url) await Linking.openURL(data.url);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ?? "Something went wrong";
      Alert.alert("Error", msg);
    } finally {
      setBooking(false);
    }
  };

  const toggleSlot = (av: Availability) => {
    const parsed = parseDateMMDDYYYY(av.date);
    const dayLabel = daysOfWeek[parsed.getDay()];
    const dateStr = `${av.date} (${dayLabel}) ${av.time}`;
    if (selected.find((s) => s.id === av.id)) {
      setSelected((prev) => prev.filter((s) => s.id !== av.id));
    } else {
      setSelected((prev) => [
        ...prev,
        {
          id: av.id,
          dateStr,
          title: "",
          duration: 45,
          location: "",
          selectedInPersonLocation: "",
        },
      ]);
    }
  };

  const updateSlot = (index: number, patch: Partial<SelectedAvailability>) => {
    setSelected((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...patch };
      return next;
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={[bStyles.overlay, { paddingTop: insets.top }]}>
        <View style={bStyles.sheet}>
          <View style={bStyles.header}>
            <AppText style={bStyles.headerTitle}>Book multiple</AppText>
            {!booking && (
              <TouchableOpacity onPress={handleClose} style={bStyles.closeBtn}>
                <XIcon size={20} color={colors.primary} />
              </TouchableOpacity>
            )}
          </View>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={[
              bStyles.body,
              { paddingBottom: insets.bottom + 20 },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {/* Step 1: Pick slots */}
            {step === 1 && (
              <View>
                <AppText style={bStyles.label}>
                  Select 2 or more slots from the tutor&apos;s availability:
                </AppText>

                {/* Selected chips */}
                {selected.length > 0 && (
                  <View style={mStyles.chips}>
                    {selected.map((s) => (
                      <TouchableOpacity
                        key={s.id}
                        style={mStyles.chip}
                        onPress={() =>
                          toggleSlot({
                            id: s.id,
                            date: "",
                            time: "",
                            isBooked: false,
                          })
                        }
                      >
                        <AppText style={mStyles.chipText}>{s.dateStr}</AppText>
                        <XIcon size={11} color={colors.accent} />
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                {availabilities.length === 0 ? (
                  <View style={bStyles.emptyBox}>
                    <AppText style={bStyles.emptyText}>
                      No available slots.
                    </AppText>
                  </View>
                ) : (
                  availabilities.map((av) => {
                    const parsed = parseDateMMDDYYYY(av.date);
                    const dayLabel = daysOfWeek[parsed.getDay()];
                    const isSelected = !!selected.find((s) => s.id === av.id);
                    return (
                      <View key={av.id} style={bStyles.avRow}>
                        <View style={bStyles.avCard}>
                          <AppText style={bStyles.avDate}>
                            {av.date} ({dayLabel})
                          </AppText>
                          <View style={bStyles.avTimeRow}>
                            <ClockIcon
                              size={13}
                              color={`rgba(${getRgbValues(colors.primary)}, 0.5)`}
                            />
                            <AppText style={bStyles.avTime}>{av.time}</AppText>
                          </View>
                          <TouchableOpacity
                            style={[
                              bStyles.selectBtn,
                              isSelected && bStyles.selectBtnActive,
                            ]}
                            onPress={() => toggleSlot(av)}
                          >
                            <AppText
                              style={[
                                bStyles.selectBtnText,
                                isSelected && bStyles.selectBtnTextActive,
                              ]}
                            >
                              {isSelected ? "Selected" : "Select"}
                            </AppText>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  })
                )}

                <View style={bStyles.btnRow}>
                  <TouchableOpacity
                    style={[
                      bStyles.btn,
                      selected.length < 2 && bStyles.btnDisabled,
                    ]}
                    onPress={() => {
                      if (selected.length >= 2) setStep(2);
                    }}
                  >
                    <AppText style={bStyles.btnText}>Next</AppText>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleClose}>
                    <AppText style={bStyles.linkText}>Close</AppText>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Step 2: Configure each slot */}
            {step === 2 && (
              <View>
                <AppText style={[bStyles.label, { marginBottom: 20 }]}>
                  Set title, duration, and location for each session:
                </AppText>

                {selected.map((s, index) => (
                  <View key={s.id} style={mStyles.slotBlock}>
                    {/* Date divider */}
                    <View style={mStyles.dateDivider}>
                      <View style={mStyles.dividerLine} />
                      <AppText style={mStyles.dateLabel}>{s.dateStr}</AppText>
                      <View style={mStyles.dividerLine} />
                    </View>

                    {/* Title */}
                    <View style={mStyles.fieldRow}>
                      <AppText style={mStyles.fieldLabel}>Title</AppText>
                      <TextInput
                        style={bStyles.input}
                        value={s.title}
                        onChangeText={(v) => updateSlot(index, { title: v })}
                        placeholder="Algebra Preparation for Midterm"
                        placeholderTextColor={`rgba(${getRgbValues(colors.primary)}, 0.35)`}
                      />
                    </View>

                    {/* Duration */}
                    <View style={mStyles.fieldRow}>
                      <AppText style={mStyles.fieldLabel}>Duration</AppText>
                      <View style={mStyles.toggleRow}>
                        {([45, 60] as const).map((dur) => (
                          <TouchableOpacity
                            key={dur}
                            style={[
                              mStyles.toggleBtn,
                              s.duration === dur && mStyles.toggleBtnActive,
                            ]}
                            onPress={() => updateSlot(index, { duration: dur })}
                          >
                            <ClockIcon
                              size={13}
                              color={
                                s.duration === dur ? "#fff" : colors.primary
                              }
                            />
                            <AppText
                              style={[
                                mStyles.toggleBtnText,
                                s.duration === dur && { color: "#fff" },
                              ]}
                            >
                              {dur} mins
                            </AppText>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>

                    {/* Location */}
                    <View style={mStyles.fieldRow}>
                      <AppText style={mStyles.fieldLabel}>Location</AppText>
                      <View style={mStyles.toggleRow}>
                        {tutor.providesVirtual && (
                          <TouchableOpacity
                            style={[
                              mStyles.toggleBtn,
                              s.location === "virtual" &&
                                mStyles.toggleBtnActive,
                            ]}
                            onPress={() =>
                              updateSlot(index, {
                                location: "virtual",
                                selectedInPersonLocation: "",
                              })
                            }
                          >
                            <MonitorIcon
                              size={13}
                              color={
                                s.location === "virtual"
                                  ? "#fff"
                                  : colors.primary
                              }
                            />
                            <AppText
                              style={[
                                mStyles.toggleBtnText,
                                s.location === "virtual" && { color: "#fff" },
                              ]}
                            >
                              Virtual
                            </AppText>
                          </TouchableOpacity>
                        )}
                        {tutor.providesInPerson && (
                          <TouchableOpacity
                            style={[
                              mStyles.toggleBtn,
                              s.location === "in-person" &&
                                mStyles.toggleBtnActive,
                            ]}
                            onPress={() =>
                              updateSlot(index, {
                                location: "in-person",
                                selectedInPersonLocation:
                                  tutor.inPersonLocation ?? "",
                              })
                            }
                          >
                            <UsersRoundIcon
                              size={13}
                              color={
                                s.location === "in-person"
                                  ? "#fff"
                                  : colors.primary
                              }
                            />
                            <AppText
                              style={[
                                mStyles.toggleBtnText,
                                s.location === "in-person" && { color: "#fff" },
                              ]}
                            >
                              In-person
                            </AppText>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>

                    {/* In-person sub-location */}
                    {s.location === "in-person" &&
                      tutor.otherInPersonLocations.length > 0 && (
                        <View style={mStyles.fieldRow}>
                          <AppText style={mStyles.fieldLabel}>Meet at</AppText>
                          <View style={{ gap: 6 }}>
                            {[
                              tutor.inPersonLocation ?? "",
                              ...tutor.otherInPersonLocations,
                            ].map((loc, i) => (
                              <TouchableOpacity
                                key={i}
                                style={[
                                  bStyles.locationSubItem,
                                  s.selectedInPersonLocation === loc &&
                                    bStyles.locationSubItemActive,
                                ]}
                                onPress={() =>
                                  updateSlot(index, {
                                    selectedInPersonLocation: loc,
                                  })
                                }
                              >
                                <AppText
                                  style={[
                                    bStyles.locationSubItemText,
                                    s.selectedInPersonLocation === loc && {
                                      color: colors.accent,
                                    },
                                  ]}
                                >
                                  {loc}
                                </AppText>
                              </TouchableOpacity>
                            ))}
                          </View>
                        </View>
                      )}
                  </View>
                ))}

                <View style={bStyles.btnRow}>
                  <TouchableOpacity
                    style={[
                      bStyles.btn,
                      (!allConfigured || booking) && bStyles.btnDisabled,
                    ]}
                    onPress={handleBook}
                  >
                    {booking ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <AppText style={bStyles.btnText}>
                        Confirm & pay ${selected.length * 5}
                      </AppText>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setStep(1)}>
                    <AppText style={bStyles.linkText}>Go back</AppText>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// ─── Main Screen ────────────────────────────────────────────────────────────

export default function TutorDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [tutor, setTutor] = useState<TutorProfile | null>(null);
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookMultipleOpen, setBookMultipleOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [profileData, avData] = await Promise.all([
        getTutorProfile(id),
        getTutorAvailabilities(id),
      ]);
      setTutor(profileData);
      setAvailabilities(avData);
    } catch {
      Alert.alert("Error", "Failed to load tutor profile.");
      router.back();
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading || !tutor) {
    return (
      <View style={[s.main, { paddingTop: insets.top }]}>
        <View style={s.center}>
          <ActivityIndicator size="large" />
        </View>
      </View>
    );
  }

  const name = `${tutor.firstName} ${tutor.lastName[0]}.`;
  const education = tutor.userInstituteHistories.filter(
    (h) => h.type === "EDUCATION",
  );
  const employment = tutor.userInstituteHistories.filter(
    (h) => h.type === "EMPLOYMENT",
  );
  const allRates = [
    tutor.fortyFiveMinutesVirtualRate,
    tutor.sixtyMinutesVirtualRate,
    tutor.fortyFiveMinutesInPersonRate,
    tutor.sixtyMinutesInPersonRate,
  ].filter((r): r is number => r != null);
  const minRate = allRates.length > 0 ? Math.min(...allRates) : null;

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const fullDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return (
    <View style={[s.main, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          style={s.backBtn}
        >
          <ArrowLeftIcon size={20} color={colors.primary} />
        </TouchableOpacity>
        <AppText style={s.headerTitle} numberOfLines={1}>
          Tutor Profile
        </AppText>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero Card ── */}
        <View style={s.heroCard}>
          <View style={s.heroBanner} />
          <View style={s.heroContent}>
            <View style={s.avatarRing}>
              <Avatar
                profileImgUrl={tutor.profileImgUrl ?? undefined}
                name={name}
                width={80}
                height={80}
              />
            </View>
            <AppText style={s.heroName}>{name}</AppText>
            {tutor.schoolDistrict ? (
              <View style={s.heroDistrictRow}>
                <SchoolIcon
                  size={14}
                  color={`rgba(${getRgbValues(colors.primary)}, 0.4)`}
                />
                <AppText style={s.heroDistrict}>{tutor.schoolDistrict}</AppText>
              </View>
            ) : null}
            <View style={s.heroBadges}>
              <View style={s.badgeGreen}>
                <BadgeCheckIcon size={11} color="#16a34a" />
                <AppText style={[s.badgeText, { color: "#16a34a" }]}>
                  Certified teacher
                </AppText>
              </View>
              {tutor.isCurrentlyTeachingInClassroom && (
                <View style={s.badgeBlue}>
                  <SchoolIcon size={11} color="#2563eb" />
                  <AppText style={[s.badgeText, { color: "#2563eb" }]}>
                    Currently teaching in classroom
                  </AppText>
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={s.body}>
          {/* ── About ── */}
          {tutor.bio ? (
            <View style={s.card}>
              <AppText style={s.bioText}>{tutor.bio}</AppText>
            </View>
          ) : null}

          {/* ── What I Teach ── */}
          {(tutor.subjects.length > 0 || tutor.grades.length > 0) && (
            <View style={s.card}>
              {tutor.subjects.length > 0 && (
                <View style={s.teachBlock}>
                  <View style={s.teachLabelRow}>
                    <View style={s.teachIconBox}>
                      <BookOpenIcon size={13} color={colors.accent} />
                    </View>
                    <AppText style={s.teachLabel}>Subjects</AppText>
                  </View>
                  <View style={s.chipWrap}>
                    {tutor.subjects.map((subj, i) => (
                      <View key={i} style={s.chip}>
                        <AppText style={s.chipText}>
                          {subj.split(" ~ ")[0]}
                        </AppText>
                      </View>
                    ))}
                  </View>
                </View>
              )}
              {tutor.grades.length > 0 && (
                <View style={s.teachBlock}>
                  <View style={s.teachLabelRow}>
                    <View style={s.teachIconBox}>
                      <BlocksIcon size={13} color={colors.accent} />
                    </View>
                    <AppText style={s.teachLabel}>Grade levels</AppText>
                  </View>
                  <View style={s.chipWrap}>
                    {tutor.grades.map((g, i) => (
                      <View key={i} style={[s.chip, s.chipAlt]}>
                        <AppText style={s.chipText}>{formatGrade(g)}</AppText>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          )}

          {/* ── Session + Rates (combined cards) ── */}
          {(tutor.providesVirtual || tutor.providesInPerson) && (
            <View style={s.sessionRateRow}>
              {tutor.providesVirtual && (
                <View style={[s.sessionRateCard, { flex: 1 }]}>
                  <View style={s.srHeader}>
                    <View style={s.srIconWrap}>
                      <MonitorIcon size={14} color={colors.accent} />
                    </View>
                    <AppText style={s.srType}>Virtual</AppText>
                  </View>

                  <View style={s.srLocRow}>
                    <MapPinIcon
                      size={14}
                      color={`rgba(${getRgbValues(colors.primary)}, 1)`}
                    />
                    <AppText style={s.srLoc} numberOfLines={1}>
                      Zoom, Google Meet, etc.
                    </AppText>
                  </View>

                  <View style={s.srDivider} />

                  {tutor.fortyFiveMinutesVirtualRate != null ||
                  tutor.sixtyMinutesVirtualRate != null ? (
                    <>
                      {tutor.fortyFiveMinutesVirtualRate != null && (
                        <View style={s.srRateLine}>
                          <AppText style={s.srDur}>
                            45 min session rate:
                          </AppText>
                          <AppText style={s.srAmt}>
                            ${tutor.fortyFiveMinutesVirtualRate}
                          </AppText>
                        </View>
                      )}
                      {tutor.sixtyMinutesVirtualRate != null && (
                        <View style={[s.srRateLine, { marginBottom: 0 }]}>
                          <AppText style={s.srDur}>
                            60 min session rate:
                          </AppText>
                          <AppText style={s.srAmt}>
                            ${tutor.sixtyMinutesVirtualRate}
                          </AppText>
                        </View>
                      )}
                    </>
                  ) : (
                    <AppText style={s.srNA}>Contact for rates</AppText>
                  )}
                </View>
              )}
              {tutor.providesInPerson && (
                <View style={[s.sessionRateCard, { flex: 1 }]}>
                  <View style={s.srHeader}>
                    <View style={s.srIconWrap}>
                      <UsersRoundIcon size={14} color={colors.accent} />
                    </View>
                    <AppText style={s.srType}>In-person</AppText>
                  </View>

                  {tutor.inPersonLocation && (
                    <>
                      <View style={s.srLocRow}>
                        <MapPinIcon
                          size={14}
                          color={`rgba(${getRgbValues(colors.primary)}, 1)`}
                        />
                        <AppText style={s.srLoc} numberOfLines={1}>
                          {tutor.inPersonLocation}
                        </AppText>
                      </View>

                      {tutor.otherInPersonLocations.length > 0 && (
                        <>
                          {tutor.otherInPersonLocations.map((loc, i) => (
                            <View key={i} style={s.srLocRow}>
                              <MapPinIcon
                                size={14}
                                color={`rgba(${getRgbValues(colors.primary)}, 1)`}
                              />
                              <AppText style={s.srLoc} numberOfLines={1}>
                                {loc}
                              </AppText>
                            </View>
                          ))}
                        </>
                      )}
                    </>
                  )}
                  <View style={s.srDivider} />
                  {tutor.fortyFiveMinutesInPersonRate != null ||
                  tutor.sixtyMinutesInPersonRate != null ? (
                    <>
                      {tutor.fortyFiveMinutesInPersonRate != null && (
                        <View style={s.srRateLine}>
                          <AppText style={s.srDur}>
                            45 min session rate:
                          </AppText>
                          <AppText style={s.srAmt}>
                            ${tutor.fortyFiveMinutesInPersonRate}
                          </AppText>
                        </View>
                      )}
                      {tutor.sixtyMinutesInPersonRate != null && (
                        <View style={[s.srRateLine, { marginBottom: 0 }]}>
                          <AppText style={s.srDur}>
                            60 min session rate:
                          </AppText>
                          <AppText style={s.srAmt}>
                            ${tutor.sixtyMinutesInPersonRate}
                          </AppText>
                        </View>
                      )}
                    </>
                  ) : (
                    <AppText style={s.srNA}>Contact for rates</AppText>
                  )}
                </View>
              )}
            </View>
          )}

          {/* ── Education ── */}
          {education.length > 0 && (
            <View>
              <AppText style={s.sectionLabel}>Education</AppText>
              <View style={s.card}>
                {education.map((item, index) => (
                  <View key={item.id}>
                    <View style={s.timelineItem}>
                      <View style={s.timelineDot}>
                        <GraduationCapIcon size={13} color={colors.accent} />
                      </View>
                      <View style={s.timelineBody}>
                        <AppText style={s.timelineTitle}>{item.title}</AppText>
                        <AppText style={s.timelineInstitute}>
                          {item.institute}
                        </AppText>
                        <AppText style={s.timelineDates}>
                          {item.startDate} — {item.endDate}
                        </AppText>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* ── Work Experience ── */}
          {employment.length > 0 && (
            <View>
              <AppText style={s.sectionLabel}>Work Experience</AppText>
              <View style={s.card}>
                {employment.map((item, index) => (
                  <View key={item.id}>
                    <View style={s.timelineItem}>
                      <View style={s.timelineDot}>
                        <BriefcaseIcon size={13} color={colors.accent} />
                      </View>
                      <View style={s.timelineBody}>
                        <AppText style={s.timelineTitle}>{item.title}</AppText>
                        <AppText style={s.timelineInstitute}>
                          {item.institute}
                        </AppText>
                        <AppText style={s.timelineDates}>
                          {item.startDate} — {item.endDate}
                        </AppText>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* ── Availability ── */}
          <View>
            <AppText style={s.sectionLabel}>Availability</AppText>
            {availabilities.length === 0 ? (
              <View style={s.emptyCard}>
                <ClockIcon
                  size={22}
                  color={`rgba(${getRgbValues(colors.primary)}, 0.2)`}
                />
                <AppText style={s.emptyText}>
                  No open slots at this time.
                </AppText>
              </View>
            ) : (
              (() => {
                const grouped: Record<string, { id: string; time: string }[]> =
                  {};
                for (const av of availabilities) {
                  if (!grouped[av.date]) grouped[av.date] = [];
                  grouped[av.date].push({ id: av.id, time: av.time });
                }
                const entries = Object.entries(grouped);
                return (
                  <View style={s.avCard}>
                    {entries.map(([date, slots], gi) => {
                      const parsed = parseDateMMDDYYYY(date);
                      return (
                        <View
                          key={date}
                          style={[
                            s.avGroup,
                            gi < entries.length - 1 && s.avGroupDivider,
                          ]}
                        >
                          <View style={s.avDateHeader}>
                            <View style={s.avDot} />
                            <AppText style={s.avDateLabel}>
                              {fullDays[parsed.getDay()]},{" "}
                              {months[parsed.getMonth()]} {parsed.getDate()}
                            </AppText>
                          </View>
                          <View style={s.avSlots}>
                            {slots.map((slot) => (
                              <View key={slot.id} style={s.avTimePill}>
                                <ClockIcon size={10} color={colors.accent} />
                                <AppText style={s.avTimeText}>
                                  {slot.time}
                                </AppText>
                              </View>
                            ))}
                          </View>
                        </View>
                      );
                    })}
                  </View>
                );
              })()
            )}
          </View>
        </View>
      </ScrollView>

      {/* Book bar */}
      <View style={[s.bookBar, { paddingBottom: insets.bottom + 12 }]}>
        <View style={s.bookBtnRow}>
          <TouchableOpacity
            style={s.bookBtnPrimary}
            onPress={() => setBookingOpen(true)}
          >
            <CircleDollarSignIcon size={17} color="#fff" />
            <AppText style={s.bookBtnText}>Book now</AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.bookBtnPrimary, s.bookBtnGreen]}
            onPress={() => setBookMultipleOpen(true)}
          >
            <AppText style={s.bookBtnText}>Book multiple</AppText>
          </TouchableOpacity>
        </View>
      </View>

      <BookingModal
        visible={bookingOpen}
        onClose={() => setBookingOpen(false)}
        tutor={tutor}
      />
      <BookMultipleModal
        visible={bookMultipleOpen}
        onClose={() => setBookMultipleOpen(false)}
        tutor={tutor}
        availabilities={availabilities}
      />
    </View>
  );
}

const s = StyleSheet.create({
  main: { flex: 1, backgroundColor: colors.foreground1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 25,
    paddingVertical: 15,
    backgroundColor: colors.secondary,
    borderBottomWidth: 1,
    borderBottomColor: `rgba(${getRgbValues(colors.primary)}, 0.1)`,
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

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 0 },

  // Hero card
  heroCard: {
    margin: 25,
    marginBottom: 0,
    backgroundColor: colors.secondary,
    borderRadius: 20,
    overflow: "hidden",
  },
  heroBanner: {
    height: 75,
    backgroundColor: colors.accent,
  },
  heroContent: {
    alignItems: "center",
    paddingHorizontal: 25,
    paddingBottom: 25,
  },
  avatarRing: {
    width: 90,
    height: 90,
    borderRadius: 100,
    borderWidth: 5,
    borderColor: colors.secondary,
    backgroundColor: colors.secondary,
    marginTop: -45,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  heroName: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.primary,
    marginTop: 10,
    marginBottom: 10,
    textAlign: "center",
  },
  heroDistrictRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 15,
  },
  heroDistrict: {
    fontSize: 12,
    color: `rgba(${getRgbValues(colors.primary)}, 0.5)`,
  },
  heroBadges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
  },
  badgeGreen: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#f0fdf4",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
  },
  badgeBlue: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#eff6ff",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
  },
  badgeText: { fontSize: 12, fontWeight: "500" },

  // Body
  body: { padding: 25, gap: 25 },

  card: {
    backgroundColor: colors.secondary,
    borderRadius: 20,
    padding: 25,
    gap: 25,
  },

  bioText: {
    fontSize: 14,
    lineHeight: 22,
    color: `rgba(${getRgbValues(colors.primary)}, 0.7)`,
  },

  sectionLabel: {
    fontSize: 10,
    fontWeight: "500",
    color: `rgba(${getRgbValues(colors.primary)}, 0.5)`,
    textTransform: "uppercase",
    marginBottom: 10,
  },

  // Subjects & grade levels
  teachBlock: { gap: 10 },
  teachLabelRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  teachIconBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: `rgba(${getRgbValues(colors.accent)}, 0.08)`,
    justifyContent: "center",
    alignItems: "center",
  },
  teachLabel: { fontSize: 14, fontWeight: "600", color: colors.primary },
  chipWrap: { flexDirection: "row", flexWrap: "wrap", gap: 6, paddingLeft: 42 },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: colors.foreground1,
  },
  chipAlt: {
    backgroundColor: colors.foreground1,
  },
  chipText: { fontSize: 12, fontWeight: "500", color: colors.primary },

  // Session
  sessionRateRow: { gap: 10 },
  sessionRateCard: {
    backgroundColor: colors.secondary,
    borderRadius: 20,
    padding: 25,
  },
  srHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  srIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: `rgba(${getRgbValues(colors.accent)}, 0.08)`,
    justifyContent: "center",
    alignItems: "center",
  },
  srType: { fontSize: 14, fontWeight: "600", color: colors.primary },
  srLocRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  srLoc: {
    fontSize: 12,
    fontWeight: "500",
    color: `rgba(${getRgbValues(colors.primary)}, 1)`,
    flex: 1,
  },
  srDivider: {
    height: 1,
    backgroundColor: `rgba(${getRgbValues(colors.primary)}, 0.06)`,
    marginTop: 10,
    marginBottom: 15,
  },
  srRateLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  srDur: { fontSize: 12, color: `rgba(${getRgbValues(colors.primary)}, 0.45)` },
  srAmt: { fontSize: 14, fontWeight: "600", color: colors.accent },
  srNA: {
    fontSize: 12,
    color: `rgba(${getRgbValues(colors.primary)}, 0.35)`,
    fontStyle: "italic",
  },

  // Timeline
  timelineItem: { flexDirection: "row", gap: 12 },
  timelineDot: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: `rgba(${getRgbValues(colors.accent)}, 0.08)`,
    justifyContent: "center",
    alignItems: "center",
  },
  timelineBody: { flex: 1, gap: 12 },
  timelineTitle: { fontSize: 14, fontWeight: "600", color: colors.primary },
  timelineInstitute: {
    fontSize: 14,
    color: `rgba(${getRgbValues(colors.primary)}, 0.55)`,
  },
  timelineDates: {
    fontSize: 12,
    fontWeight: "500",
    color: `rgba(${getRgbValues(colors.primary)}, 0.55)`,
  },

  // Availability
  avCard: {
    backgroundColor: colors.secondary,
    borderRadius: 16,
    overflow: "hidden",
  },
  avGroup: { padding: 25 },
  avGroupDivider: {
    borderBottomWidth: 1,
    borderBottomColor: `rgba(${getRgbValues(colors.primary)}, 0.06)`,
  },
  avDateHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  avDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
  },
  avDateLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
  },
  avSlots: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    paddingLeft: 14,
  },
  avTimePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: `rgba(${getRgbValues(colors.accent)}, 0.07)`,
  },
  avTimeText: { fontSize: 12, fontWeight: "600", color: colors.accent },

  // ── Empty ──
  emptyCard: {
    backgroundColor: colors.secondary,
    borderRadius: 16,
    padding: 28,
    alignItems: "center",
    gap: 8,
  },
  emptyText: {
    fontSize: 14,
    color: `rgba(${getRgbValues(colors.primary)}, 0.35)`,
    textAlign: "center",
  },

  // ── Book bar ──
  bookBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: colors.secondary,
    borderTopWidth: 1,
    borderTopColor: `rgba(${getRgbValues(colors.primary)}, 0.07)`,
  },
  bookBtnRow: { flexDirection: "row", gap: 10 },
  bookBtnPrimary: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 7,
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingVertical: 14,
  },
  bookBtnGreen: { backgroundColor: colors.success },
  bookBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },
});

const bStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: `rgba(${getRgbValues(colors.primary)}, 0.65)`,
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.secondary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: `rgba(${getRgbValues(colors.primary)}, 0.08)`,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.primary,
  },
  closeBtn: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  body: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: `rgba(${getRgbValues(colors.primary)}, 0.75)`,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: `rgba(${getRgbValues(colors.primary)}, 0.12)`,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.primary,
    backgroundColor: colors.foreground1,
    marginBottom: 16,
  },
  btnRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginTop: 16,
  },
  btn: {
    backgroundColor: colors.accent,
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 10,
    minWidth: 80,
    alignItems: "center",
  },
  btnDisabled: {
    opacity: 0.4,
  },
  btnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  linkText: {
    fontSize: 14,
    fontWeight: "500",
    color: `rgba(${getRgbValues(colors.primary)}, 0.5)`,
  },
  emptyBox: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `rgba(${getRgbValues(colors.primary)}, 0.08)`,
    alignItems: "center",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 13,
    color: `rgba(${getRgbValues(colors.primary)}, 0.4)`,
  },
  avRow: {
    marginBottom: 8,
  },
  avCard: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `rgba(${getRgbValues(colors.primary)}, 0.08)`,
    backgroundColor: colors.foreground1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  avDate: {
    flex: 1,
    fontSize: 13,
    fontWeight: "500",
    color: colors.primary,
  },
  avTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  avTime: {
    fontSize: 13,
    color: `rgba(${getRgbValues(colors.primary)}, 0.5)`,
  },
  selectBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  selectBtnActive: {
    backgroundColor: `rgba(${getRgbValues(colors.accent)}, 0.1)`,
  },
  selectBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.accent,
  },
  selectBtnTextActive: {
    color: colors.accent,
  },
  durationCard: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `rgba(${getRgbValues(colors.primary)}, 0.08)`,
    backgroundColor: colors.foreground1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  durationInfo: {
    flex: 1,
    gap: 4,
  },
  durationLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  durationLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.primary,
  },
  rateLines: {
    gap: 1,
  },
  rateLine: {
    fontSize: 12,
    color: `rgba(${getRgbValues(colors.primary)}, 0.5)`,
  },
  rateValue: {
    fontWeight: "700",
    color: colors.accent,
  },
  locationCard: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `rgba(${getRgbValues(colors.primary)}, 0.08)`,
    backgroundColor: colors.foreground1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  locationCardActive: {
    borderColor: colors.accent,
    backgroundColor: `rgba(${getRgbValues(colors.accent)}, 0.05)`,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  locationLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.primary,
  },
  selectedTag: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.accent,
  },
  locationSubList: {
    marginBottom: 8,
    gap: 6,
    paddingLeft: 4,
  },
  locationSubLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: `rgba(${getRgbValues(colors.primary)}, 0.4)`,
    marginBottom: 4,
  },
  locationSubItem: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: `rgba(${getRgbValues(colors.primary)}, 0.1)`,
    backgroundColor: colors.foreground1,
  },
  locationSubItemActive: {
    borderColor: colors.accent,
    backgroundColor: `rgba(${getRgbValues(colors.accent)}, 0.08)`,
  },
  locationSubItemText: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.primary,
  },
  confirmText: {
    fontSize: 14,
    lineHeight: 22,
    color: `rgba(${getRgbValues(colors.primary)}, 0.75)`,
  },
  confirmHighlight: {
    fontWeight: "700",
    color: colors.accent,
  },
});

const mStyles = StyleSheet.create({
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 14,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: `rgba(${getRgbValues(colors.accent)}, 0.3)`,
    backgroundColor: `rgba(${getRgbValues(colors.accent)}, 0.06)`,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.accent,
  },
  slotBlock: {
    marginBottom: 24,
  },
  dateDivider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: `rgba(${getRgbValues(colors.primary)}, 0.08)`,
  },
  dateLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: `rgba(${getRgbValues(colors.primary)}, 0.6)`,
  },
  fieldRow: {
    marginBottom: 10,
    gap: 6,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: `rgba(${getRgbValues(colors.primary)}, 0.5)`,
  },
  toggleRow: {
    flexDirection: "row",
    gap: 8,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: `rgba(${getRgbValues(colors.primary)}, 0.1)`,
    backgroundColor: colors.foreground1,
  },
  toggleBtnActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  toggleBtnText: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.primary,
  },
});
