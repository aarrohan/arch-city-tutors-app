import AppText from "@/components/ui/AppText";
import ProfileHeader from "@/components/ui/ProfileHeader";
import colors from "@/constants/colors";
import { images } from "@/constants/images";
import { getStudentStatus } from "@/lib/api";
import { getRgbValues } from "@/lib/utils";
import * as Linking from "expo-linking";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { Sparkles } from "lucide-react-native";
import { useCallback, useEffect } from "react";
import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export default function StudentHome() {
  const checkStatus = useCallback(async () => {
    try {
      const { isSubscribed } = await getStudentStatus();
      if (isSubscribed) {
        router.replace("/dashboard/student-dashboard" as any);
      }
    } catch {}
  }, []);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  const openPlanPage = async () => {
    const token = await SecureStore.getItemAsync("token");
    const url = `https://app.archcitytutors.com/api/mobile-app/auth/app-redirect?token=${token}&to=/student-onboarding-dashboard/plan`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.main}>
      <ImageBackground source={images.screenBG1} style={styles.imgBg}>
        <ProfileHeader from="student" />

        <View style={styles.contentBox}>
          <View style={styles.card}>
            <View style={styles.iconWrapper}>
              <Sparkles size={28} color={colors.accent} />
            </View>

            <AppText style={styles.cardTitle}>Unlock All Features</AppText>

            <AppText style={styles.cardDesc}>
              You need to subscribe to the pro plan in order to access all the
              features, including booking tutors, viewing schedules, and more.
            </AppText>

            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.btn}
              onPress={openPlanPage}
            >
              <AppText style={styles.btnText}>Get access</AppText>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
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
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
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
    paddingVertical: 14,
    backgroundColor: colors.accent,
    borderRadius: 14,
    alignItems: "center",
  },
  btnText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.secondary,
  },
});
