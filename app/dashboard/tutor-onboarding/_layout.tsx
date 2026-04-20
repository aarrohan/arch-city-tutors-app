import { Stack } from "expo-router";

export default function TutorOnboardingLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false, animation: "none" }}
      />
    </Stack>
  );
}
