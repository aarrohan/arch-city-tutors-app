import AppText from "@/components/ui/AppText";
import ProfileHeader from "@/components/ui/ProfileHeader";
import colors from "@/constants/colors";
import { images } from "@/constants/images";
import { getParentStatus } from "@/lib/api";
import { getRgbValues } from "@/lib/utils";
import { router } from "expo-router";
import { Sparkles } from "lucide-react-native";
import { useCallback, useEffect } from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
} from "react-native";

export default function ParentHome() {
  const checkStatus = useCallback(async () => {
    try {
      const { isSubscribed } = await getParentStatus();
      if (isSubscribed) {
        router.replace("/dashboard/parent-dashboard" as any);
      }
    } catch {}
  }, []);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  return (
    <View style={styles.main}>
      <ImageBackground source={images.screenBG1} style={styles.imgBg}>
        <ProfileHeader from="parent" />

        <View style={styles.contentBox}>
          <View style={styles.card}>
            <View style={styles.iconWrapper}>
              <Sparkles size={28} color={colors.accent} />
            </View>

            <AppText style={styles.cardTitle}>Unlock All Features</AppText>

            <AppText style={styles.cardDesc}>
              You need a subscription to access all features, including booking
              tutors, viewing schedules, and more.
            </AppText>

            <AppText style={styles.webNote}>
              To activate your account, visit{"\n"}
              <AppText style={styles.webUrl}>archcitytutors.com</AppText>
              {"\n"}on a web browser.
            </AppText>
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
  webNote: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    color: `rgba(${getRgbValues(colors.primary)}, 0.55)`,
  },
  webUrl: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.primary,
  },
});
