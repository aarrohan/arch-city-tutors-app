import colors from "@/constants/colors";
import { getRgbValues } from "@/lib/utils";
import { StyleSheet, TouchableOpacity } from "react-native";

interface IProps {
  icon: React.ReactNode;
  handlePress?: () => void;
  extraStyles?: any;
}

export default function BtnIcon({ icon, handlePress, extraStyles }: IProps) {
  return (
    <TouchableOpacity
      style={[styles.btn, extraStyles]}
      activeOpacity={0.5}
      onPress={handlePress}
    >
      {icon}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 42,
    height: 42,
    borderWidth: 1,
    borderColor: `rgba(${getRgbValues(colors.primary)}, 0.1)`,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
});
