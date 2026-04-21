import AppText from "@/components/ui/AppText";
import colors from "@/constants/colors";
import { getParentHistory } from "@/lib/api";
import { getRgbValues } from "@/lib/utils";
import { router } from "expo-router";
import {
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  SparklesIcon,
} from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Transaction {
  id: string;
  type: "SUBSCRIPTION_FEE" | "SCHEDULING_FEE";
  activity: string;
  amount: number;
  date: string;
}

export default function ParentHistory() {
  const insets = useSafeAreaInsets();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await getParentHistory();
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
    <View style={[styles.main, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.7} onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeftIcon size={20} color={colors.primary} />
        </TouchableOpacity>
        <AppText style={styles.headerTitle}>Payment history</AppText>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentInner}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {transactions.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconWrapper}>
              <ClockIcon size={32} color={colors.accent} />
            </View>
            <AppText style={styles.emptyTitle}>No history yet</AppText>
            <AppText style={styles.emptyDesc}>Your payment history will appear here.</AppText>
          </View>
        ) : (
          <View style={styles.transactionList}>
            {transactions.map((tx) => (
              <View key={tx.id} style={styles.txRow}>
                <View style={styles.txIcon}>
                  {tx.type === "SUBSCRIPTION_FEE" ? (
                    <SparklesIcon size={16} color={colors.accent} />
                  ) : (
                    <CalendarIcon size={16} color={colors.accent} />
                  )}
                </View>
                <View style={styles.txInfo}>
                  <AppText style={styles.txTitle} numberOfLines={1}>{tx.activity}</AppText>
                  <AppText style={styles.txDate}>{tx.date}</AppText>
                </View>
                <AppText style={styles.txAmount}>-${tx.amount.toFixed(2)}</AppText>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  main: { flex: 1, backgroundColor: colors.secondary },
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
  backBtn: { width: 40, height: 40, justifyContent: "center", alignItems: "center", backgroundColor: colors.foreground1, borderRadius: 12 },
  headerTitle: { flex: 1, fontSize: 16, fontWeight: "600", color: colors.primary, textAlign: "center", marginHorizontal: 8 },
  content: { flex: 1, backgroundColor: colors.foreground1 },
  contentInner: { padding: 25 },
  emptyState: { marginTop: 60, alignItems: "center", paddingHorizontal: 30 },
  emptyIconWrapper: { width: 72, height: 72, borderRadius: 36, backgroundColor: `rgba(${getRgbValues(colors.accent)}, 0.08)`, justifyContent: "center", alignItems: "center", marginBottom: 25 },
  emptyTitle: { fontSize: 18, fontWeight: "600", marginBottom: 10, textAlign: "center" },
  emptyDesc: { fontSize: 14, textAlign: "center", lineHeight: 22, color: `rgba(${getRgbValues(colors.primary)}, 0.5)` },
  transactionList: { backgroundColor: colors.secondary, borderRadius: 25, overflow: "hidden" },
  txRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 18, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: `rgba(${getRgbValues(colors.primary)}, 0.05)` },
  txIcon: { width: 40, height: 40, backgroundColor: `rgba(${getRgbValues(colors.accent)}, 0.08)`, borderRadius: 10, justifyContent: "center", alignItems: "center" },
  txInfo: { flex: 1, gap: 5 },
  txTitle: { fontSize: 14, fontWeight: "600", color: colors.primary },
  txDate: { fontSize: 12, color: `rgba(${getRgbValues(colors.primary)}, 0.45)` },
  txAmount: { fontSize: 14, fontWeight: "600", color: colors.accent },
});
