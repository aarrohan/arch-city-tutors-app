import ProfileHeader from "@/components/ui/ProfileHeader";
import AppText from "@/components/ui/AppText";
import colors from "@/constants/colors";
import { images } from "@/constants/images";
import { getStudentStats } from "@/lib/api";
import { getRgbValues } from "@/lib/utils";
import {
  CalendarCheckIcon,
  CalendarDaysIcon,
  CalendarXIcon,
  ExternalLinkIcon,
  SearchIcon,
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
import * as Linking from "expo-linking";
import * as SecureStore from "expo-secure-store";

interface StudentStats {
  totalSessions: number;
  upcomingSessions: number;
  completedSessions: number;
  canceledSessions: number;
}

interface StatCardProps {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
}

function StatCard({ icon, iconBg, label, value }: StatCardProps) {
  return (
    <View style={styles.card}>
      <View style={[styles.cardIconWrapper, { backgroundColor: iconBg }]}>
        {icon}
      </View>
      <View style={styles.cardText}>
        <AppText style={styles.cardValue}>{value}</AppText>
        <AppText style={styles.cardLabel}>{label}</AppText>
      </View>
    </View>
  );
}

export default function StudentDashboardHome() {
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await getStudentStats();
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

  const openFindTutors = async () => {
    const token = await SecureStore.getItemAsync("token");
    const url = `https://app.archcitytutors.com/api/mobile-app/auth/app-redirect?token=${token}&to=/student-dashboard/tutors`;
    Linking.openURL(url);
  };

  const fmt = (n: number) => (n ?? 0).toString();

  return (
    <View style={styles.main}>
      <ImageBackground source={images.screenBG1} style={styles.imgBg}>
        <ProfileHeader from="student" />

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
            />
            <StatCard
              icon={<CalendarCheckIcon size={18} color={colors.secondary} />}
              iconBg="#f97316"
              label="Upcoming"
              value={fmt(stats?.upcomingSessions ?? 0)}
            />
          </View>

          <View style={[styles.row, { marginTop: 10 }]}>
            <StatCard
              icon={<CalendarCheckIcon size={18} color={colors.secondary} />}
              iconBg={colors.success}
              label="Completed"
              value={fmt(stats?.completedSessions ?? 0)}
            />
            <StatCard
              icon={<CalendarXIcon size={18} color={colors.secondary} />}
              iconBg={colors.accent}
              label="Canceled"
              value={fmt(stats?.canceledSessions ?? 0)}
            />
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
