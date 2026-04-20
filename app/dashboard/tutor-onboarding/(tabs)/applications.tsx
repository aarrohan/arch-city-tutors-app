import AppText from "@/components/ui/AppText";
import colors from "@/constants/colors";
import { getTutorApplications } from "@/lib/api";
import { getRgbValues, formatDateCT } from "@/lib/utils";
import * as Linking from "expo-linking";
import * as SecureStore from "expo-secure-store";
import { ArrowUpRight, ClipboardList, Plus } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TutorApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

interface ITutorApplication {
  id: string;
  status: TutorApplicationStatus;
  rejectionReason?: string;
  createdAt: string;
}

const STATUS_CONFIG: Record<
  TutorApplicationStatus,
  { color: string; bg: string; label: string }
> = {
  PENDING: {
    color: "#b45309",
    bg: "rgba(249, 115, 22, 0.12)",
    label: "Under Review",
  },
  APPROVED: {
    color: "#66bc46",
    bg: "rgba(102, 188, 70, 0.12)",
    label: "Approved",
  },
  REJECTED: {
    color: "#cc1220",
    bg: "rgba(204, 18, 32, 0.12)",
    label: "Rejected",
  },
};

const openInBrowser = async (path: string) => {
  const token = await SecureStore.getItemAsync("token");
  const url = `https://app.archcitytutors.com/api/mobile-app/auth/app-redirect?token=${token}&to=${path}`;
  Linking.openURL(url);
};

export default function Applications() {
  const insets = useSafeAreaInsets();
  const [applications, setApplications] = useState<ITutorApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await getTutorApplications();
      setApplications(data || []);
    } catch {
      setApplications([]);
    } finally {
      setLoading(false);
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

  const sorted = [...applications].reverse();
  const canApply =
    applications.length === 0 ||
    applications[applications.length - 1].status === "REJECTED";

  return (
    <View style={{ flex: 1, backgroundColor: colors.foreground1 }}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View>
          <AppText style={styles.headerTitle}>My applications</AppText>
        </View>

        {canApply && (
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.applyBtn}
            onPress={() =>
              openInBrowser("/tutor-onboarding-dashboard/applications/apply")
            }
          >
            <Plus size={16} color={colors.secondary} strokeWidth={2.5} />
            <AppText style={styles.applyBtnText}>Apply</AppText>
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.loaderWrapper}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          {sorted.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconWrapper}>
                <ClipboardList size={32} color={colors.accent} />
              </View>

              <AppText style={styles.emptyTitle}>No applications yet</AppText>

              <AppText style={styles.emptyDesc}>
                Tap the Apply button to submit your first tutor application.
              </AppText>
            </View>
          ) : (
            sorted.map((app) => {
              const status = STATUS_CONFIG[app.status];

              return (
                <TouchableOpacity
                  key={app.id}
                  activeOpacity={0.75}
                  style={styles.card}
                  onPress={() =>
                    openInBrowser(
                      `/tutor-onboarding-dashboard/applications/${app.id}`,
                    )
                  }
                >
                  <View style={styles.cardTop}>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: status.bg },
                      ]}
                    >
                      <View
                        style={[
                          styles.statusDot,
                          { backgroundColor: status.color },
                        ]}
                      />
                      <AppText
                        style={[styles.statusLabel, { color: status.color }]}
                      >
                        {status.label}
                      </AppText>
                    </View>

                    <ArrowUpRight
                      size={16}
                      color={`rgba(${getRgbValues(colors.primary)}, 0.5)`}
                    />
                  </View>

                  <AppText style={styles.cardDate}>
                    Submitted {formatDateCT(app.createdAt)}
                  </AppText>

                  {app.status === "REJECTED" && app.rejectionReason && (
                    <View style={styles.rejectionBox}>
                      <AppText style={styles.rejectionLabel}>
                        Rejection reason
                      </AppText>
                      <AppText style={styles.rejectionText}>
                        {app.rejectionReason}
                      </AppText>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: 25,
    paddingHorizontal: 25,
    backgroundColor: colors.secondary,
    borderBottomWidth: 1,
    borderBottomColor: `rgba(${getRgbValues(colors.primary)}, 0.1)`,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 2,
  },
  applyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.accent,
    borderRadius: 10,
  },
  applyBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.secondary,
  },
  loaderWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    padding: 25,
    gap: 12,
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
    overflow: "hidden",
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
  cardDate: {
    fontSize: 14,
    color: `rgba(${getRgbValues(colors.primary)}, 0.65)`,
  },
  rejectionBox: {
    marginTop: 14,
    padding: 12,
    backgroundColor: "rgba(204, 18, 32, 0.06)",
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#cc1220",
  },
  rejectionLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#cc1220",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  rejectionText: {
    fontSize: 13,
    color: "#cc1220",
    lineHeight: 19,
  },
});
