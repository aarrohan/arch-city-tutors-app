import colors from "@/constants/colors";
import { StyleSheet, TouchableOpacity } from "react-native";
import AppText from "./AppText";

interface IProps {
  text: string;
  handlePress?: () => void;
}

export default function BtnSecondary({ text, handlePress }: IProps) {
  return (
    <TouchableOpacity
      style={styles.btn}
      activeOpacity={0.5}
      onPress={handlePress}
    >
      <AppText style={styles.btnText}>{text}</AppText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  btnText: {
    fontWeight: "600",
    color: colors.accent,
  },
});
