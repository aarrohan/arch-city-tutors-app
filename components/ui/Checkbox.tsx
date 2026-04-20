import colors from "@/constants/colors";
import { getRgbValues } from "@/lib/utils";
import { Check } from "lucide-react-native";
import { StyleSheet, TouchableOpacity } from "react-native";

interface IProps {
  isChecked: boolean;
  setIsChecked: (value: boolean) => void;
}

export default function Checkbox({ isChecked, setIsChecked }: IProps) {
  return (
    <TouchableOpacity
      style={[
        styles.checkbox,
        {
          borderColor: isChecked
            ? colors.accent
            : `rgba(${getRgbValues(colors.primary)}, 0.2)`,
          backgroundColor: isChecked ? colors.accent : colors.secondary,
        },
      ]}
      activeOpacity={0.5}
      onPress={() => setIsChecked(!isChecked)}
    >
      <Check size={14} color={colors.secondary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  checkbox: {
    width: 20,
    minWidth: 20,
    height: 20,
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
});
