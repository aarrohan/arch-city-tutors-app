import colors from "@/constants/colors";
import { getRgbValues } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

interface IProps {
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  placeholder?: string;
  icon?: React.ReactNode;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}

export default function Input({
  value,
  onChangeText,
  secureTextEntry = false,
  placeholder,
  icon,
  keyboardType = "default",
  autoCapitalize = "sentences",
}: IProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <View style={styles.inputWrapper}>
      <View style={styles.iconWrapper}>{icon}</View>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry && !showPassword}
        placeholder={placeholder}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        style={[styles.input, icon ? { paddingLeft: 42 } : null]}
        placeholderTextColor={`rgba(${getRgbValues(colors.primary)}, 0.5)`}
      />

      {secureTextEntry && (
        <TouchableOpacity
          style={styles.passwordToggleBtn}
          onPress={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff size={18} color={colors.primaryLight} />
          ) : (
            <Eye size={18} color={colors.primaryLight} />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    position: "relative",
  },

  input: {
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: `rgba(${getRgbValues(colors.primary)}, 0.1)`,
    borderRadius: 12,
    fontSize: 16,
  },

  iconWrapper: {
    position: "absolute",
    top: "50%",
    left: 16,
    transform: [{ translateY: "-50%" }],
  },

  passwordToggleBtn: {
    position: "absolute",
    top: "50%",
    right: 16,
    transform: [{ translateY: "-50%" }],
  },
});
