import AppText from "@/components/ui/AppText";
import BtnPrimary from "@/components/ui/BtnPrimary";
import Input from "@/components/ui/Input";
import PasswordValidator from "@/components/ui/PasswordValidator";
import colors from "@/constants/colors";
import { images } from "@/constants/images";
import api from "@/lib/api";
import { formatSeconds, getRgbValues } from "@/lib/utils";
import { router } from "expo-router";
import { Lock, Mail } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const screenWidth = Dimensions.get("window").width;

export default function Form() {
  const [step, setStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [cPassword, setCPassword] = useState<string>("");

  const [timer, setTimer] = useState(300);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (step === 2) {
      const countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev === 0) {
            clearInterval(countdown);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [step, timer]);

  const handleChange = (text: string, index: number) => {
    if (/^[0-9]?$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);
      if (text && index < 5) {
        inputs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && otp[index] === "" && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const fullCode = otp.join("");

  const handleRequestOtp = async () => {
    if (!email) {
      Toast.show({
        type: "error",
        text2: "Please enter your email address",
        text2Style: { fontSize: 14, color: colors.primary },
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post("/reset-password", {
        email: email.toLowerCase(),
      });

      if (res.data.success) {
        setStep(2);
      }
    } catch (err: any) {
      Toast.show({
        type: "error",
        text2: err?.response?.data?.error || "Something went wrong",
        text2Style: { fontSize: 14, color: colors.primary },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!password || !cPassword) {
      Toast.show({
        type: "error",
        text2: "Please fill in all the fields",
        text2Style: { fontSize: 14, color: colors.primary },
      });
      return;
    }

    if (fullCode.length < 6) {
      Toast.show({
        type: "error",
        text2: "Please enter the 6-digit verification code",
        text2Style: { fontSize: 14, color: colors.primary },
      });
      return;
    }

    const valid =
      /(?=.*[A-Z])/.test(password) &&
      /(?=.*[0-9])/.test(password) &&
      /(?=.*[!@#$%^&*])/.test(password) &&
      password.length >= 8 &&
      password === cPassword;

    if (!valid) {
      Toast.show({
        type: "error",
        text2: "Password doesn't meet requirements",
        text2Style: { fontSize: 14, color: colors.primary },
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.post("/update-password", {
        email: email.toLowerCase(),
        password,
        cPassword,
        otp: fullCode,
      });

      if (res.data.success) {
        setStep(3);
      }
    } catch (err: any) {
      Toast.show({
        type: "error",
        text2: err?.response?.data?.error || "Something went wrong",
        text2Style: { fontSize: 14, color: colors.primary },
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 3) {
    return (
      <View>
        <Image
          source={images.accentCheck}
          style={{ marginHorizontal: "auto", width: 75, height: 75 }}
        />

        <AppText style={[styles.successTitle, { marginTop: 25 }]}>
          Password updated!
        </AppText>

        <AppText style={styles.successDesc}>
          Your password has been updated successfully. You can now log in with
          your new password.
        </AppText>

        <BtnPrimary
          text="Go to login"
          handlePress={() => router.replace("/auth/login")}
        />
      </View>
    );
  }

  return (
    <>
      {step === 1 && (
        <>
          <AppText style={styles.stepDesc}>
            Enter your email address and we&apos;ll send you a 6-digit
            verification code to reset your password.
          </AppText>

          <View style={styles.inputsWrapper}>
            <Input
              value={email}
              onChangeText={setEmail}
              placeholder="Email address"
              icon={<Mail size={18} color={colors.primaryLight} />}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <BtnPrimary
            text={isLoading ? "Please wait..." : "Send verification code"}
            handlePress={handleRequestOtp}
            disabled={isLoading}
          />
        </>
      )}

      {step === 2 && (
        <>
          <AppText style={styles.stepDesc}>
            We&apos;ve sent a verification code to {email}. Enter the code and
            your new password below.
          </AppText>

          <AppText style={styles.otpLabel}>Verification code</AppText>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputs.current[index] = ref;
                }}
                style={styles.otpInput}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                textContentType={index === 0 ? "oneTimeCode" : "none"}
                autoFocus={index === 0}
              />
            ))}
          </View>

          {timer !== 0 ? (
            <AppText style={styles.timerText}>
              Resend code in{" "}
              <AppText style={styles.timerHighlight}>
                {formatSeconds(timer)}
              </AppText>
            </AppText>
          ) : (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setTimer(300);
                setOtp(["", "", "", "", "", ""]);
                inputs.current[0]?.focus();
                if (!isLoading) handleRequestOtp();
              }}
            >
              <AppText style={styles.timerText}>
                <AppText style={styles.timerHighlight}>Resend code</AppText>
              </AppText>
            </TouchableOpacity>
          )}

          <View style={styles.inputsWrapper}>
            <Input
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              placeholder="New password"
              icon={<Lock size={18} color={colors.primaryLight} />}
            />
            <Input
              value={cPassword}
              onChangeText={setCPassword}
              secureTextEntry={true}
              placeholder="Confirm new password"
              icon={<Lock size={18} color={colors.primaryLight} />}
            />
          </View>

          <PasswordValidator password={password} cPassword={cPassword} />

          <View style={{ marginBottom: 20 }}></View>

          <BtnPrimary
            text={isLoading ? "Please wait..." : "Update password"}
            handlePress={handleUpdatePassword}
            disabled={isLoading}
          />
        </>
      )}

      <View style={{ height: 50 }} />
    </>
  );
}

const styles = StyleSheet.create({
  stepDesc: {
    marginBottom: 20,
    fontSize: 15,
    lineHeight: 22,
    color: `rgba(${getRgbValues(colors.primary)}, 0.55)`,
  },

  inputsWrapper: {
    marginBottom: 20,
    gap: 10,
  },

  otpLabel: {
    marginBottom: 10,
    fontSize: 12,
    fontWeight: "500",
    color: `rgba(${getRgbValues(colors.primary)}, 0.65)`,
  },

  otpContainer: {
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },

  otpInput: {
    width: screenWidth / 6 - 19,
    height: 55,
    borderWidth: 1,
    borderColor: `rgba(${getRgbValues(colors.primary)}, 0.1)`,
    backgroundColor: colors.secondary,
    borderRadius: 8,
    fontSize: 18,
    textAlign: "center",
  },

  timerText: {
    marginBottom: 20,
    textAlign: "center",
    fontSize: 14,
    color: `rgba(${getRgbValues(colors.primary)}, 0.5)`,
  },

  timerHighlight: {
    fontSize: 14,
    color: colors.accent,
  },

  successTitle: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    color: colors.primary,
  },

  successDesc: {
    marginTop: 10,
    marginBottom: 25,
    lineHeight: 26,
    textAlign: "center",
    color: `rgba(${getRgbValues(colors.primary)}, 0.5)`,
  },
});
