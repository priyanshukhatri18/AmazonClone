import React from 'react';
import { Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import { colors, spacingX, spacingY } from '@/constants/theme';
import { verticalScale } from '@/utils/styling';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import Button from "@/components/Button";

const Welcome = () => {
  const router = useRouter();

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => router.push('/(auth)/login')}
          style={styles.loginButton}
          accessible
          accessibilityLabel="Sign in button"
          accessibilityRole="button"
        >
          <Typo fontweight="500">Sign In</Typo>
        </TouchableOpacity>

        <Animated.Image
          entering={FadeIn.duration(700)}
          source={require("../../assets/images/welcome.png")}
          style={styles.welcomeImage}
          resizeMode="contain"
          accessibilityLabel="Welcome illustration"
        />
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Animated.View
          entering={FadeInDown.duration(1000).springify()}
          style={{ alignItems: 'center' }}
        >
          <Typo size={30} fontweight="800">Always take control</Typo>
          <Typo size={30} fontweight="800">of your finances with</Typo>
          <Typo size={40} color='#197607' fontweight="800">Recall.Ai</Typo>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(1000).delay(100).springify()}
          style={{ alignItems: 'center', gap: 2 }}
        >
          <Typo size={17} color={colors.textLight}>
            Finance must be arranged to set a better
          </Typo>
          <Typo size={17} color={colors.textLight}>
            Lifestyle in future
          </Typo>
          <View style={styles.buttonContainer}>

            <Button
              title="get started"
              onPress={() => router.push("/(auth)/register")}
              style={styles.startButton}
              backgroundColor={colors.primary}
              fontWeight="600"
              size={20}
              color={colors.white}
            />
          </View>
        </Animated.View>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: spacingY._7,
  },
  welcomeImage: {
    width: '100%',
    height: verticalScale(400),
    alignSelf: 'center',
    marginTop: spacingY._20, // Use theme spacing
  },
  loginButton: {
    alignSelf: 'flex-end',
    marginRight: spacingX._20,
  },
  footer: {
    backgroundColor: colors.neutral900,
    alignItems: 'center',
    paddingTop: verticalScale(30),
    paddingBottom: verticalScale(45),
    gap: spacingX._10,
    shadowColor: colors.neutral800, // More visible shadow
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 10,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: spacingX._15,
    marginTop: verticalScale(20),
    alignItems: "center", // Horizontally center
    justifyContent: "center", // Vertically center (if needed)
  },
  startButton: {
    //width: '100%', // Reduce from 100% to leave space for centering
    //backgroundColor: colors.primary,
    //paddingVertical: verticalScale(15),
    //borderRadius: 25,
    //alignItems: 'center', // Center text inside the button
    //justifyContent: 'center',
    //textAlign: "center"
    //alignContent: "center"
  },
});

export default Welcome;