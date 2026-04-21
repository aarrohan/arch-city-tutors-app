import { Stack } from "expo-router";

export default function ParentDashboardLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false, animation: "none" }}
      />
      <Stack.Screen
        name="schedule/[id]"
        options={{ headerShown: false, animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="history"
        options={{ headerShown: false, animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="tutor/[id]"
        options={{ headerShown: false, animation: "slide_from_right" }}
      />
    </Stack>
  );
}
