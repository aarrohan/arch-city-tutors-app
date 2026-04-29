import Avatar from "@/components/ui/Avatar";
import ProfileHeader from "@/components/ui/ProfileHeader";
import AppText from "@/components/ui/AppText";
import colors from "@/constants/colors";
import { images } from "@/constants/images";
import { createParentStudent, getParentStudents, loginAsStudent } from "@/lib/api";
import { getRgbValues } from "@/lib/utils";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import {
  CalendarDaysIcon,
  CalendarCheckIcon,
  ChevronDownIcon,
  LogInIcon,
  PlusIcon,
  UsersIcon,
} from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const GRADES = [
  { label: "Kindergarten", value: "Kindergarten" },
  { label: "1st Grade", value: "1" },
  { label: "2nd Grade", value: "2" },
  { label: "3rd Grade", value: "3" },
  { label: "4th Grade", value: "4" },
  { label: "5th Grade", value: "5" },
  { label: "6th Grade", value: "6" },
  { label: "7th Grade", value: "7" },
  { label: "8th Grade", value: "8" },
  { label: "9th Grade", value: "9" },
  { label: "10th Grade", value: "10" },
  { label: "11th Grade", value: "11" },
  { label: "12th Grade", value: "12" },
  { label: "College-aged", value: "College-aged" },
  { label: "Adult Levels", value: "Adult Levels" },
];

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
  const insets = useSafeAreaInsets();
  const [students, setStudents] = useState<Student[]>([]);
  const [maxStudents, setMaxStudents] = useState<number>(0);
  const [refreshing, setRefreshing] = useState(false);

  // modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [grade, setGrade] = useState("");
  const [gradePickerOpen, setGradePickerOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const data = await getParentStudents();
      setStudents(data?.students ?? []);
      setMaxStudents(data?.maxStudents ?? 0);
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

  const handleLoginAsStudent = async (studentId: string) => {
    try {
      const currentToken = await SecureStore.getItemAsync("token");
      const { token: studentToken } = await loginAsStudent(studentId);
      await SecureStore.setItemAsync("parentToken", currentToken ?? "");
      await SecureStore.setItemAsync("token", studentToken);
      router.replace("/dashboard/student-dashboard" as any);
    } catch {}
  };

  const openModal = () => {
    setFirstName("");
    setLastName("");
    setGrade("");
    setError("");
    setGradePickerOpen(false);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setGradePickerOpen(false);
  };

  const handleCreate = async () => {
    if (!firstName.trim()) { setError("First name is required."); return; }
    if (!lastName.trim()) { setError("Last name is required."); return; }
    if (!grade) { setError("Grade is required."); return; }
    setError("");
    setSubmitting(true);
    try {
      await createParentStudent({ firstName: firstName.trim(), lastName: lastName.trim(), grade });
      closeModal();
      load();
    } catch (e: any) {
      const msg = e?.response?.data?.error ?? "Something went wrong. Please try again.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const gradeLabel = GRADES.find((g) => g.value === grade)?.label ?? "Select grade";

  return (
    <View style={styles.main}>
      <ImageBackground source={images.screenBG1} style={styles.imgBg}>
        <ProfileHeader from="parent" />

        <View style={styles.contentBox}>
          <View style={styles.listHeader}>
            <View style={styles.listTitleGroup}>
              <AppText style={styles.listTitle}>My Students</AppText>
              {maxStudents > 0 && (
                <AppText style={styles.slotsText}>
                  {maxStudents - students.length} of {maxStudents} left
                </AppText>
              )}
            </View>
            <TouchableOpacity activeOpacity={0.7} style={styles.addBtn} onPress={openModal}>
              <PlusIcon size={18} color={colors.secondary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.list}
            contentContainerStyle={styles.listInner}
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
                  Tap the + button to add your first student.
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
                      <TouchableOpacity
                        activeOpacity={0.75}
                        style={styles.loginBtn}
                        onPress={() => handleLoginAsStudent(student.id)}
                      >
                        <LogInIcon size={14} color={colors.secondary} />
                        <AppText style={styles.loginBtnText}>Log in</AppText>
                      </TouchableOpacity>
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
        </View>
      </ImageBackground>

      {/* Create student modal */}
      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={closeModal}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={closeModal} />
        <View style={[styles.modalSheet, { paddingBottom: insets.bottom + 20 }]}>
          <View style={styles.modalHandle} />
          <AppText style={styles.modalTitle}>Add Student</AppText>

          <View style={styles.field}>
            <AppText style={styles.fieldLabel}>First Name</AppText>
            <TextInput
              style={styles.input}
              placeholder="Enter first name"
              placeholderTextColor={`rgba(${getRgbValues(colors.primary)}, 0.35)`}
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.field}>
            <AppText style={styles.fieldLabel}>Last Name</AppText>
            <TextInput
              style={styles.input}
              placeholder="Enter last name"
              placeholderTextColor={`rgba(${getRgbValues(colors.primary)}, 0.35)`}
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.field}>
            <AppText style={styles.fieldLabel}>Grade</AppText>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.select}
              onPress={() => setGradePickerOpen((v) => !v)}
            >
              <AppText style={[styles.selectText, !grade && styles.selectPlaceholder]}>
                {gradeLabel}
              </AppText>
              <ChevronDownIcon size={16} color={`rgba(${getRgbValues(colors.primary)}, 0.4)`} />
            </TouchableOpacity>
            {gradePickerOpen && (
              <View style={styles.dropdown}>
                <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled>
                  {GRADES.map((g) => (
                    <TouchableOpacity
                      key={g.value}
                      activeOpacity={0.7}
                      style={[styles.dropdownItem, grade === g.value && styles.dropdownItemActive]}
                      onPress={() => { setGrade(g.value); setGradePickerOpen(false); }}
                    >
                      <AppText style={[styles.dropdownItemText, grade === g.value && styles.dropdownItemTextActive]}>
                        {g.label}
                      </AppText>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {error ? <AppText style={styles.errorText}>{error}</AppText> : null}

          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.submitBtn, submitting && { opacity: 0.6 }]}
            onPress={handleCreate}
            disabled={submitting}
          >
            {submitting
              ? <ActivityIndicator color={colors.secondary} />
              : <AppText style={styles.submitBtnText}>Create Student</AppText>}
          </TouchableOpacity>
        </View>
      </Modal>
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
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 25,
    paddingTop: 25,
    paddingBottom: 15,
  },
  listTitleGroup: { gap: 2 },
  listTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.primary,
  },
  slotsText: {
    fontSize: 12,
    color: `rgba(${getRgbValues(colors.primary)}, 0.45)`,
  },
  addBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.accent,
    justifyContent: "center",
    alignItems: "center",
  },
  list: { flex: 1 },
  listInner: {
    paddingHorizontal: 25,
    paddingBottom: 25,
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
  loginBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: colors.accent,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  loginBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.secondary,
  },
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
  // modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalSheet: {
    backgroundColor: colors.foreground1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 25,
    paddingTop: 14,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: `rgba(${getRgbValues(colors.primary)}, 0.15)`,
    alignSelf: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 22,
  },
  field: { marginBottom: 16 },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: `rgba(${getRgbValues(colors.primary)}, 0.6)`,
    marginBottom: 8,
  },
  input: {
    height: 50,
    backgroundColor: colors.secondary,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    color: colors.primary,
    borderWidth: 1,
    borderColor: `rgba(${getRgbValues(colors.primary)}, 0.08)`,
  },
  select: {
    height: 50,
    backgroundColor: colors.secondary,
    borderRadius: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: `rgba(${getRgbValues(colors.primary)}, 0.08)`,
  },
  selectText: {
    fontSize: 15,
    color: colors.primary,
  },
  selectPlaceholder: {
    color: `rgba(${getRgbValues(colors.primary)}, 0.35)`,
  },
  dropdown: {
    marginTop: 6,
    backgroundColor: colors.secondary,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: `rgba(${getRgbValues(colors.primary)}, 0.08)`,
    overflow: "hidden",
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownItemActive: {
    backgroundColor: `rgba(${getRgbValues(colors.accent)}, 0.08)`,
  },
  dropdownItemText: {
    fontSize: 14,
    color: colors.primary,
  },
  dropdownItemTextActive: {
    color: colors.accent,
    fontWeight: "600",
  },
  errorText: {
    fontSize: 13,
    color: colors.accent,
    marginBottom: 12,
  },
  submitBtn: {
    height: 52,
    backgroundColor: colors.accent,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.secondary,
  },
});
