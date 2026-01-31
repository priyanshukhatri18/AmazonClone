import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import React, { useState } from "react";
import { 
    Alert, 
    Pressable, 
    StyleSheet, 
    View, 
    KeyboardAvoidingView, 
    TouchableWithoutFeedback, 
    Keyboard, 
    Platform
} from "react-native";
import { verticalScale } from "@/utils/styling";
import BackButton from "@/components/BackButton";
import * as icons from 'phosphor-react-native';
import { Input } from "@/components/Input";
import Button from "@/components/Button";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/authContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
    const { login: loginUser } = useAuth();

    const handleSubmit = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please fill all the fields");
            return;
        }

        setIsLoading(true);

        try {
            console.log("EMAIL:", email);
            console.log("PASSWORD:", password);

            const res = await loginUser(email, password);

            if (!res.success) {
                Alert.alert("Login Failed", res.msg);
            }
        } catch (error) {
            Alert.alert("Error", "An unexpected error occurred");
        } finally {
            setIsLoading(false);
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
                        <Typo size={40} fontweight={'800'}>
                            Hey,
                        </Typo>
                        <Typo size={40} fontweight={'800'}>
                            Welcome Back To Recall.Ai
                        </Typo>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
                        <Typo size={16} color={colors.textLight}>
                            Login now to track your expenses
                        </Typo>

                        <Input
                            placeholder="Enter your Email"
                            value={email}
                            onChangeText={setEmail}
                            icon={<icons.At size={verticalScale(20)} color={colors.neutral300} weight="fill" />} styleinput={undefined} stylecontainer={undefined}                        />

                        <Input
                            placeholder="Enter your Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            icon={<icons.Lock size={verticalScale(20)} color={colors.neutral300} weight="fill" />} styleinput={undefined} stylecontainer={undefined}                        />

                        <Typo
                            size={14}
                            color={colors.text}
                            style={{ alignSelf: 'flex-end' }}
                        >
                            Forgot Password?
                        </Typo>
                    </View>

                    <Button
                        title="Login"
                        onPress={handleSubmit}
                        loading={isLoading}
                        backgroundColor={colors.primary}
                        fontWeight="600"
                        size={20}
                        color={colors.black}
                    />

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Typo size={14} color={colors.textLight}>
                            Don't have an account?
                        </Typo>
                        <Pressable onPress={() => router.push("/(auth)/register")}>
                            <Typo size={14} color={colors.primary}>
                                Sign Up
                            </Typo>
                        </Pressable>
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </ScreenWrapper>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: spacingY._30,
        paddingHorizontal: spacingX._20,
    },
    form: {
        gap: spacingY._20,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: spacingX._10,
    }
});
