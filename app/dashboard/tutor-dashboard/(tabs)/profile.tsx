import ProfileHeader from "@/components/ui/ProfileHeader";
import AppText from "@/components/ui/AppText";
import colors from "@/constants/colors";
import { images } from "@/constants/images";
import { getRgbValues } from "@/lib/utils";
import * as Linking from "expo-linking";
import * as SecureStore from "expo-secure-store";
import { ExternalLinkIcon, UserIcon } from "lucide-react-native";
import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export default function TutorProfile() {
  const openProfile = async () => {
    const token = await SecureStore.getItemAsync("token");
    const url = `https://app.archcitytutors.com/api/mobile-app/auth/app-redirect?token=${token}&to=/tutor-dashboard/profile`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.main}>
      <ImageBackground source={images.screenBG1} style={styles.imgBg}>
        <ProfileHeader from="tutor" />

        <View style={styles.contentBox}>
          <View style={styles.card}>
            <View style={styles.iconWrapper}>
              <UserIcon size={28} color={colors.accent} />
            </View>

            <AppText style={styles.cardTitle}>Manage Your Profile</AppText>

            <AppText style={styles.cardDesc}>
              Update your personal info, bio, rates, teaching preferences,
              availability, and password from your profile page.
            </AppText>

            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.btn}
              onPress={openProfile}
            >
              <ExternalLinkIcon size={16} color={colors.secondary} />
              <AppText style={styles.btnText}>Open profile</AppText>
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
    paddingVertical: 25,
    paddingHorizontal: 25,
    backgroundColor: colors.foreground1,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  card: {
    backgroundColor: colors.secondary,
    borderRadius: 25,
    padding: 25,
    borderWidth: 1,
    borderColor: `rgba(${getRgbValues(colors.primary)}, 0.07)`,
    alignItems: "center",
  },
  iconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: `rgba(${getRgbValues(colors.accent)}, 0.08)`,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },
  cardDesc: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    color: `rgba(${getRgbValues(colors.primary)}, 0.55)`,
    marginBottom: 24,
  },
  btn: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    backgroundColor: colors.accent,
    borderRadius: 14,
  },
  btnText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.secondary,
  },
});
