import AppText from "@/components/ui/AppText";
import BtnIcon from "@/components/ui/BtnIcon";
import BtnPrimary from "@/components/ui/BtnPrimary";
import Checkbox from "@/components/ui/Checkbox";
import Input from "@/components/ui/Input";
import PasswordValidator from "@/components/ui/PasswordValidator";
import colors from "@/constants/colors";
import { images } from "@/constants/images";
import api from "@/lib/api";
import { formatSeconds, getRgbValues } from "@/lib/utils";
import { Link, router } from "expo-router";
import {
  ChevronLeft,
  GraduationCap,
  Lock,
  Mail,
  Phone,
  Presentation,
  User,
} from "lucide-react-native";
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
import MemberAgreementContent from "./MemberAgreementContent";
import TutorAgreementContent from "./TutorAgreementContent";

interface IUserTypeBox {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

const screenWidth = Dimensions.get("window").width;

const HEARD_FROM_OPTIONS = [
  "Facebook Ad",
  "Instagram Ad",
  "Google Search",
  "Arch City Tutors Social Media Account",
  "In-Person/Flyer",
  "Word of Mouth/Referral",
  "Other",
];

export default function Form() {
  const [step, setStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [userType, setUserType] = useState<"student" | "tutor" | "parent">(
    "student",
  );

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [hearedFrom, setHearedFrom] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [cPassword, setCPassword] = useState<string>("");

  const [wantsToReceiveTexts, setWantsToReceiveTexts] =
    useState<boolean>(false);
  const [isAgreed, setIsAgreed] = useState<boolean>(false);

  const [timer, setTimer] = useState(300);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (step === 5) {
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

  const userTypeBoxes: IUserTypeBox[] = [
    {
      icon: (
        <GraduationCap
          size={24}
          color={userType === "student" ? colors.accent : colors.primary}
        />
      ),
      title: "I'm a Student",
      desc: "If you are 18 or older, and a student looking for help.",
    },
    {
      icon: (
        <Presentation
          size={24}
          color={userType === "tutor" ? colors.accent : colors.primary}
        />
      ),
      title: "I'm a Tutor",
      desc: "If you are a tutor, and want to share your knowledge with students.",
    },
    {
      icon: (
        <User
          size={24}
          color={userType === "parent" ? colors.accent : colors.primary}
        />
      ),
      title: "I'm a Parent",
      desc: "If you want to manage your child's account while they are under 18.",
    },
  ];

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

  const handleSignup = async () => {
    setIsLoading(true);
    try {
      const res = await api.post("/signup", {
        firstName,
        lastName,
        email: email.toLowerCase(),
        phone,
        password,
        cPassword,
      });

      if (res.data.success) {
        setStep(5);
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

  const handleCreateUser = async () => {
    setIsLoading(true);
    try {
      const res = await api.post("/user/create", {
        userType,
        wantsToReceiveTexts,
        firstName,
        lastName,
        email: email.toLowerCase(),
        phone,
        hearedFrom,
        password,
        cPassword,
        otp: fullCode,
      });

      if (res.data.success) {
        setStep(6);
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

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Create new account";
      case 2:
        return "Personal details";
      case 3:
        return "Agreement";
      case 4:
        return "Consent";
      case 5:
        return "Verify your email";
      default:
        return "";
    }
  };

  const typeFromIndex = (index: number): "student" | "tutor" | "parent" =>
    index === 0 ? "student" : index === 1 ? "tutor" : "parent";

  return (
    <>
      {step < 6 ? (
        <View
          style={{
            ...styles.titleWrapper,
            paddingTop: step === 5 ? 10 : 0,
            justifyContent: step === 5 ? "center" : "flex-start",
          }}
        >
          {step < 5 && (
            <BtnIcon
              icon={<ChevronLeft size={18} color={colors.primary} />}
              handlePress={() => {
                if (step === 1) {
                  router.replace("/");
                } else {
                  setStep(step - 1);
                }
              }}
            />
          )}
          <AppText style={styles.title}>{getStepTitle()}</AppText>
        </View>
      ) : (
        <View>
          <Image
            source={images.accentCheck}
            style={{
              marginHorizontal: "auto",
              width: 75,
              height: 75,
            }}
          />

          <AppText style={[styles.title, { marginTop: 25 }]}>
            Verified successfully
          </AppText>

          <AppText style={[styles.desc, { marginTop: 10 }]}>
            You have successfully created and verified your account. Now you can
            start using the platform.
          </AppText>

          <BtnPrimary
            text="Log in"
            handlePress={() => router.replace("/auth/login")}
          />
        </View>
      )}

      {/* Step 1: Account type */}
      {step === 1 && (
        <View style={styles.userTypeBoxesWrapper}>
          {userTypeBoxes.map((type, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.8}
              style={[
                styles.userTypeBox,
                {
                  borderColor:
                    userType === typeFromIndex(index)
                      ? colors.accent
                      : `rgba(${getRgbValues(colors.primary)}, 0.1)`,
                  backgroundColor:
                    userType === typeFromIndex(index)
                      ? `rgba(${getRgbValues(colors.accent)}, 0.075)`
                      : "transparent",
                },
              ]}
              onPress={() => setUserType(typeFromIndex(index))}
            >
              {type.icon}
              <AppText
                style={[
                  styles.userTypeBoxTitle,
                  {
                    color:
                      userType === typeFromIndex(index)
                        ? colors.accent
                        : colors.primary,
                  },
                ]}
              >
                {type.title}
              </AppText>
              <AppText style={styles.userTypeBoxDesc}>{type.desc}</AppText>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Step 2: Personal details */}
      {step === 2 && (
        <>
          <View style={styles.inputsWrapper}>
            <Input
              value={firstName}
              onChangeText={setFirstName}
              placeholder="First name"
              icon={<User size={18} color={colors.primaryLight} />}
            />
            <Input
              value={lastName}
              onChangeText={setLastName}
              placeholder="Last name"
              icon={<User size={18} color={colors.primaryLight} />}
            />
            <Input
              value={email}
              onChangeText={setEmail}
              placeholder="Email address"
              icon={<Mail size={18} color={colors.primaryLight} />}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Input
              value={phone}
              onChangeText={setPhone}
              placeholder="Phone number"
              icon={<Phone size={18} color={colors.primaryLight} />}
              keyboardType="phone-pad"
            />
            <Input
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              placeholder="Password"
              icon={<Lock size={18} color={colors.primaryLight} />}
            />
            <Input
              value={cPassword}
              onChangeText={setCPassword}
              secureTextEntry={true}
              placeholder="Confirm password"
              icon={<Lock size={18} color={colors.primaryLight} />}
            />
          </View>

          <PasswordValidator password={password} cPassword={cPassword} />

          <View style={{ marginBottom: 20 }}></View>
        </>
      )}

      {/* Step 3: Agreement */}
      {step === 3 && userType === "tutor" ? (
        <>
          <TutorAgreementContent firstName={firstName} lastName={lastName} />
          <View style={{ marginBottom: 10 }}></View>
        </>
      ) : step === 3 ? (
        <>
          <MemberAgreementContent firstName={firstName} lastName={lastName} />
          <View style={{ marginBottom: 10 }}></View>
        </>
      ) : null}

      {/* Step 4: Consent + Terms */}
      {step === 4 && (
        <>
          <AppText
            style={{
              fontSize: 14,
              lineHeight: 22,
              color: `rgba(${getRgbValues(colors.primary)}, 0.65)`,
            }}
          >
            Do you Agree to receive text messages from STL Tutoring Solutions,
            LLC d/b/a Arch City Tutors sent from (314) 252-0967. Message
            frequency varies and may include appointment reminders, service or
            order information, promotional messages, etc. Message and data rates
            may apply. Reply STOP at any time to end or unsubscribe. For
            assistance, reply HELP or contact support at (314) 252-0967.
          </AppText>

          <View style={{ marginVertical: 25, flexDirection: "row", gap: 10 }}>
            <Checkbox
              isChecked={wantsToReceiveTexts}
              setIsChecked={setWantsToReceiveTexts}
            />
            <AppText style={{ marginTop: -4, fontSize: 14, lineHeight: 22 }}>
              Yes, I agree to receive text messages from STL Tutoring Solutions,
              LLC d/b/a Arch City Tutors sent from (314) 252-0967.
            </AppText>
          </View>

          <AppText
            style={{
              fontSize: 14,
              lineHeight: 22,
              color: `rgba(${getRgbValues(colors.primary)}, 0.65)`,
            }}
          >
            See our{" "}
            <Link
              href={"https://app.archcitytutors.com/legal/privacy-policy"}
              target="_blank"
              style={{ color: colors.accent }}
            >
              Privacy Policy
            </Link>{" "}
            for details on how we handle your information.
          </AppText>

          <View
            style={{
              marginVertical: 25,
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Checkbox isChecked={isAgreed} setIsChecked={setIsAgreed} />
            <AppText style={{ fontSize: 14, lineHeight: 22 }}>
              I agree to the{" "}
              <Link
                href={"https://app.archcitytutors.com/legal/privacy-policy"}
                target="_blank"
                style={{ color: colors.accent }}
              >
                Terms of Service
              </Link>
            </AppText>
          </View>

          <AppText
            style={{
              marginBottom: 10,
              fontSize: 14,
              fontWeight: "500",
              color: `rgba(${getRgbValues(colors.primary)}, 0.65)`,
            }}
          >
            How did you hear about us?
          </AppText>

          <View style={styles.hearedFromWrapper}>
            {HEARD_FROM_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option}
                activeOpacity={0.7}
                style={[
                  styles.hearedFromOption,
                  {
                    borderColor:
                      hearedFrom === option
                        ? colors.accent
                        : `rgba(${getRgbValues(colors.primary)}, 0.15)`,
                    backgroundColor:
                      hearedFrom === option
                        ? `rgba(${getRgbValues(colors.accent)}, 0.075)`
                        : "transparent",
                  },
                ]}
                onPress={() => setHearedFrom(option)}
              >
                <AppText
                  style={{
                    fontSize: 13,
                    color:
                      hearedFrom === option ? colors.accent : colors.primary,
                  }}
                >
                  {option}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      {/* Step 5: OTP */}
      {step === 5 && (
        <>
          <AppText style={styles.desc}>
            We&apos;ve sent you the verification code on {email}
          </AppText>

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

          <BtnPrimary
            text={isLoading ? "Please wait..." : "Confirm & verify"}
            handlePress={handleCreateUser}
            disabled={isLoading}
          />

          {timer !== 0 ? (
            <AppText style={styles.bottomText}>
              Resend code in{" "}
              <AppText style={styles.bottomTextHighlight}>
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
                if (!isLoading) handleSignup();
              }}
            >
              <AppText style={styles.bottomText}>
                <AppText style={styles.bottomTextHighlight}>Resend</AppText>
              </AppText>
            </TouchableOpacity>
          )}
        </>
      )}

      {/* Next / Accept buttons for steps 1-4 */}
      {step < 4 && (
        <BtnPrimary
          text={step === 3 ? "I accept the terms" : "Next"}
          handlePress={() => {
            if (step === 2) {
              if (
                !firstName ||
                !lastName ||
                !email ||
                !phone ||
                !password ||
                !cPassword
              ) {
                Toast.show({
                  type: "error",
                  text2: "Please fill in all the fields",
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
            }
            setStep(step + 1);
          }}
        />
      )}

      {step === 4 && (
        <BtnPrimary
          text={isLoading ? "Please wait..." : "Confirm & create account"}
          handlePress={() => {
            if (!isAgreed) {
              Toast.show({
                type: "error",
                text2: "Please agree to the terms of service",
                text2Style: { fontSize: 14, color: colors.primary },
              });
              return;
            }
            if (!hearedFrom) {
              Toast.show({
                type: "error",
                text2: "Please tell us how you heard about us",
                text2Style: { fontSize: 14, color: colors.primary },
              });
              return;
            }
            handleSignup();
          }}
          disabled={isLoading}
        />
      )}

      {step === 1 && (
        <AppText style={styles.bottomText}>
          Already have an account?{" "}
          <Link href={"/auth/login"} style={styles.bottomTextHighlight}>
            Log in
          </Link>
        </AppText>
      )}

      <View style={{ height: 50 }} />
    </>
  );
}

const styles = StyleSheet.create({
  titleWrapper: {
    marginBottom: 35,
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  desc: {
    marginTop: -25,
    marginBottom: 25,
    lineHeight: 26,
    textAlign: "center",
    color: `rgba(${getRgbValues(colors.primary)}, 0.5)`,
  },
  inputsWrapper: {
    marginBottom: 20,
    gap: 10,
  },
  bottomText: {
    marginTop: 20,
    fontSize: 14,
    textAlign: "center",
    color: `rgba(${getRgbValues(colors.primary)}, 0.5)`,
  },
  bottomTextHighlight: {
    fontSize: 14,
    color: colors.accent,
  },
  userTypeBoxesWrapper: {
    marginBottom: 35,
    gap: 10,
  },
  userTypeBox: {
    padding: 25,
    borderWidth: 1,
    borderRadius: 16,
  },
  userTypeBoxTitle: {
    marginTop: 20,
    marginBottom: 8,
    fontWeight: "500",
  },
  userTypeBoxDesc: {
    fontSize: 14,
    lineHeight: 24,
    color: `rgba(${getRgbValues(colors.primary)}, 0.5)`,
  },
  otpContainer: {
    marginBottom: 20,
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
  hearedFromWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 25,
  },
  hearedFromOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
});
