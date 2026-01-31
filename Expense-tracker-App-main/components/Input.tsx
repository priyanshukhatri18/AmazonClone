import { colors, radius, spacingX } from '@/constants/theme';
import { InputProps } from '@/types';
import { verticalScale } from '@/utils/styling';
import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';

export const Input = (props: InputProps) => {
  const { multiline, styleinput, stylecontainer } = props;

  return (
    <View
      style={[
        styles.container,
        multiline && { height: verticalScale(100), alignItems: 'flex-start' },
        stylecontainer,
      ]}
    >
      {props.icon && props.icon}
      <TextInput
        style={[
          styles.input,
          multiline && {
            height: '100%',
            textAlignVertical: 'top',
            paddingTop: 10,
          },
          styleinput,
        ]}
        placeholderTextColor={colors.neutral500}
        ref={props.inputRef}
        multiline={multiline}
        {...props}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {

    flexDirection : 'row',
    height : verticalScale(50),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: radius._15,
    borderCurve: 'continuous',
    paddingHorizontal: spacingX._15,
    gap : spacingX._12,
  },
  input: {
    flex: 1,
    color: colors.white,
    fontSize: verticalScale(14),
    height: 40,
    //borderColor: 'gray',
    //borderWidth: 1,
    padding: 10,
    //borderRadius: 5,
    width: '100%',
  },
});