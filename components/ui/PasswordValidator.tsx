import colors from "@/constants/colors";
import { getRgbValues } from "@/lib/utils";
import { Check } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import AppText from "./AppText";

interface IProps {
  password: string;
  cPassword: string;
}

export default function PasswordValidator({ password, cPassword }: IProps) {
  const uppercaseLetters: boolean =
    password !== "" ? (/(?=.*[A-Z])/.test(password) ? true : false) : false;

  const numbers: boolean =
    password !== "" ? (/(?=.*[0-9])/.test(password) ? true : false) : false;

  const specialCharacters: boolean =
    password !== ""
      ? /(?=.*[!@#$%^&*])/.test(password)
        ? true
        : false
      : false;

  const longEnough: boolean =
    password !== "" ? (password.length >= 8 ? true : false) : false;

  const passwordsMatch: boolean =
    password !== "" ? (password === cPassword ? true : false) : false;

  return (
    <View style={styles.validator}>
      <View style={styles.validation}>
        <Check
          size={16}
          color={uppercaseLetters ? colors.success : colors.primaryLight}
        />
        <AppText
          style={[
            styles.validationText,
            {
              color: uppercaseLetters
                ? colors.success
                : `rgba(${getRgbValues(colors.primary)}, 0.5)`,
            },
          ]}
        >
          Uppercase letters
        </AppText>
      </View>

      <View style={styles.validation}>
        <Check
          size={16}
          color={numbers ? colors.success : colors.primaryLight}
        />
        <AppText
          style={[
            styles.validationText,
            {
              color: numbers
                ? colors.success
                : `rgba(${getRgbValues(colors.primary)}, 0.5)`,
            },
          ]}
        >
          Numbers
        </AppText>
      </View>

      <View style={styles.validation}>
        <Check
          size={16}
          color={specialCharacters ? colors.success : colors.primaryLight}
        />
        <AppText
          style={[
            styles.validationText,
            {
              color: specialCharacters
                ? colors.success
                : `rgba(${getRgbValues(colors.primary)}, 0.5)`,
            },
          ]}
        >
          Special characters (!@#$%^&*)
        </AppText>
      </View>

      <View style={styles.validation}>
        <Check
          size={16}
          color={longEnough ? colors.success : colors.primaryLight}
        />
        <AppText
          style={[
            styles.validationText,
            {
              color: longEnough
                ? colors.success
                : `rgba(${getRgbValues(colors.primary)}, 0.5)`,
            },
          ]}
        >
          8 characters
        </AppText>
      </View>

      <View style={styles.validation}>
        <Check
          size={16}
          color={passwordsMatch ? colors.success : colors.primaryLight}
        />
        <AppText
          style={[
            styles.validationText,
            {
              color: passwordsMatch
                ? colors.success
                : `rgba(${getRgbValues(colors.primary)}, 0.5)`,
            },
          ]}
        >
          Passwords match
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  validator: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 10,
    columnGap: 14,
  },

  validation: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  validationText: {
    fontSize: 14,
  },
});
