import AppText from "@/components/ui/AppText";
import BtnPrimary from "@/components/ui/BtnPrimary";
import Input from "@/components/ui/Input";
import colors from "@/constants/colors";
import api from "@/lib/api";
import { getRgbValues } from "@/lib/utils";
import { Link, router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Lock, Mail } from "lucide-react-native";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";

export default function Form() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async () => {
    if (email === "" || password === "") {
      Toast.show({
        type: "error",
        text2: "Please enter your email and password",
        text2Style: { fontSize: 14, color: colors.primary },
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.post("/login", {
        email: email.toLowerCase(),
        password,
      });

      const userType = res.data.userType;
      const token = res.data.token;

      await SecureStore.setItemAsync("token", token);

      Toast.show({
        type: "success",
        text2: "Login successful",
        text2Style: { fontSize: 14, color: colors.primary },
      });

      setTimeout(() => {
        if (userType === "ADMIN") {
          Toast.show({
            type: "error",
            text2: "Admin can not log in from the app",
            text2Style: { fontSize: 14, color: colors.primary },
          });
        } else if (userType === "STUDENT") {
          router.replace("/dashboard/student-onboarding");
        } else if (userType === "PARENT") {
          router.replace("/dashboard/parent-onboarding");
        } else if (userType === "TUTOR") {
          router.replace("/dashboard/tutor-onboarding");
        }
      }, 1500);
    } catch {
      Toast.show({
        type: "error",
        text2: "Invalid credentials",
        text2Style: { fontSize: 14, color: colors.primary },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <View style={styles.inputsWrapper}>
        <Input
          value={email}
          onChangeText={setEmail}
          placeholder="Email address or student id"
          icon={<Mail size={18} color={colors.primaryLight} />}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Input
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          placeholder="Password"
          icon={<Lock size={18} color={colors.primaryLight} />}
        />
      </View>

      <Link href={"/auth/reset-password"} style={styles.forgotPassword}>
        Forgot password?
      </Link>

      <BtnPrimary
        text={isLoading ? "Please wait..." : "Log in"}
        handlePress={handleLogin}
        disabled={isLoading}
      />
    </>
  );
}

const styles = StyleSheet.create({
  inputsWrapper: {
    marginBottom: 20,
    gap: 10,
  },

  forgotPassword: {
    marginBottom: 20,
    fontSize: 14,
    color: colors.accent,
    textAlign: "right",
  },
});
