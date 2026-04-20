import colors from "@/constants/colors";
import { getRgbValues } from "@/lib/utils";
import { Dimensions, StyleSheet, View } from "react-native";
import AppText from "./AppText";

export interface IProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const screenWidth = Dimensions.get("window").width;

export default function IconValueBox({ icon, label, value }: IProps) {
  return (
    <View style={styles.box}>
      <View style={styles.iconWrapper}>{icon}</View>

      <AppText style={styles.value}>{value}</AppText>
      <AppText style={styles.label}>{label}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    width: screenWidth / 2 - 30,
    padding: 25,
    backgroundColor: colors.secondary,
    borderRadius: 25,
  },
  iconWrapper: {
    width: 50,
    height: 50,
    backgroundColor: colors.accent,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  value: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  label: {
    marginTop: 5,
    fontSize: 14,
    color: `rgba(${getRgbValues(colors.primary)}, 0.5)`,
  },
});
