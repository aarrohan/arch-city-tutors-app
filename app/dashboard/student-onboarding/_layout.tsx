import { Stack } from "expo-router";

export default function StudentOnboardingLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: false, animation: "none" }}
      />
    </Stack>
  );
}
