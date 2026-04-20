import colors from "@/constants/colors";
import { StyleSheet, TouchableOpacity } from "react-native";
import AppText from "./AppText";

interface IProps {
  text: string;
  handlePress?: () => void;
  disabled?: boolean;
}

export default function BtnPrimary({
  text,
  handlePress,
  disabled = false,
}: IProps) {
  return (
    <TouchableOpacity
      style={styles.btn}
      activeOpacity={0.8}
      onPress={handlePress}
      disabled={disabled}
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
    backgroundColor: colors.accent,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  btnText: {
    fontWeight: "600",
    color: colors.secondary,
  },
});
