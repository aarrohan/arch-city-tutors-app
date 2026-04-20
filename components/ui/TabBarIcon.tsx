import colors from "@/constants/colors";
import { getRgbValues } from "@/lib/utils";
import { Dimensions, StyleSheet, Text, View } from "react-native";

interface IProps {
  focused: boolean;
  icon: React.ReactNode;
  title: string;
}

const screenWidth = Dimensions.get("window").width;

export default function TabBarIcon({ focused, icon, title }: IProps) {
  return (
    <View style={styles.tabBarIcon}>
      {icon}
      <Text
        style={[
          styles.title,
          {
            color: focused
              ? colors.accent
              : `rgba(${getRgbValues(colors.primary)}, 0.35)`,
          },
        ]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarIcon: {
    width: (screenWidth - 64) / 2,
    paddingTop: 15,
    height: 64,
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  title: {
    fontSize: 12,
    fontWeight: "500",
  },
});
