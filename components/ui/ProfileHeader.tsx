import Avatar from "@/components/ui/Avatar";
import colors from "@/constants/colors";
import { getSelfProfile } from "@/lib/api";
import { getRgbValues } from "@/lib/utils";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { LogOut } from "lucide-react-native";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import AppText from "./AppText";

interface ISelfProfile {
  type: string;
  profileImgUrl: string;
  firstName: string;
  lastName: string;
  email: string;
}

export default function ProfileHeader({ from }: { from: string }) {
  const [profile, setProfile] = useState<ISelfProfile | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const user = await getSelfProfile();

        setProfile(user);
      } catch {}
    };

    loadProfile();
  }, []);

  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Avatar
          profileImgUrl={profile?.profileImgUrl}
          name={profile ? `${profile.firstName} ${profile.lastName}` : "User"}
          width={50}
          height={50}
          isOnline
        />

        <TouchableOpacity
          activeOpacity={0.5}
          onPress={async () => {
            await SecureStore.deleteItemAsync("token");

            router.replace("/");
          }}
        >
          <LogOut size={22} color={colors.secondary} />
        </TouchableOpacity>
      </View>

      <AppText style={styles.name}>
        {profile ? `${profile.firstName} ${profile.lastName}` : "User"}
      </AppText>
      <AppText style={styles.role}>{from} Dashboard</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 65,
    marginBottom: 25,
    width: "100%",
    paddingHorizontal: 25,
  },
  headerTop: {
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    marginBottom: 4,
    fontSize: 20,
    fontWeight: "600",
    color: colors.secondary,
  },
  role: {
    fontSize: 12,
    fontWeight: "500",
    textTransform: "uppercase",
    color: `rgba(${getRgbValues(colors.secondary)}, 0.5)`,
  },
});
