import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  View,
  StyleProp,
  ViewStyle,
} from 'react-native';

import { colors, spacingY } from '@/constants/theme';
import Typo from '@/components/Typo';

type ButtonProps = {
  title?: string;
  onPress: () => void;
  size?: number;
  color?: string;
  backgroundColor?: string;
  fontWeight?: 'normal' | 'bold' | '600' | '700' | '800';
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  size = 16,
  color = colors.white,
  backgroundColor = colors.primary,
  fontWeight = '600',
  style,
  disabled = false,
  loading = false,
  icon,
  children,
}) => {
  const isIconOnly = !title && !children;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: disabled ? colors.neutral300 : backgroundColor,
          paddingVertical: isIconOnly ? 0 : spacingY._10,
          paddingHorizontal: isIconOnly ? 0 : 16,
        },
        style,
      ]}
      onPress={onPress}
      disabled={loading || disabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator size="small" color={color} />
      ) : children ? (
        children // ✅ render custom JSX directly
      ) : (
        <View style={[styles.content, { width: '100%', justifyContent: 'center' }]}>
          {icon && <View style={styles.icon}>{icon}</View>}
          {title && (
            <Typo 
              fontweight={fontWeight} 
              color={color} 
              size={size}
              style={{ textAlign: 'center' }}
            >
              {title}
            </Typo>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

// Add or update your styles
const styles = StyleSheet.create({
  button: {
    borderRadius: 50, // For rounded corners as shown in image
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Center items horizontally
    width: '100%', // Take full width
  },
  icon: {
    marginRight: 8,
  },
});

export default Button;
