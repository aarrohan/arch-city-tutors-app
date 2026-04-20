import Loader from "@/components/ui/Loader";
import useAuth from "@/hooks/useAuth";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";

export default function AuthLayout() {
  const { checking, authenticated, userType } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!checking && authenticated && userType) {
      if (userType === "STUDENT") {
        router.replace("/dashboard/student-onboarding");
      } else if (userType === "TUTOR") {
        router.replace("/dashboard/tutor-onboarding");
      } else if (userType === "PARENT") {
        router.replace("/dashboard/parent-onboarding");
      }
    }
  }, [checking, authenticated]);

  if (checking) {
    return <Loader />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="(login)/login"
        options={{ headerShown: false, animation: "none" }}
      />
      <Stack.Screen
        name="(signup)/signup"
        options={{ headerShown: false, animation: "none" }}
      />
      <Stack.Screen
        name="(reset-password)/reset-password"
        options={{ headerShown: false, animation: "none" }}
      />
    </Stack>
  );
}
