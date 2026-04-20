import Avatar from "@/components/ui/Avatar";
import ProfileHeader from "@/components/ui/ProfileHeader";
import AppText from "@/components/ui/AppText";
import colors from "@/constants/colors";
import { images } from "@/constants/images";
import { findTutors } from "@/lib/api";
import { getRgbValues } from "@/lib/utils";
import { router } from "expo-router";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  FilterIcon,
  MonitorIcon,
  SchoolIcon,
  SearchIcon,
  UsersRoundIcon,
  XIcon,
} from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
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

// ─── Data ────────────────────────────────────────────────────────────────────

const SUBJECTS: { value: string; label: string; category: string }[] = [
  {
    value: "Grammar ~ English Language Arts (ELA)",
    label: "Grammar",
    category: "English Language Arts",
  },
  {
    value:
      "Literature (fiction, non-fiction, poetry, drama) ~ English Language Arts (ELA)",
    label: "Literature",
    category: "English Language Arts",
  },
  {
    value: "Reading ~ English Language Arts (ELA)",
    label: "Reading",
    category: "English Language Arts",
  },
  {
    value: "Reading Comprehension ~ English Language Arts (ELA)",
    label: "Reading Comprehension",
    category: "English Language Arts",
  },
  {
    value:
      "Writing (composition, grammar, creative writing, essay writing) ~ English Language Arts (ELA)",
    label: "Writing",
    category: "English Language Arts",
  },
  { value: "Algebra ~ Mathematics", label: "Algebra", category: "Mathematics" },
  {
    value:
      "Arithmetic (addition, subtraction, multiplication, division) ~ Mathematics",
    label: "Arithmetic",
    category: "Mathematics",
  },
  {
    value: "Calculus ~ Mathematics",
    label: "Calculus",
    category: "Mathematics",
  },
  {
    value: "Calculus (in advanced courses) ~ Mathematics",
    label: "Calculus (advanced)",
    category: "Mathematics",
  },
  {
    value: "Geometry ~ Mathematics",
    label: "Geometry",
    category: "Mathematics",
  },
  {
    value: "Pre-Algebra ~ Mathematics",
    label: "Pre-Algebra",
    category: "Mathematics",
  },
  {
    value: "Statistics and Probability ~ Mathematics",
    label: "Statistics & Probability",
    category: "Mathematics",
  },
  {
    value: "Trigonometry ~ Mathematics",
    label: "Trigonometry",
    category: "Mathematics",
  },
  {
    value: "Anatomy and Physiology ~ Science",
    label: "Anatomy & Physiology",
    category: "Science",
  },
  { value: "Astronomy ~ Science", label: "Astronomy", category: "Science" },
  { value: "Biology ~ Science", label: "Biology", category: "Science" },
  { value: "Chemistry ~ Science", label: "Chemistry", category: "Science" },
  {
    value: "Earth Science ~ Science",
    label: "Earth Science",
    category: "Science",
  },
  {
    value: "Environmental Science ~ Science",
    label: "Environmental Science",
    category: "Science",
  },
  {
    value: "General Science ~ Science",
    label: "General Science",
    category: "Science",
  },
  {
    value: "Life Science ~ Science",
    label: "Life Science",
    category: "Science",
  },
  {
    value: "Physical Science ~ Science",
    label: "Physical Science",
    category: "Science",
  },
  { value: "Physics ~ Science", label: "Physics", category: "Science" },
  {
    value: "Anthropology and Sociology ~ Social Studies",
    label: "Anthropology & Sociology",
    category: "Social Studies",
  },
  {
    value: "Civics and Government ~ Social Studies",
    label: "Civics & Government",
    category: "Social Studies",
  },
  {
    value: "Economics ~ Social Studies",
    label: "Economics",
    category: "Social Studies",
  },
  {
    value: "Geography ~ Social Studies",
    label: "Geography",
    category: "Social Studies",
  },
  {
    value: "U.S. History ~ Social Studies",
    label: "U.S. History",
    category: "Social Studies",
  },
  {
    value: "World History ~ Social Studies",
    label: "World History",
    category: "Social Studies",
  },
  {
    value: "American Sign Language (ASL) ~ Foreign Languages",
    label: "American Sign Language (ASL)",
    category: "Foreign Languages",
  },
  {
    value: "Chinese (Mandarin) ~ Foreign Languages",
    label: "Chinese (Mandarin)",
    category: "Foreign Languages",
  },
  {
    value: "French ~ Foreign Languages",
    label: "French",
    category: "Foreign Languages",
  },
  {
    value: "German ~ Foreign Languages",
    label: "German",
    category: "Foreign Languages",
  },
  {
    value: "Hebrew ~ Foreign Languages",
    label: "Hebrew",
    category: "Foreign Languages",
  },
  {
    value: "Italian ~ Foreign Languages",
    label: "Italian",
    category: "Foreign Languages",
  },
  {
    value: "Japanese ~ Foreign Languages",
    label: "Japanese",
    category: "Foreign Languages",
  },
  {
    value: "Korean ~ Foreign Languages",
    label: "Korean",
    category: "Foreign Languages",
  },
  {
    value: "Latin ~ Foreign Languages",
    label: "Latin",
    category: "Foreign Languages",
  },
  {
    value: "Portuguese ~ Foreign Languages",
    label: "Portuguese",
    category: "Foreign Languages",
  },
  {
    value: "Russian ~ Foreign Languages",
    label: "Russian",
    category: "Foreign Languages",
  },
  {
    value: "Mandarin ~ Foreign Languages",
    label: "Mandarin",
    category: "Foreign Languages",
  },
  {
    value: "Spanish ~ Foreign Languages",
    label: "Spanish",
    category: "Foreign Languages",
  },
  {
    value: "Vietnamese ~ Foreign Languages",
    label: "Vietnamese",
    category: "Foreign Languages",
  },
  {
    value: "Arch History ~ Electives",
    label: "Arch History",
    category: "Electives",
  },
  { value: "Band ~ Electives", label: "Band", category: "Electives" },
  {
    value: "Business Management ~ Electives",
    label: "Business Management",
    category: "Electives",
  },
  { value: "Ceramics ~ Electives", label: "Ceramics", category: "Electives" },
  { value: "Chorus ~ Electives", label: "Chorus", category: "Electives" },
  {
    value: "Computer Programming ~ Electives",
    label: "Computer Programming",
    category: "Electives",
  },
  {
    value: "Creative Writing ~ Electives",
    label: "Creative Writing",
    category: "Electives",
  },
  {
    value: "Drama/Theater Arts ~ Electives",
    label: "Drama/Theater Arts",
    category: "Electives",
  },
  {
    value: "Fashion Design ~ Electives",
    label: "Fashion Design",
    category: "Electives",
  },
  {
    value: "Film Studies ~ Electives",
    label: "Film Studies",
    category: "Electives",
  },
  {
    value: "Graphic Design ~ Electives",
    label: "Graphic Design",
    category: "Electives",
  },
  {
    value: "Journalism ~ Electives",
    label: "Journalism",
    category: "Electives",
  },
  {
    value: "Media Studies ~ Electives",
    label: "Media Studies",
    category: "Electives",
  },
  {
    value: "Music Appreciation ~ Electives",
    label: "Music Appreciation",
    category: "Electives",
  },
  {
    value: "Photography ~ Electives",
    label: "Photography",
    category: "Electives",
  },
  {
    value: "Psychology ~ Electives",
    label: "Psychology",
    category: "Electives",
  },
  { value: "Sociology ~ Electives", label: "Sociology", category: "Electives" },
  {
    value: "Speech and Debate ~ Electives",
    label: "Speech & Debate",
    category: "Electives",
  },
  {
    value: "Web Design ~ Electives",
    label: "Web Design",
    category: "Electives",
  },
];

const GRADES: { value: string; label: string }[] = [
  { value: "1", label: "1st Grade" },
  { value: "2", label: "2nd Grade" },
  { value: "3", label: "3rd Grade" },
  { value: "4", label: "4th Grade" },
  { value: "5", label: "5th Grade" },
  { value: "6", label: "6th Grade" },
  { value: "7", label: "7th Grade" },
  { value: "8", label: "8th Grade" },
  { value: "9", label: "9th Grade" },
  { value: "10", label: "10th Grade" },
  { value: "11", label: "11th Grade" },
  { value: "12", label: "12th Grade" },
  { value: "Kindergarten", label: "Kindergarten" },
  { value: "College-aged", label: "College-aged" },
  { value: "Adult Levels", label: "Adult Levels" },
];

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// ─── Types ───────────────────────────────────────────────────────────────────

interface Tutor {
  id: string;
  firstName: string;
  lastName: string;
  profileImgUrl: string | null;
  isCurrentlyTeachingInClassroom: boolean;
  providesVirtual: boolean;
  providesInPerson: boolean;
  sixtyMinutesVirtualRate: number | null;
  sixtyMinutesInPersonRate: number | null;
  totalSchedules: number;
  availabilitiesCount: number;
}

interface Filters {
  tutorName: string;
  subject: string;
  grade: string;
  schoolDistrict: string;
  scheduleLocation: "" | "VIRTUAL" | "IN_PERSON";
  date: string;
  fromTime: string;
  toTime: string;
}

const EMPTY_FILTERS: Filters = {
  tutorName: "",
  subject: "",
  grade: "",
  schoolDistrict: "",
  scheduleLocation: "",
  date: "",
  fromTime: "",
  toTime: "",
};

type FilterScreen =
  | "filters"
  | "subject"
  | "grade"
  | "date"
  | "fromTime"
  | "toTime";

function countActiveFilters(f: Filters) {
  return Object.values(f).filter((v) => v !== "").length;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatTimeDisplay(hhmm: string): string {
  if (!hhmm) return "";
  const [h, m] = hhmm.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

function formatDateDisplay(mmddyyyy: string): string {
  if (!mmddyyyy) return "";
  const [mm, dd, yyyy] = mmddyyyy.split("-");
  return `${MONTH_NAMES[Number(mm) - 1]} ${Number(dd)}, ${yyyy}`;
}

// ─── Filter Modal (single modal, internal screen stack) ───────────────────────

function FilterModal({
  visible,
  draft,
  onChange,
  onApply,
  onClose,
  onClear,
}: {
  visible: boolean;
  draft: Filters;
  onChange: (key: keyof Filters, value: string) => void;
  onApply: () => void;
  onClose: () => void;
  onClear: () => void;
}) {
  const insets = useSafeAreaInsets();
  const [screen, setScreen] = useState<FilterScreen>("filters");
  const [search, setSearch] = useState("");

  // Time picker state
  const [hour, setHour] = useState(9);
  const [minute, setMinute] = useState(0);
  const [isPM, setIsPM] = useState(false);

  // Date picker state
  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(1);
  const [year, setYear] = useState(new Date().getFullYear());

  const parseTime = (v: string) => {
    if (!v) return { hour: 9, minute: 0, isPM: false };
    const [h, m] = v.split(":").map(Number);
    return { hour: h % 12 || 12, minute: m, isPM: h >= 12 };
  };

  const parseDate = (v: string) => {
    if (!v) {
      const t = new Date();
      return {
        month: t.getMonth() + 1,
        day: t.getDate(),
        year: t.getFullYear(),
      };
    }
    const [mm, dd, yyyy] = v.split("-").map(Number);
    return { month: mm, day: dd, year: yyyy };
  };

  const openScreen = (s: FilterScreen) => {
    setSearch("");
    if (s === "fromTime") {
      const p = parseTime(draft.fromTime);
      setHour(p.hour);
      setMinute(p.minute);
      setIsPM(p.isPM);
    } else if (s === "toTime") {
      const p = parseTime(draft.toTime);
      setHour(p.hour);
      setMinute(p.minute);
      setIsPM(p.isPM);
    } else if (s === "date") {
      const p = parseDate(draft.date);
      setMonth(p.month);
      setDay(p.day);
      setYear(p.year);
    }
    setScreen(s);
  };

  const goBack = () => setScreen("filters");

  const applyTime = (field: "fromTime" | "toTime") => {
    let h = hour % 12;
    if (isPM) h += 12;
    onChange(
      field,
      `${String(h).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
    );
    goBack();
  };

  const applyDate = () => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const safeDay = Math.min(day, daysInMonth);
    onChange(
      "date",
      `${String(month).padStart(2, "0")}-${String(safeDay).padStart(2, "0")}-${year}`,
    );
    goBack();
  };

  const stepHour = (dir: 1 | -1) =>
    setHour((h) =>
      h === 12 && dir === 1 ? 1 : h === 1 && dir === -1 ? 12 : h + dir,
    );
  const stepMinute = (dir: 1 | -1) => setMinute((m) => (m + dir * 5 + 60) % 60);
  const stepMonth = (dir: 1 | -1) =>
    setMonth((m) =>
      m === 12 && dir === 1 ? 1 : m === 1 && dir === -1 ? 12 : m + dir,
    );
  const stepDay = (dir: 1 | -1) => {
    const max = new Date(year, month, 0).getDate();
    setDay((d) =>
      d === max && dir === 1 ? 1 : d === 1 && dir === -1 ? max : d + dir,
    );
  };
  const stepYear = (dir: 1 | -1) =>
    setYear((y) => Math.max(2020, Math.min(2040, y + dir)));

  const selectedSubjectLabel =
    SUBJECTS.find((s) => s.value === draft.subject)?.label ?? "";
  const selectedGradeLabel =
    GRADES.find((g) => g.value === draft.grade)?.label ?? "";
  const dim = `rgba(${getRgbValues(colors.primary)}, 0.4)`;
  const placeholder = `rgba(${getRgbValues(colors.primary)}, 0.35)`;

  // ── Subject / Grade picker screen ──
  const renderPickerScreen = (
    title: string,
    options: { value: string; label: string; category?: string }[],
    selected: string,
    field: keyof Filters,
  ) => {
    const filtered = options.filter((o) =>
      o.label.toLowerCase().includes(search.toLowerCase()),
    );
    return (
      <View style={{ flex: 1 }}>
        <View style={[sharedStyles.header, { paddingTop: insets.top }]}>
          <TouchableOpacity onPress={goBack} style={sharedStyles.headerBtn}>
            <ChevronLeftIcon size={22} color={colors.primary} />
          </TouchableOpacity>
          <AppText style={sharedStyles.title}>{title}</AppText>
          {selected ? (
            <TouchableOpacity
              onPress={() => {
                onChange(field, "");
                goBack();
              }}
              style={sharedStyles.headerBtn}
            >
              <AppText style={sharedStyles.clearAll}>Clear</AppText>
            </TouchableOpacity>
          ) : (
            <View style={{ width: 50 }} />
          )}
        </View>
        <View style={pickerStyles.searchRow}>
          <SearchIcon size={15} color={dim} />
          <TextInput
            style={pickerStyles.searchInput}
            placeholder="Search..."
            placeholderTextColor={placeholder}
            value={search}
            onChangeText={setSearch}
            autoFocus
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch("")}>
              <XIcon size={14} color={dim} />
            </TouchableOpacity>
          ) : null}
        </View>
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.value}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <TouchableOpacity
              style={pickerStyles.option}
              onPress={() => {
                onChange(field, item.value);
                goBack();
              }}
            >
              <View style={{ flex: 1 }}>
                <AppText style={pickerStyles.optionLabel}>{item.label}</AppText>
                {item.category ? (
                  <AppText style={pickerStyles.optionCategory}>
                    {item.category}
                  </AppText>
                ) : null}
              </View>
              {selected === item.value && (
                <View style={pickerStyles.checkDot} />
              )}
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={pickerStyles.sep} />}
        />
      </View>
    );
  };

  // ── Time picker screen ──
  const renderTimeScreen = (field: "fromTime" | "toTime") => {
    const title = field === "fromTime" ? "From Time" : "To Time";
    return (
      <View style={{ flex: 1 }}>
        <View style={[sharedStyles.header, { paddingTop: insets.top }]}>
          <TouchableOpacity onPress={goBack} style={sharedStyles.headerBtn}>
            <ChevronLeftIcon size={22} color={colors.primary} />
          </TouchableOpacity>
          <AppText style={sharedStyles.title}>{title}</AppText>
          {draft[field] ? (
            <TouchableOpacity
              onPress={() => {
                onChange(field, "");
                goBack();
              }}
              style={sharedStyles.headerBtn}
            >
              <AppText style={sharedStyles.clearAll}>Clear</AppText>
            </TouchableOpacity>
          ) : (
            <View style={{ width: 50 }} />
          )}
        </View>
        <View style={timeStyles.pickerArea}>
          <View style={timeStyles.col}>
            <TouchableOpacity
              onPress={() => stepHour(1)}
              style={timeStyles.stepBtn}
            >
              <ChevronUpIcon size={22} color={colors.primary} />
            </TouchableOpacity>
            <AppText style={timeStyles.value}>
              {String(hour).padStart(2, "0")}
            </AppText>
            <TouchableOpacity
              onPress={() => stepHour(-1)}
              style={timeStyles.stepBtn}
            >
              <ChevronDownIcon size={22} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <AppText style={timeStyles.colon}>:</AppText>
          <View style={timeStyles.col}>
            <TouchableOpacity
              onPress={() => stepMinute(1)}
              style={timeStyles.stepBtn}
            >
              <ChevronUpIcon size={22} color={colors.primary} />
            </TouchableOpacity>
            <AppText style={timeStyles.value}>
              {String(minute).padStart(2, "0")}
            </AppText>
            <TouchableOpacity
              onPress={() => stepMinute(-1)}
              style={timeStyles.stepBtn}
            >
              <ChevronDownIcon size={22} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={timeStyles.ampmCol}>
            <TouchableOpacity
              style={[timeStyles.ampmBtn, !isPM && timeStyles.ampmActive]}
              onPress={() => setIsPM(false)}
            >
              <AppText
                style={[
                  timeStyles.ampmText,
                  !isPM && timeStyles.ampmTextActive,
                ]}
              >
                AM
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[timeStyles.ampmBtn, isPM && timeStyles.ampmActive]}
              onPress={() => setIsPM(true)}
            >
              <AppText
                style={[timeStyles.ampmText, isPM && timeStyles.ampmTextActive]}
              >
                PM
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={[sharedStyles.footer, { paddingBottom: insets.bottom + 10 }]}
        >
          <TouchableOpacity
            style={sharedStyles.applyBtn}
            onPress={() => applyTime(field)}
          >
            <AppText style={sharedStyles.applyText}>Apply</AppText>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // ── Date picker screen ──
  const daysInMonth = new Date(year, month, 0).getDate();
  const safeDay = Math.min(day, daysInMonth);

  const renderDateScreen = () => (
    <View style={{ flex: 1 }}>
      <View style={[sharedStyles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={goBack} style={sharedStyles.headerBtn}>
          <ChevronLeftIcon size={22} color={colors.primary} />
        </TouchableOpacity>
        <AppText style={sharedStyles.title}>Select Date</AppText>
        {draft.date ? (
          <TouchableOpacity
            onPress={() => {
              onChange("date", "");
              goBack();
            }}
            style={sharedStyles.headerBtn}
          >
            <AppText style={sharedStyles.clearAll}>Clear</AppText>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 50 }} />
        )}
      </View>
      <View style={dateStyles.pickerArea}>
        {/* Month */}
        <View style={dateStyles.col}>
          <AppText style={dateStyles.colLabel}>Month</AppText>
          <TouchableOpacity
            onPress={() => stepMonth(1)}
            style={dateStyles.stepBtn}
          >
            <ChevronUpIcon size={22} color={colors.primary} />
          </TouchableOpacity>
          <AppText style={dateStyles.value}>{MONTH_NAMES[month - 1]}</AppText>
          <TouchableOpacity
            onPress={() => stepMonth(-1)}
            style={dateStyles.stepBtn}
          >
            <ChevronDownIcon size={22} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <View style={dateStyles.divider} />
        {/* Day */}
        <View style={dateStyles.col}>
          <AppText style={dateStyles.colLabel}>Day</AppText>
          <TouchableOpacity
            onPress={() => stepDay(1)}
            style={dateStyles.stepBtn}
          >
            <ChevronUpIcon size={22} color={colors.primary} />
          </TouchableOpacity>
          <AppText style={dateStyles.value}>{String(safeDay)}</AppText>
          <TouchableOpacity
            onPress={() => stepDay(-1)}
            style={dateStyles.stepBtn}
          >
            <ChevronDownIcon size={22} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <View style={dateStyles.divider} />
        {/* Year */}
        <View style={dateStyles.col}>
          <AppText style={dateStyles.colLabel}>Year</AppText>
          <TouchableOpacity
            onPress={() => stepYear(1)}
            style={dateStyles.stepBtn}
          >
            <ChevronUpIcon size={22} color={colors.primary} />
          </TouchableOpacity>
          <AppText style={dateStyles.value}>{String(year)}</AppText>
          <TouchableOpacity
            onPress={() => stepYear(-1)}
            style={dateStyles.stepBtn}
          >
            <ChevronDownIcon size={22} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={[sharedStyles.footer, { paddingBottom: insets.bottom + 10 }]}
      >
        <TouchableOpacity style={sharedStyles.applyBtn} onPress={applyDate}>
          <AppText style={sharedStyles.applyText}>Apply</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );

  // ── Main filters screen ──
  const renderFiltersScreen = () => (
    <View style={{ flex: 1 }}>
      <View style={[sharedStyles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={onClose} style={sharedStyles.headerBtn}>
          <XIcon size={20} color={colors.primary} />
        </TouchableOpacity>
        <AppText style={sharedStyles.title}>Filters</AppText>
        <TouchableOpacity onPress={onClear} style={sharedStyles.headerBtn}>
          <AppText style={sharedStyles.clearAll}>Clear all</AppText>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={filterStyles.body}
        contentContainerStyle={filterStyles.bodyInner}
        keyboardShouldPersistTaps="handled"
      >
        {/* Subject */}
        <View style={filterStyles.field}>
          <AppText style={filterStyles.label}>Subject</AppText>
          <TouchableOpacity
            style={filterStyles.pickerRow}
            onPress={() => openScreen("subject")}
          >
            <AppText
              style={[
                filterStyles.pickerValue,
                !selectedSubjectLabel && filterStyles.pickerPlaceholder,
              ]}
            >
              {selectedSubjectLabel || "Select subject"}
            </AppText>
            <ChevronRightIcon size={16} color={dim} />
          </TouchableOpacity>
        </View>

        {/* Grade */}
        <View style={filterStyles.field}>
          <AppText style={filterStyles.label}>Grade</AppText>
          <TouchableOpacity
            style={filterStyles.pickerRow}
            onPress={() => openScreen("grade")}
          >
            <AppText
              style={[
                filterStyles.pickerValue,
                !selectedGradeLabel && filterStyles.pickerPlaceholder,
              ]}
            >
              {selectedGradeLabel || "Select grade"}
            </AppText>
            <ChevronRightIcon size={16} color={dim} />
          </TouchableOpacity>
        </View>

        {/* School District */}
        <View style={filterStyles.field}>
          <AppText style={filterStyles.label}>School district</AppText>
          <TextInput
            style={filterStyles.input}
            placeholder="e.g. Springfield"
            placeholderTextColor={placeholder}
            value={draft.schoolDistrict}
            onChangeText={(v) => onChange("schoolDistrict", v)}
          />
        </View>

        {/* Location Type */}
        <View style={filterStyles.field}>
          <AppText style={filterStyles.label}>Location</AppText>
          <View style={filterStyles.toggleRow}>
            {(["", "VIRTUAL", "IN_PERSON"] as const).map((loc) => (
              <TouchableOpacity
                key={loc}
                style={[
                  filterStyles.toggleBtn,
                  draft.scheduleLocation === loc &&
                    filterStyles.toggleBtnActive,
                ]}
                onPress={() => onChange("scheduleLocation", loc)}
              >
                <AppText
                  style={[
                    filterStyles.toggleText,
                    draft.scheduleLocation === loc &&
                      filterStyles.toggleTextActive,
                  ]}
                >
                  {loc === ""
                    ? "Any"
                    : loc === "VIRTUAL"
                      ? "Virtual"
                      : "In-Person"}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Date */}
        <View style={filterStyles.field}>
          <AppText style={filterStyles.label}>Date</AppText>
          <TouchableOpacity
            style={filterStyles.pickerRow}
            onPress={() => openScreen("date")}
          >
            <AppText
              style={[
                filterStyles.pickerValue,
                !draft.date && filterStyles.pickerPlaceholder,
              ]}
            >
              {draft.date ? formatDateDisplay(draft.date) : "Select date"}
            </AppText>
            <ChevronRightIcon size={16} color={dim} />
          </TouchableOpacity>
        </View>

        {/* Time range */}
        <View style={filterStyles.field}>
          <AppText style={filterStyles.label}>Time range</AppText>
          <View style={filterStyles.timeRow}>
            <TouchableOpacity
              style={[filterStyles.pickerRow, { flex: 1 }]}
              onPress={() => openScreen("fromTime")}
            >
              <AppText
                style={[
                  filterStyles.pickerValue,
                  !draft.fromTime && filterStyles.pickerPlaceholder,
                ]}
              >
                {draft.fromTime ? formatTimeDisplay(draft.fromTime) : "From"}
              </AppText>
            </TouchableOpacity>
            <AppText style={filterStyles.timeSep}>–</AppText>
            <TouchableOpacity
              style={[filterStyles.pickerRow, { flex: 1 }]}
              onPress={() => openScreen("toTime")}
            >
              <AppText
                style={[
                  filterStyles.pickerValue,
                  !draft.toTime && filterStyles.pickerPlaceholder,
                ]}
              >
                {draft.toTime ? formatTimeDisplay(draft.toTime) : "To"}
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View
        style={[sharedStyles.footer, { paddingBottom: insets.bottom + 10 }]}
      >
        <TouchableOpacity style={sharedStyles.applyBtn} onPress={onApply}>
          <AppText style={sharedStyles.applyText}>Apply Filters</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={() => {
        screen === "filters" ? onClose() : goBack();
      }}
    >
      <View style={filterStyles.container}>
        {screen === "filters" && renderFiltersScreen()}
        {screen === "subject" &&
          renderPickerScreen(
            "Select Subject",
            SUBJECTS,
            draft.subject,
            "subject",
          )}
        {screen === "grade" &&
          renderPickerScreen("Select Grade", GRADES, draft.grade, "grade")}
        {screen === "date" && renderDateScreen()}
        {screen === "fromTime" && renderTimeScreen("fromTime")}
        {screen === "toTime" && renderTimeScreen("toTime")}
      </View>
    </Modal>
  );
}

// ─── Tutor Card ───────────────────────────────────────────────────────────────

function TutorCard({ tutor }: { tutor: Tutor }) {
  const name = `${tutor.firstName} ${tutor.lastName}`;
  const rates = [
    tutor.sixtyMinutesVirtualRate,
    tutor.sixtyMinutesInPersonRate,
  ].filter((r): r is number => r != null);
  const minRate = rates.length > 0 ? Math.min(...rates) : null;

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={() =>
        router.push(`/dashboard/student-dashboard/tutor/${tutor.id}`)
      }
    >
      <View style={cardStyles.card}>
        {/* Top row: avatar + name + rate */}
        <View style={cardStyles.top}>
          <Avatar
            profileImgUrl={tutor.profileImgUrl ?? undefined}
            name={name}
            width={48}
            height={48}
          />
          <View style={cardStyles.info}>
            <AppText style={cardStyles.name}>{name}</AppText>
          </View>
          {minRate != null && (
            <AppText style={cardStyles.rateCorner}>${minRate}</AppText>
          )}
        </View>

        {/* Badges */}
        <View style={cardStyles.badges}>
          {tutor.providesVirtual && (
            <View style={cardStyles.badge}>
              <MonitorIcon size={11} color={colors.accent} />
              <AppText style={cardStyles.badgeText}>Virtual</AppText>
            </View>
          )}
          {tutor.providesInPerson && (
            <View style={cardStyles.badge}>
              <UsersRoundIcon size={11} color={colors.accent} />
              <AppText style={cardStyles.badgeText}>In-person</AppText>
            </View>
          )}
          {tutor.isCurrentlyTeachingInClassroom && (
            <View style={[cardStyles.badge, cardStyles.badgeBlue]}>
              <SchoolIcon size={11} color="#2563eb" />
              <AppText style={[cardStyles.badgeText, { color: "#2563eb" }]}>
                Currently teaching in classroom
              </AppText>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function FindTutors() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<Filters>(EMPTY_FILTERS);
  const [draft, setDraft] = useState<Filters>(EMPTY_FILTERS);

  const load = useCallback(async (filters: Filters, isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (filters.tutorName) params.tutorName = filters.tutorName;
      if (filters.subject) params.subject = filters.subject;
      if (filters.grade) params.grade = filters.grade;
      if (filters.schoolDistrict)
        params.schoolDistrict = filters.schoolDistrict;
      if (filters.scheduleLocation)
        params.scheduleLocation = filters.scheduleLocation;
      if (filters.date) params.date = filters.date;
      if (filters.fromTime) params.fromTime = filters.fromTime;
      if (filters.toTime) params.toTime = filters.toTime;
      const data = await findTutors(params);
      setTutors(data ?? []);
    } catch {
      setTutors([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load(appliedFilters);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    load(appliedFilters, true);
  }, [appliedFilters, load]);

  const applyFilters = useCallback(() => {
    setAppliedFilters(draft);
    setFilterOpen(false);
    load(draft);
  }, [draft, load]);

  const clearFilters = useCallback(() => {
    setDraft(EMPTY_FILTERS);
  }, []);

  const openFilters = useCallback(() => {
    setDraft(appliedFilters);
    setFilterOpen(true);
  }, [appliedFilters]);

  const changeDraft = useCallback((key: keyof Filters, value: string) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }, []);

  const activeCount = countActiveFilters(appliedFilters);

  const removeFilter = useCallback(
    (key: keyof Filters) => {
      const updated = { ...appliedFilters, [key]: "" };
      setAppliedFilters(updated);
      setDraft(updated);
      load(updated);
    },
    [appliedFilters, load],
  );

  const activeChips = (
    Object.entries(appliedFilters) as [keyof Filters, string][]
  ).filter(([, v]) => v !== "");

  const chipLabel = (key: keyof Filters, value: string) => {
    if (key === "subject")
      return SUBJECTS.find((s) => s.value === value)?.label ?? value;
    if (key === "grade")
      return GRADES.find((g) => g.value === value)?.label ?? value;
    if (key === "scheduleLocation")
      return value === "VIRTUAL" ? "Virtual" : "In-Person";
    if (key === "tutorName") return `"${value}"`;
    if (key === "date") return formatDateDisplay(value);
    if (key === "fromTime") return `From ${formatTimeDisplay(value)}`;
    if (key === "toTime") return `To ${formatTimeDisplay(value)}`;
    return value;
  };

  return (
    <View style={styles.main}>
      <ImageBackground source={images.screenBG1} style={styles.imgBg}>
        <ProfileHeader from="student" />
        <View style={styles.contentBox}>
          {/* Search + Filter row */}
          <View style={styles.searchRow}>
            <View style={styles.searchInputWrap}>
              <SearchIcon
                size={15}
                color={`rgba(${getRgbValues(colors.primary)}, 0.4)`}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by tutor name..."
                placeholderTextColor={`rgba(${getRgbValues(colors.primary)}, 0.35)`}
                value={appliedFilters.tutorName}
                onChangeText={(v) => {
                  const updated = { ...appliedFilters, tutorName: v };
                  setAppliedFilters(updated);
                  setDraft(updated);
                  load(updated);
                }}
                returnKeyType="search"
              />
              {appliedFilters.tutorName ? (
                <TouchableOpacity onPress={() => removeFilter("tutorName")}>
                  <XIcon
                    size={14}
                    color={`rgba(${getRgbValues(colors.primary)}, 0.4)`}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
            <TouchableOpacity style={styles.filterBtn} onPress={openFilters}>
              <FilterIcon
                size={18}
                color={activeCount > 0 ? colors.accent : colors.primary}
              />
              {activeCount > 0 && (
                <View style={styles.filterBadge}>
                  <AppText style={styles.filterBadgeText}>
                    {activeCount}
                  </AppText>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Active filter chips */}
          {activeChips.filter(([k]) => k !== "tutorName").length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.chipsBar}
              contentContainerStyle={styles.chipsRow}
            >
              {activeChips
                .filter(([k]) => k !== "tutorName")
                .map(([key, value]) => (
                  <TouchableOpacity
                    key={key}
                    style={styles.chip}
                    onPress={() => removeFilter(key)}
                  >
                    <AppText style={styles.chipText}>
                      {chipLabel(key, value)}
                    </AppText>
                    <XIcon size={11} color={colors.accent} />
                  </TouchableOpacity>
                ))}
            </ScrollView>
          )}

          {/* Tutor list */}
          {loading ? (
            <View style={styles.center}>
              <AppText style={styles.loadingText}>Finding tutors...</AppText>
            </View>
          ) : tutors.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <SearchIcon size={32} color={colors.accent} />
              </View>
              <AppText style={styles.emptyTitle}>No tutors found</AppText>
              <AppText style={styles.emptyDesc}>
                Try adjusting your filters to find available tutors.
              </AppText>
            </View>
          ) : (
            <FlatList
              data={tutors}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              renderItem={({ item }) => <TutorCard tutor={item} />}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            />
          )}
        </View>
      </ImageBackground>

      <FilterModal
        visible={filterOpen}
        draft={draft}
        onChange={changeDraft}
        onApply={applyFilters}
        onClose={() => setFilterOpen(false)}
        onClear={clearFilters}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

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
    paddingTop: 25,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 25,
    marginBottom: 15,
  },
  searchInputWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.secondary,
    borderRadius: 14,
    paddingHorizontal: 15,
    paddingVertical: 14,
  },
  searchInput: { flex: 1, fontSize: 14, color: colors.primary, padding: 0 },
  filterBtn: {
    width: 45,
    height: 45,
    backgroundColor: colors.secondary,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  filterBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.accent,
    justifyContent: "center",
    alignItems: "center",
  },
  filterBadgeText: { fontSize: 9, fontWeight: "700", color: colors.secondary },
  chipsBar: { flexGrow: 0, flexShrink: 0, marginBottom: 10 },
  chipsRow: { paddingHorizontal: 25, gap: 8 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 5,
    paddingHorizontal: 12,
    backgroundColor: `rgba(${getRgbValues(colors.accent)}, 0.08)`,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: `rgba(${getRgbValues(colors.accent)}, 0.2)`,
  },
  chipText: { fontSize: 12, fontWeight: "500", color: colors.accent },
  list: { paddingHorizontal: 25, paddingBottom: 120 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: {
    fontSize: 14,
    color: `rgba(${getRgbValues(colors.primary)}, 0.5)`,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 30,
    paddingTop: 60,
  },
  emptyIcon: {
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
});

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.secondary,
    borderRadius: 20,
    padding: 18,
    gap: 14,
  },
  top: { flexDirection: "row", alignItems: "center", gap: 12 },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: "700", color: colors.primary },
  badges: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 9,
    backgroundColor: `rgba(${getRgbValues(colors.accent)}, 0.07)`,
    borderRadius: 20,
  },
  badgeBlue: { backgroundColor: "rgba(37, 99, 235, 0.07)" },
  badgeText: { fontSize: 11, fontWeight: "500", color: colors.accent },
  rateCorner: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.accent,
  },
});

// Shared header/footer used across all screens inside the modal
const sharedStyles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: `rgba(${getRgbValues(colors.primary)}, 0.07)`,
    backgroundColor: colors.secondary,
  },
  headerBtn: { padding: 4, minWidth: 50 },
  title: { fontSize: 16, fontWeight: "600", color: colors.primary },
  clearAll: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.accent,
    textAlign: "right",
  },
  footer: {
    padding: 25,
    borderTopWidth: 1,
    borderTopColor: `rgba(${getRgbValues(colors.primary)}, 0.07)`,
    backgroundColor: colors.secondary,
  },
  applyBtn: {
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
  },
  applyText: { fontSize: 15, fontWeight: "600", color: colors.secondary },
});

const filterStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.secondary },
  body: { flex: 1, backgroundColor: colors.foreground1 },
  bodyInner: { padding: 25, gap: 20 },
  field: { gap: 8 },
  label: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    color: `rgba(${getRgbValues(colors.primary)}, 0.45)`,
    letterSpacing: 0.4,
  },
  input: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.primary,
    borderWidth: 1,
    borderColor: `rgba(${getRgbValues(colors.primary)}, 0.08)`,
  },
  pickerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.secondary,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: `rgba(${getRgbValues(colors.primary)}, 0.08)`,
  },
  pickerValue: { fontSize: 14, color: colors.primary, flex: 1 },
  pickerPlaceholder: { color: `rgba(${getRgbValues(colors.primary)}, 0.35)` },
  toggleRow: { flexDirection: "row", gap: 8 },
  toggleBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderColor: `rgba(${getRgbValues(colors.primary)}, 0.1)`,
  },
  toggleBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  toggleText: {
    fontSize: 13,
    fontWeight: "500",
    color: `rgba(${getRgbValues(colors.primary)}, 0.6)`,
  },
  toggleTextActive: { color: colors.secondary },
  timeRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  timeSep: {
    fontSize: 16,
    color: `rgba(${getRgbValues(colors.primary)}, 0.3)`,
  },
});

const pickerStyles = StyleSheet.create({
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    margin: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: colors.foreground1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `rgba(${getRgbValues(colors.primary)}, 0.08)`,
  },
  searchInput: { flex: 1, fontSize: 14, color: colors.primary, padding: 0 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  optionLabel: { fontSize: 15, color: colors.primary },
  optionCategory: {
    fontSize: 12,
    color: `rgba(${getRgbValues(colors.primary)}, 0.45)`,
    marginTop: 2,
  },
  checkDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.accent,
  },
  sep: {
    height: 1,
    marginHorizontal: 20,
    backgroundColor: `rgba(${getRgbValues(colors.primary)}, 0.05)`,
  },
});

const timeStyles = StyleSheet.create({
  pickerArea: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 30,
    backgroundColor: colors.foreground1,
  },
  col: { alignItems: "center", gap: 8 },
  stepBtn: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  value: {
    fontSize: 42,
    fontWeight: "700",
    color: colors.primary,
    minWidth: 70,
    textAlign: "center",
  },
  colon: {
    fontSize: 42,
    fontWeight: "700",
    color: `rgba(${getRgbValues(colors.primary)}, 0.3)`,
    marginBottom: 8,
  },
  ampmCol: { gap: 10, marginLeft: 8 },
  ampmBtn: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderColor: `rgba(${getRgbValues(colors.primary)}, 0.08)`,
  },
  ampmActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  ampmText: {
    fontSize: 15,
    fontWeight: "600",
    color: `rgba(${getRgbValues(colors.primary)}, 0.5)`,
  },
  ampmTextActive: { color: colors.secondary },
});

const dateStyles = StyleSheet.create({
  pickerArea: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: colors.foreground1,
  },
  col: { flex: 1, alignItems: "center", gap: 10 },
  colLabel: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    color: `rgba(${getRgbValues(colors.primary)}, 0.4)`,
    letterSpacing: 0.5,
  },
  stepBtn: {
    width: "100%",
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  value: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.primary,
    textAlign: "center",
  },
  divider: {
    width: 1,
    height: 120,
    backgroundColor: `rgba(${getRgbValues(colors.primary)}, 0.07)`,
    marginHorizontal: 8,
  },
});
