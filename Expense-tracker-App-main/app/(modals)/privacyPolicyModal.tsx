import { ScrollView, StyleSheet, View } from "react-native";
import React from "react";
import ModalWrapper from "@/components/ModalWrapper";
import { colors, spacingY } from "@/constants/theme";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import Typo from "@/components/Typo";
import { verticalScale } from "@/utils/styling";

const PrivacyPolicyModal = () => {
  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title="Privacy Policy"
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />
        
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.section}>
            <Typo size={20} fontweight="600" color={colors.neutral100} style={styles.sectionTitle}>
              1. Introduction
            </Typo>
            <Typo size={16} color={colors.neutral300} style={styles.paragraph}>
              Welcome to our Privacy Policy. This document explains how we collect, use, and share your information when you use our application.
            </Typo>
          </View>

          <View style={styles.section}>
            <Typo size={20} fontweight="600" color={colors.neutral100} style={styles.sectionTitle}>
              2. Information We Collect
            </Typo>
            <Typo size={16} color={colors.neutral300} style={styles.paragraph}>
              We collect information you provide directly to us, such as your name, email address, and profile image when you create an account. We may also collect usage data and device information.
            </Typo>
          </View>

          <View style={styles.section}>
            <Typo size={20} fontweight="600" color={colors.neutral100} style={styles.sectionTitle}>
              3. How We Use Your Information
            </Typo>
            <Typo size={16} color={colors.neutral300} style={styles.paragraph}>
              We use the information we collect to provide and improve our services, communicate with you, and ensure security of our platform. This includes authenticating your account, personalizing your experience, and addressing technical issues.
            </Typo>
          </View>

          <View style={styles.section}>
            <Typo size={20} fontweight="600" color={colors.neutral100} style={styles.sectionTitle}>
              4. Information Sharing
            </Typo>
            <Typo size={16} color={colors.neutral300} style={styles.paragraph}>
              We do not sell your personal information. We may share information with third-party service providers who help us deliver our services, such as cloud storage providers and analytics services.
            </Typo>
          </View>

          <View style={styles.section}>
            <Typo size={20} fontweight="600" color={colors.neutral100} style={styles.sectionTitle}>
              5. Data Security
            </Typo>
            <Typo size={16} color={colors.neutral300} style={styles.paragraph}>
              We implement appropriate security measures to protect your personal information. However, no digital platform can guarantee 100% security, so we encourage you to use strong passwords and secure your devices.
            </Typo>
          </View>

          <View style={styles.section}>
            <Typo size={20} fontweight="600" color={colors.neutral100} style={styles.sectionTitle}>
              6. Your Rights
            </Typo>
            <Typo size={16} color={colors.neutral300} style={styles.paragraph}>
              Depending on your location, you may have rights regarding your personal information, including the right to access, correct, delete, or restrict processing of your data. Contact us if you wish to exercise these rights.
            </Typo>
          </View>

          <View style={styles.section}>
            <Typo size={20} fontweight="600" color={colors.neutral100} style={styles.sectionTitle}>
              7. Changes to Privacy Policy
            </Typo>
            <Typo size={16} color={colors.neutral300} style={styles.paragraph}>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the effective date.
            </Typo>
          </View>

          <View style={[styles.section, { marginBottom: spacingY._35 }]}>
            <Typo size={20} fontweight="600" color={colors.neutral100} style={styles.sectionTitle}>
              8. Contact Us
            </Typo>
            <Typo size={16} color={colors.neutral300} style={styles.paragraph}>
              If you have any questions about this Privacy Policy, please contact us at support@yourapp.com.
            </Typo>
          </View>
        </ScrollView>
      </View>
    </ModalWrapper>
  );
};

export default PrivacyPolicyModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingY._20,
  },
  contentContainer: {
    paddingBottom: spacingY._30,
  },
  section: {
    marginBottom: spacingY._20,
  },
  sectionTitle: {
    marginBottom: spacingY._10,
  },
  paragraph: {
    lineHeight: verticalScale(24),
  },
});