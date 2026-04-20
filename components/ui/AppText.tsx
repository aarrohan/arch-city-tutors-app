import colors from "@/constants/colors";
import { StyleSheet, Text, TextProps } from "react-native";

export default function AppText({
  children,
  style,
  ...props
}: {
  children: React.ReactNode;
  style?: object;
} & Omit<TextProps, "style">) {
  return (
    <Text style={[styles.text, style]} {...props}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: colors.primary,
  },
});
