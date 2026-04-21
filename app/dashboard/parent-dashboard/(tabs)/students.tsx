import Avatar from "@/components/ui/Avatar";
import ProfileHeader from "@/components/ui/ProfileHeader";
import AppText from "@/components/ui/AppText";
import colors from "@/constants/colors";
import { images } from "@/constants/images";
import { getParentStudents } from "@/lib/api";
import { getRgbValues } from "@/lib/utils";
import {
  CalendarDaysIcon,
  CalendarCheckIcon,
  UsersIcon,
} from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import {
  ImageBackground,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  profileImgUrl: string | null;
  email: string | null;
  upcomingSchedules: number;
  totalSchedules: number;
}

export default function ParentStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await getParentStudents();
      setStudents(data ?? []);
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

  return (
    <View style={styles.main}>
      <ImageBackground source={images.screenBG1} style={styles.imgBg}>
        <ProfileHeader from="parent" />

        <ScrollView
          style={styles.contentBox}
          contentContainerStyle={styles.contentBoxInner}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {students.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconWrapper}>
                <UsersIcon size={32} color={colors.accent} />
              </View>
              <AppText style={styles.emptyTitle}>No students yet</AppText>
              <AppText style={styles.emptyDesc}>
                Student accounts linked to your profile will appear here.
              </AppText>
            </View>
          ) : (
            students.map((student) => {
              const name = `${student.firstName} ${student.lastName}`;
              return (
                <View key={student.id} style={styles.card}>
                  <View style={styles.cardTop}>
                    <Avatar
                      profileImgUrl={student.profileImgUrl ?? undefined}
                      name={name}
                      width={50}
                      height={50}
                    />
                    <View style={styles.cardInfo}>
                      <AppText style={styles.cardName}>{name}</AppText>
                      {student.email ? (
                        <AppText style={styles.cardEmail} numberOfLines={1}>
                          {student.email}
                        </AppText>
                      ) : null}
                    </View>
                  </View>

                  <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                      <View style={styles.statIcon}>
                        <CalendarDaysIcon size={14} color={colors.accent} />
                      </View>
                      <View>
                        <AppText style={styles.statValue}>
                          {student.totalSchedules}
                        </AppText>
                        <AppText style={styles.statLabel}>Total</AppText>
                      </View>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                      <View style={styles.statIcon}>
                        <CalendarCheckIcon size={14} color="#f97316" />
                      </View>
                      <View>
                        <AppText style={styles.statValue}>
                          {student.upcomingSchedules}
                        </AppText>
                        <AppText style={styles.statLabel}>Upcoming</AppText>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
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
  },
  contentBoxInner: {
    paddingHorizontal: 25,
    paddingVertical: 25,
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
    padding: 20,
    gap: 16,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  cardInfo: { flex: 1 },
  cardName: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 4,
  },
  cardEmail: {
    fontSize: 12,
    color: `rgba(${getRgbValues(colors.primary)}, 0.45)`,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.foreground1,
    borderRadius: 14,
    padding: 14,
    gap: 0,
  },
  statItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primary,
  },
  statLabel: {
    fontSize: 11,
    color: `rgba(${getRgbValues(colors.primary)}, 0.45)`,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: `rgba(${getRgbValues(colors.primary)}, 0.08)`,
    marginHorizontal: 14,
  },
});
