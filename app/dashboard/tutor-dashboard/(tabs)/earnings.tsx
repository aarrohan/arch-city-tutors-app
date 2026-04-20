import ProfileHeader from "@/components/ui/ProfileHeader";
import AppText from "@/components/ui/AppText";
import colors from "@/constants/colors";
import { images } from "@/constants/images";
import { getTutorEarnings } from "@/lib/api";
import { getRgbValues } from "@/lib/utils";
import { CalendarCheckIcon, DollarSignIcon } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import {
  ImageBackground,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

interface Transaction {
  scheduleId: string;
  title: string;
  amount: number;
  date: string;
}

export default function TutorEarnings() {
  const [totalEarning, setTotalEarning] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await getTutorEarnings();
      setTotalEarning(data.totalEarning ?? 0);
      setTransactions(data.transactions ?? []);
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
        <ProfileHeader from="tutor" />

        <ScrollView
          style={styles.contentBox}
          contentContainerStyle={styles.contentBoxInner}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {transactions.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconWrapper}>
                <DollarSignIcon size={32} color={colors.accent} />
              </View>
              <AppText style={styles.emptyTitle}>No earnings yet</AppText>
              <AppText style={styles.emptyDesc}>
                Your earnings will appear here once a session is completed.
              </AppText>
            </View>
          ) : (
            <View style={styles.transactionList}>
              {transactions.map((tx, i) => (
                <View key={tx.scheduleId + i} style={styles.txRow}>
                  <View style={styles.txIcon}>
                    <CalendarCheckIcon size={16} color={colors.success} />
                  </View>
                  <View style={styles.txInfo}>
                    <AppText style={styles.txTitle} numberOfLines={1}>
                      {tx.title}
                    </AppText>
                    <AppText style={styles.txDate}>{tx.date}</AppText>
                  </View>
                  <AppText style={styles.txAmount}>
                    +${tx.amount.toFixed(2)}
                  </AppText>
                </View>
              ))}
            </View>
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
    paddingHorizontal: 25,
    paddingVertical: 25,
    backgroundColor: colors.foreground1,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  contentBoxInner: {
    paddingBottom: 25,
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
  transactionList: {
    backgroundColor: colors.secondary,
    borderRadius: 25,
    overflow: "hidden",
  },
  txRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: `rgba(${getRgbValues(colors.primary)}, 0.05)`,
  },
  txIcon: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(102, 188, 70, 0.1)",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  txInfo: {
    flex: 1,
    gap: 5,
  },
  txTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
  },
  txDate: {
    fontSize: 12,
    color: `rgba(${getRgbValues(colors.primary)}, 0.45)`,
  },
  txAmount: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgb(102, 188, 70)",
  },
});
