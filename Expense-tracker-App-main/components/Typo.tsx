import { StyleSheet, Text, TextStyle, View } from 'react-native';
import React from 'react';
import { TypoProps } from "@/types";
import { colors } from '@/constants/theme';
import { verticalScale } from '@/utils/styling';

const Typo = ({
    size,
    color = colors.text,
    fontweight = '400',
    children,
    style,
    textProps = {},
} : TypoProps )=> {
  

    const textStyle : TextStyle = {
        fontSize : size ? verticalScale(size) : verticalScale(18),
        color,
        fontWeight : fontweight,
    };
    return (
    <Text style = {[textStyle ,style]} {...textProps}>
        {children}
    </Text>
    );
};

export default Typo;

const style = StyleSheet.create({})