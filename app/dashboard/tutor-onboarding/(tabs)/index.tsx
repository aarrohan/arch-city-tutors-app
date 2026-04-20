import IconValueBox from "@/components/ui/IconValueBox";
import ProfileHeader from "@/components/ui/ProfileHeader";
import colors from "@/constants/colors";
import { images } from "@/constants/images";
import { getTutorApplications } from "@/lib/api";
import { router } from "expo-router";
import { ScrollIcon } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import {
  ImageBackground,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

type TutorApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

export default function Home() {
  const [applicationStatus, setApplicationStatus] = useState<string>("--");
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const applications = await getTutorApplications();
      if (applications && applications.length > 0) {
        const approved = applications.find(
          (a: { status: TutorApplicationStatus }) => a.status === "APPROVED",
        );
        if (approved) {
          router.replace("/dashboard/tutor-dashboard" as any);
          return;
        }
        const latest = applications[applications.length - 1];
        setApplicationStatus(latest.status as TutorApplicationStatus);
      }
    } catch {
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    load();
  }, [load]);

  return (
    <View style={styles.main}>
      <ImageBackground source={images.screenBG1} style={styles.imgBg}>
        <ProfileHeader from="tutor" />

        <ScrollView
          style={styles.contentBox}
          contentContainerStyle={styles.contentBoxInner}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.boxesWrapper}>
            <IconValueBox
              icon={<ScrollIcon size={20} color={colors.secondary} />}
              label="Application status"
              value={applicationStatus}
            />
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  imgBg: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  contentBox: {
    flex: 1,
    width: "100%",
    paddingVertical: 25,
    paddingHorizontal: 25,
    backgroundColor: colors.foreground1,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  contentBoxInner: {},
  boxesWrapper: {
    flexDirection: "row",
    gap: 10,
  },
});
