import ProfileHeader from "@/components/ui/ProfileHeader";
import AppText from "@/components/ui/AppText";
import colors from "@/constants/colors";
import { images } from "@/constants/images";
import { getParentStats } from "@/lib/api";
import { getRgbValues } from "@/lib/utils";
import {
  CalendarCheckIcon,
  CalendarDaysIcon,
  CalendarXIcon,
  SearchIcon,
  UsersIcon,
} from "lucide-react-native";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ImageBackground,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface ParentStats {
  totalSessions: number;
  upcomingSessions: number;
  completedSessions: number;
  canceledSessions: number;
  studentCount: number;
}

interface StatCardProps {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
  onPress?: () => void;
}

function StatCard({ icon, iconBg, label, value, onPress }: StatCardProps) {
  return (
    <TouchableOpacity activeOpacity={0.75} style={styles.card} onPress={onPress} disabled={!onPress}>
      <View style={[styles.cardIconWrapper, { backgroundColor: iconBg }]}>
        {icon}
      </View>
      <View style={styles.cardText}>
        <AppText style={styles.cardValue}>{value}</AppText>
        <AppText style={styles.cardLabel}>{label}</AppText>
      </View>
    </TouchableOpacity>
  );
}

export default function ParentDashboardHome() {
  const [stats, setStats] = useState<ParentStats | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await getParentStats();
      setStats(data);
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

  const fmt = (n: number) => (n ?? 0).toString();

  return (
    <View style={styles.main}>
      <ImageBackground source={images.screenBG1} style={styles.imgBg}>
        <ProfileHeader from="parent" />

        <ScrollView
          style={styles.contentBox}
          contentContainerStyle={styles.contentBoxInner}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.row}>
            <StatCard
              icon={<CalendarDaysIcon size={18} color={colors.secondary} />}
              iconBg={colors.primary}
              label="Total Sessions"
              value={fmt(stats?.totalSessions ?? 0)}
              onPress={() => router.push("/dashboard/parent-dashboard/schedules?filter=ALL" as any)}
            />
            <StatCard
              icon={<UsersIcon size={18} color={colors.secondary} />}
              iconBg="#7c3aed"
              label="Students"
              value={fmt(stats?.studentCount ?? 0)}
              onPress={() => router.push("/dashboard/parent-dashboard/students" as any)}
            />
          </View>

          <View style={[styles.row, { marginTop: 10 }]}>
            <StatCard
              icon={<CalendarCheckIcon size={18} color={colors.secondary} />}
              iconBg="#f97316"
              label="Upcoming"
              value={fmt(stats?.upcomingSessions ?? 0)}
              onPress={() => router.push("/dashboard/parent-dashboard/schedules?filter=ACTIVE" as any)}
            />
            <StatCard
              icon={<CalendarCheckIcon size={18} color={colors.secondary} />}
              iconBg={colors.success}
              label="Completed"
              value={fmt(stats?.completedSessions ?? 0)}
              onPress={() => router.push("/dashboard/parent-dashboard/schedules?filter=COMPLETED" as any)}
            />
          </View>

          <View style={[styles.row, { marginTop: 10 }]}>
            <StatCard
              icon={<CalendarXIcon size={18} color={colors.secondary} />}
              iconBg={colors.accent}
              label="Canceled"
              value={fmt(stats?.canceledSessions ?? 0)}
              onPress={() => router.push("/dashboard/parent-dashboard/schedules?filter=CANCELED" as any)}
            />
            <View
              style={{
                flex: 1,
                backgroundColor: colors.secondary,
                borderRadius: 25,
                padding: 25,
                gap: 15,
                opacity: 0,
              }}
            ></View>
          </View>
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
  },
  row: { flexDirection: "row", gap: 10 },
  card: {
    flex: 1,
    backgroundColor: colors.secondary,
    borderRadius: 25,
    padding: 25,
    gap: 15,
  },
  cardIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  cardText: { gap: 2 },
  cardValue: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.primary,
  },
  cardLabel: {
    marginTop: 5,
    fontSize: 12,
    color: `rgba(${getRgbValues(colors.primary)}, 0.5)`,
  },
});
