import { Stack } from "expo-router";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="index"
          options={{ headerShown: false, animation: "none" }}
        />
        <Stack.Screen
          name="auth"
          options={{ headerShown: false, animation: "none" }}
        />
        <Stack.Screen
          name="dashboard"
          options={{ headerShown: false, animation: "none" }}
        />
      </Stack>

      <Toast topOffset={60} />
    </>
  );
}
