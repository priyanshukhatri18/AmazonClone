import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import React, { useRef } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { verticalScale } from "@/utils/styling";
import BackButton from "@/components/BackButton";
import * as icons from "phosphor-react-native";
import { Input } from "@/components/Input";
import Button from "@/components/Button";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/config/firebase";

// Register function with error handling
const registerUser = async (
  email: string,
  password: string,
  username: string
) => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    return { success: true };
  } catch (error: any) {
    console.log("Firebase registration error:", error);
    if (error.code === "auth/email-already-in-use") {
      return { success: false, msg: "This email is already in use." };
    }
    return { success: false, msg: "Something went wrong. Please try again." };
  }
};

const Register = () => {
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const userRef = useRef("");
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!emailRef.current || !passwordRef.current || !userRef.current) {
      Alert.alert("Sign Up", "Please fill all fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailRef.current)) {
      Alert.alert("Sign Up", "Invalid email format");
      return;
    }

    if (passwordRef.current.length < 8) {
      Alert.alert("Sign Up", "Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);
    const response = await registerUser(
      emailRef.current,
      passwordRef.current,
      userRef.current
    );
    setIsLoading(false);

    if (response.success) {
      router.replace("/(auth)/login");
    } else {
      Alert.alert("Sign Up", response.msg);
    }
  };

  return (
    <ScreenWrapper>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
          keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
        >
          <BackButton iconsize={24} />

          <View style={{ gap: 5, marginTop: spacingY._20 }}>
            <Typo size={40} fontweight={"800"}>
              Let's
            </Typo>
            <Typo size={40} fontweight={"800"}>
              Get Started
            </Typo>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Typo size={16} color={colors.textLight}>
              Create an account to track your expenses
            </Typo>

            <Input
              placeholder="Enter your name"
              onChangeText={(value) => (userRef.current = value)}
              icon={
                <icons.User
                  size={verticalScale(20)}
                  color={colors.neutral300}
                  weight="fill"
                />
              }
              styleinput={undefined}
              stylecontainer={undefined}
              editable={!isLoading}
            />

            <Input
              placeholder="Enter your Email"
              onChangeText={(value) => (emailRef.current = value)}
              icon={
                <icons.At
                  size={verticalScale(20)}
                  color={colors.neutral300}
                  weight="fill"
                />
              }
              styleinput={undefined}
              stylecontainer={undefined}
              editable={!isLoading}
            />

            <Input
              placeholder="Enter your Password"
              onChangeText={(value) => (passwordRef.current = value)}
              secureTextEntry={true}
              icon={
                <icons.Lock
                  size={verticalScale(20)}
                  color={colors.neutral300}
                  weight="fill"
                />
              }
              styleinput={undefined}
              stylecontainer={undefined}
              editable={!isLoading}
            />
          </View>

          <Button
            title="Sign Up"
            onPress={handleSubmit}
            loading={isLoading}
            disabled={isLoading}
            backgroundColor={colors.primary}
            fontWeight="600"
            size={20}
            color={colors.black}
          />

          {/* Footer */}
          <View style={styles.footer}>
            <Typo size={14} color={colors.textLight}>
              Already have an account?
            </Typo>
            <Pressable onPress={() => router.push("/(auth)/login")}>
              <Typo size={14} color={colors.primary}>
                Login
              </Typo>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </ScreenWrapper>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacingY._30,
    paddingHorizontal: spacingX._20,
  },
  welcomeText: {
    fontSize: verticalScale(20),
    fontWeight: "bold",
    color: colors.text,
  },
  form: {
    gap: spacingY._20,
  },
  forgotPassword: {
    textAlign: "right",
    fontWeight: "500",
    color: colors.text,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacingX._10,
  },
});
