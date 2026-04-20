import AppText from "@/components/ui/AppText";
import BtnPrimary from "@/components/ui/BtnPrimary";
import BtnSecondary from "@/components/ui/BtnSecondary";
import Loader from "@/components/ui/Loader";
import colors from "@/constants/colors";
import { images } from "@/constants/images";
import useAuth from "@/hooks/useAuth";
import { getRgbValues } from "@/lib/utils";
import { router } from "expo-router";
import { useEffect } from "react";
import { Image, ImageBackground, StyleSheet, View } from "react-native";

export default function Home() {
  const { checking, authenticated, userType } = useAuth();

  useEffect(() => {
    if (!checking && authenticated && userType) {
      if (userType === "STUDENT") {
        router.replace("/dashboard/student-onboarding");
      } else if (userType === "TUTOR") {
        router.replace("/dashboard/tutor-onboarding");
      } else if (userType === "PARENT") {
        router.replace("/dashboard/parent-onboarding");
      }
    }
  }, [checking, authenticated, userType]);

  if (checking) {
    return <Loader />;
  }

  return (
    <View style={styles.main}>
      <ImageBackground source={images.screenBG1} style={styles.imgBg}>
        <Image source={images.logoWhite} style={styles.logoImg} />

        <Image source={images.onboarding1} style={styles.onboardingImg} />

        <View style={styles.contentBox}>
          <AppText style={styles.title}>
            Tutoring Made {"\n"}{" "}
            <AppText style={styles.titleHighlight}>Easier</AppText> than Ever
          </AppText>

          <AppText style={styles.desc}>
            A concierge-style service that sources qualified tutors for our
            students.
          </AppText>

          <BtnPrimary
            text="Create new account"
            handlePress={() => router.replace("/auth/signup" as any)}
          />

          <View style={styles.btnSpacer} />

          <BtnSecondary
            text="Log in"
            handlePress={() => router.replace("/auth/login" as any)}
          />
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

  logoImg: {
    position: "absolute",
    top: 65,
    left: 25,
    width: 58,
    height: 51,
  },

  onboardingImg: {
    width: 300,
    height: 220,
  },

  contentBox: {
    width: "100%",
    paddingTop: 50,
    paddingBottom: 50,
    paddingHorizontal: 25,
    backgroundColor: "#fff",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },

  title: {
    marginBottom: 15,
    fontSize: 34,
    fontWeight: "700",
    textAlign: "center",
  },

  titleHighlight: { fontSize: 32, color: colors.accent },

  desc: {
    marginBottom: 25,
    lineHeight: 26,
    textAlign: "center",
    color: `rgba(${getRgbValues(colors.primary)}, 0.5)`,
  },

  btnSpacer: {
    marginTop: 10,
  },
});
