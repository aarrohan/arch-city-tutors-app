import { Stack } from "expo-router";

export default function DashboardLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="tutor-onboarding"
        options={{ headerShown: false, animation: "none" }}
      />
      <Stack.Screen
        name="tutor-dashboard"
        options={{ headerShown: false, animation: "none" }}
      />
      <Stack.Screen
        name="student-dashboard"
        options={{ headerShown: false, animation: "none" }}
      />
      <Stack.Screen
        name="student-onboarding"
        options={{ headerShown: false, animation: "none" }}
      />
      <Stack.Screen
        name="parent-onboarding"
        options={{ headerShown: false, animation: "none" }}
      />
    </Stack>
  );
}
