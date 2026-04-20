import colors from "@/constants/colors";
import { Image, StyleSheet, View } from "react-native";
import AppText from "./AppText";

interface IProps {
  profileImgUrl?: string;
  name: string;
  width: number;
  height: number;
  isOnline?: boolean;
}

export default function Avatar({
  profileImgUrl,
  name,
  width,
  height,
  isOnline,
}: IProps) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

  return (
    <View
      style={[
        styles.main,
        {
          width: width,
          height: height,
        },
      ]}
    >
      {profileImgUrl ? (
        <Image
          source={{
            uri: profileImgUrl,
          }}
          style={[styles.img, { width: width, height: height }]}
        />
      ) : (
        <AppText style={styles.name}>{initials}</AppText>
      )}

      {isOnline && <View style={styles.circle}></View>}
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    position: "relative",
    backgroundColor: colors.foreground1,
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  img: {
    objectFit: "cover",
    borderRadius: "50%",
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
  },
  circle: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 11,
    height: 11,
    borderWidth: 2,
    borderColor: colors.secondary,
    backgroundColor: colors.success,
    borderRadius: "50%",
  },
});
