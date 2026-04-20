import AppText from "@/components/ui/AppText";
import BtnIcon from "@/components/ui/BtnIcon";
import colors from "@/constants/colors";
import { images } from "@/constants/images";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import {
  Dimensions,
  Image,
  ImageBackground,
  Keyboard,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import Form from "./Form";

const screenHeight = Dimensions.get("window").height;

export default function ResetPassword() {
  return (
    <TouchableWithoutFeedback style={styles.main} onPress={Keyboard.dismiss}>
      <ImageBackground source={images.screenBG1} style={styles.imgBg}>
        <Toast autoHide={true} visibilityTime={1500} />

        <Image source={images.logoWhite} style={styles.logoImg} />

        <ScrollView style={styles.contentBox}>
          <View style={styles.titleWrapper}>
            <BtnIcon
              icon={<ChevronLeft size={18} color={colors.primary} />}
              handlePress={() => router.replace("/auth/login")}
            />

            <AppText style={styles.title}>Reset password</AppText>
          </View>

          <Form />
        </ScrollView>
      </ImageBackground>
    </TouchableWithoutFeedback>
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

  contentBox: {
    width: "100%",
    height: screenHeight - 170,
    maxHeight: screenHeight - 170,
    paddingVertical: 25,
    paddingHorizontal: 25,
    backgroundColor: "#fff",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },

  titleWrapper: {
    marginBottom: 35,
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
});
