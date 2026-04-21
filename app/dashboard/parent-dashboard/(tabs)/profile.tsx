import ProfileHeader from "@/components/ui/ProfileHeader";
import AppText from "@/components/ui/AppText";
import colors from "@/constants/colors";
import { images } from "@/constants/images";
import { getRgbValues } from "@/lib/utils";
import * as Linking from "expo-linking";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { ChevronRightIcon, ClockIcon, CreditCardIcon, UserIcon, UsersIcon } from "lucide-react-native";
import { ImageBackground, StyleSheet, TouchableOpacity, View } from "react-native";

export default function ParentProfile() {
  const openProfile = async () => {
    const token = await SecureStore.getItemAsync("token");
    const url = `https://app.archcitytutors.com/api/mobile-app/auth/app-redirect?token=${token}&to=/parent-dashboard/profile`;
    Linking.openURL(url);
  };

  const openPlan = async () => {
    const token = await SecureStore.getItemAsync("token");
    const url = `https://app.archcitytutors.com/api/mobile-app/auth/app-redirect?token=${token}&to=/parent-dashboard/plan`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.main}>
      <ImageBackground source={images.screenBG1} style={styles.imgBg}>
        <ProfileHeader from="parent" />

        <View style={styles.contentBox}>
          <View style={styles.list}>
            <TouchableOpacity activeOpacity={0.7} style={styles.row} onPress={openProfile}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconWrapper, { backgroundColor: `rgba(${getRgbValues(colors.accent)}, 0.08)` }]}>
                  <UserIcon size={18} color={colors.accent} />
                </View>
                <AppText style={styles.rowLabel}>Manage Profile</AppText>
              </View>
              <ChevronRightIcon size={18} color={`rgba(${getRgbValues(colors.primary)}, 0.3)`} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.row}
              onPress={() => router.push("/dashboard/parent-dashboard/(tabs)/students" as any)}
            >
              <View style={styles.rowLeft}>
                <View style={[styles.iconWrapper, { backgroundColor: `rgba(${getRgbValues(colors.accent)}, 0.08)` }]}>
                  <UsersIcon size={18} color={colors.accent} />
                </View>
                <AppText style={styles.rowLabel}>My Students</AppText>
              </View>
              <ChevronRightIcon size={18} color={`rgba(${getRgbValues(colors.primary)}, 0.3)`} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.row}
              onPress={() => router.push("/dashboard/parent-dashboard/history" as any)}
            >
              <View style={styles.rowLeft}>
                <View style={[styles.iconWrapper, { backgroundColor: `rgba(${getRgbValues(colors.accent)}, 0.08)` }]}>
                  <ClockIcon size={18} color={colors.accent} />
                </View>
                <AppText style={styles.rowLabel}>Payment History</AppText>
              </View>
              <ChevronRightIcon size={18} color={`rgba(${getRgbValues(colors.primary)}, 0.3)`} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity activeOpacity={0.7} style={styles.row} onPress={openPlan}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconWrapper, { backgroundColor: `rgba(${getRgbValues(colors.accent)}, 0.08)` }]}>
                  <CreditCardIcon size={18} color={colors.accent} />
                </View>
                <AppText style={styles.rowLabel}>Manage Plan</AppText>
              </View>
              <ChevronRightIcon size={18} color={`rgba(${getRgbValues(colors.primary)}, 0.3)`} />
            </TouchableOpacity>
          </View>
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
    paddingTop: 30,
    paddingHorizontal: 25,
    backgroundColor: colors.foreground1,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  list: {
    backgroundColor: colors.secondary,
    borderRadius: 20,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  iconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.primary,
  },
  divider: {
    height: 1,
    marginHorizontal: 18,
    backgroundColor: `rgba(${getRgbValues(colors.primary)}, 0.06)`,
  },
});
