import Avatar from "@/components/ui/Avatar";
import colors from "@/constants/colors";
import { getSelfProfile } from "@/lib/api";
import { getRgbValues } from "@/lib/utils";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { LogOut, Undo2Icon } from "lucide-react-native";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import AppText from "@/components/ui/AppText";

interface ISelfProfile {
  type: string;
  profileImgUrl: string;
  firstName: string;
  lastName: string;
  email: string;
}

export default function ProfileHeader({ from }: { from: string }) {
  const [profile, setProfile] = useState<ISelfProfile | null>(null);
  const [hasParentToken, setHasParentToken] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const user = await getSelfProfile();
        setProfile(user);
      } catch {}
    };

    const checkParentToken = async () => {
      const t = await SecureStore.getItemAsync("parentToken");
      setHasParentToken(!!t);
    };

    loadProfile();
    checkParentToken();
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

        <View style={styles.headerActions}>
          {hasParentToken && (
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.switchBackBtn}
              onPress={async () => {
                const parentToken = await SecureStore.getItemAsync("parentToken");
                await SecureStore.setItemAsync("token", parentToken ?? "");
                await SecureStore.deleteItemAsync("parentToken");
                router.replace("/dashboard/parent-dashboard" as any);
              }}
            >
              <Undo2Icon size={14} color={colors.secondary} />
              <AppText style={styles.switchBackText}>Switch back</AppText>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={async () => {
              await SecureStore.deleteItemAsync("token");
              await SecureStore.deleteItemAsync("parentToken");
              router.replace("/");
            }}
          >
            <LogOut size={22} color={colors.secondary} />
          </TouchableOpacity>
        </View>
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
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  switchBackBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingVertical: 6,
    paddingHorizontal: 11,
    borderRadius: 10,
  },
  switchBackText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.secondary,
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
