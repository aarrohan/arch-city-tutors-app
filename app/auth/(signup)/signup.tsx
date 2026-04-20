import { images } from "@/constants/images";
import {
  Dimensions,
  Image,
  ImageBackground,
  Keyboard,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import Toast from "react-native-toast-message";
import Form from "./Form";

const screenHeight = Dimensions.get("window").height;

export default function Signup() {
  return (
    <TouchableWithoutFeedback style={styles.main} onPress={Keyboard.dismiss}>
      <ImageBackground source={images.screenBG1} style={styles.imgBg}>
        <Toast autoHide={true} visibilityTime={1500} />

        <Image source={images.logoWhite} style={styles.logoImg} />

        <ScrollView style={styles.contentBox}>
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
});
