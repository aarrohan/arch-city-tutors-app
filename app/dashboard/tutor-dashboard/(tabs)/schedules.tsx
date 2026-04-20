import Avatar from "@/components/ui/Avatar";
import ProfileHeader from "@/components/ui/ProfileHeader";
import AppText from "@/components/ui/AppText";
import colors from "@/constants/colors";
import { images } from "@/constants/images";
import { getTutorSchedules } from "@/lib/api";
import { formatName, getRgbValues } from "@/lib/utils";
import { router } from "expo-router";
import {
  CalendarDaysIcon,
  CircleDollarSignIcon,
  ClockIcon,
  MapPinIcon,
  VideoIcon,
} from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import {
  ImageBackground,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

type ScheduleStatus = "ACTIVE" | "COMPLETED" | "CANCELED" | "COMPENSATED";
type FilterTab = "ALL" | "ACTIVE" | "COMPLETED" | "CANCELED";

interface Schedule {
  id: string;
  title: string;
  status: ScheduleStatus;
  duration: string;
  location: string;
  tutorRate: number;
  createdAt: string;
  availability: { date: string; time: string } | null;
  student: {
    profileImgUrl: string | null;
    firstName: string;
    lastName: string;
    grade: string;
  } | null;
}

const STATUS_CONFIG: Record<
  ScheduleStatus,
  { label: string; color: string; bg: string }
> = {
  ACTIVE: {
    label: "Upcoming",
    color: "#f97316",
    bg: "rgba(249, 115, 22, 0.12)",
  },
  COMPLETED: {
    label: "Completed",
    color: "#66bc46",
    bg: "rgba(102, 188, 70, 0.12)",
  },
  CANCELED: {
    label: "Canceled",
    color: "#cc1220",
    bg: "rgba(204, 18, 32, 0.12)",
  },
  COMPENSATED: {
    label: "Compensated",
    color: "#66bc46",
    bg: "rgba(102, 188, 70, 0.12)",
  },
};

const FILTERS: { label: string; value: FilterTab }[] = [
  { label: "All", value: "ALL" },
  { label: "Upcoming", value: "ACTIVE" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Canceled", value: "CANCELED" },
];

function formatDuration(duration: string) {
  if (duration === "FORTY_FIVE_MINUTES") return "45 min";
  if (duration === "SIXTY_MINUTES") return "60 min";
  return duration;
}

export default function TutorSchedules() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [filter, setFilter] = useState<FilterTab>("ALL");
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await getTutorSchedules();
      setSchedules(data ?? []);
    } catch {
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    load();
  }, [load]);

  const filtered = schedules.filter((s) => {
    if (filter === "ALL") return true;
    return s.status === filter;
  });

  return (
    <View style={styles.main}>
      <ImageBackground source={images.screenBG1} style={styles.imgBg}>
        <ProfileHeader from="tutor" />

        <View style={styles.contentBox}>
          {/* Filter tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterBar}
            contentContainerStyle={styles.filterRow}
          >
            {FILTERS.map((f) => (
              <TouchableOpacity
                key={f.value}
                activeOpacity={0.7}
                onPress={() => setFilter(f.value)}
                style={[
                  styles.filterChip,
                  filter === f.value && styles.filterChipActive,
                ]}
              >
                <AppText
                  style={[
                    styles.filterChipText,
                    filter === f.value && styles.filterChipTextActive,
                  ]}
                >
                  {f.label}
                </AppText>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* List */}
          <ScrollView
            style={styles.list}
            contentContainerStyle={styles.listInner}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {filtered.length === 0 ? (
              <View style={styles.emptyState}>
                <View style={styles.emptyIconWrapper}>
                  <CalendarDaysIcon size={32} color={colors.accent} />
                </View>
                <AppText style={styles.emptyTitle}>No schedules found</AppText>
                <AppText style={styles.emptyDesc}>
                  Your schedules will appear here once they are created.
                </AppText>
              </View>
            ) : (
              filtered.map((schedule) => {
                const cfg = STATUS_CONFIG[schedule.status];
                const studentName = schedule.student
                  ? formatName(schedule.student.firstName, schedule.student.lastName, schedule.student.grade)
                  : "Student";
                return (
                  <TouchableOpacity
                    key={schedule.id}
                    activeOpacity={0.7}
                    style={styles.card}
                    onPress={() =>
                      router.push(
                        `/dashboard/tutor-dashboard/schedule/${schedule.id}` as any,
                      )
                    }
                  >
                    {/* Header row */}
                    <View style={styles.studentRow}>
                      <Avatar
                        profileImgUrl={
                          schedule.student?.profileImgUrl ?? undefined
                        }
                        name={studentName}
                        width={45}
                        height={45}
                      />

                      <View style={{ gap: 5 }}>
                        <AppText style={styles.studentName}>
                          {studentName}
                        </AppText>
                        <View
                          style={[
                            styles.statusBadge,
                            { backgroundColor: cfg.bg },
                          ]}
                        >
                          <AppText
                            style={[styles.statusText, { color: cfg.color }]}
                          >
                            {cfg.label}
                          </AppText>
                        </View>
                      </View>
                    </View>

                    {/* Title */}
                    <AppText style={styles.cardTitle} numberOfLines={2}>
                      {schedule.title}
                    </AppText>

                    {/* Meta row */}
                    <View style={styles.metaRow}>
                      <View style={styles.metaItem}>
                        <CircleDollarSignIcon
                          size={13}
                          color={`rgba(${getRgbValues(colors.primary)}, 0.4)`}
                        />
                        <AppText style={styles.metaText}>
                          ${schedule.tutorRate.toFixed(2)}
                        </AppText>
                      </View>
                      {schedule.availability ? (
                        <View style={styles.metaItem}>
                          <CalendarDaysIcon
                            size={13}
                            color={`rgba(${getRgbValues(colors.primary)}, 0.4)`}
                          />
                          <AppText style={styles.metaText}>
                            {schedule.availability.date},{" "}
                            {schedule.availability.time}
                          </AppText>
                        </View>
                      ) : null}
                      <View style={styles.metaItem}>
                        <ClockIcon
                          size={13}
                          color={`rgba(${getRgbValues(colors.primary)}, 0.4)`}
                        />
                        <AppText style={styles.metaText}>
                          {formatDuration(schedule.duration)}
                        </AppText>
                      </View>
                      <View style={styles.metaItem}>
                        {schedule.location === "VIRTUAL" ? (
                          <VideoIcon
                            size={13}
                            color={`rgba(${getRgbValues(colors.primary)}, 0.4)`}
                          />
                        ) : (
                          <MapPinIcon
                            size={13}
                            color={`rgba(${getRgbValues(colors.primary)}, 0.4)`}
                          />
                        )}
                        <AppText style={styles.metaText}>
                          {schedule.location === "VIRTUAL"
                            ? "Virtual"
                            : "In-Person"}
                        </AppText>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  main: { flex: 1 },
  imgBg: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  contentBox: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.foreground1,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    overflow: "hidden",
  },
  filterBar: {
    flexGrow: 0,
    flexShrink: 0,
  },
  filterRow: {
    paddingVertical: 25,
    paddingHorizontal: 25,
    gap: 8,
    alignItems: "center",
  },
  filterChip: {
    paddingVertical: 4,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: `rgba(${getRgbValues(colors.primary)}, 0.1)`,
    backgroundColor: colors.secondary,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: "500",
    color: `rgba(${getRgbValues(colors.primary)}, 0.6)`,
  },
  filterChipTextActive: {
    color: colors.secondary,
  },
  list: { flex: 1 },
  listInner: {
    paddingBottom: 25,
    paddingHorizontal: 25,
    gap: 10,
  },
  emptyState: {
    marginTop: 60,
    alignItems: "center",
    paddingHorizontal: 30,
  },
  emptyIconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: `rgba(${getRgbValues(colors.accent)}, 0.08)`,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
  },
  emptyDesc: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
    color: `rgba(${getRgbValues(colors.primary)}, 0.5)`,
  },
  card: {
    backgroundColor: colors.secondary,
    borderRadius: 20,
    padding: 25,
    gap: 15,
  },
  studentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  studentName: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  metaText: {
    fontSize: 12,
    color: `rgba(${getRgbValues(colors.primary)}, 0.5)`,
  },
});
