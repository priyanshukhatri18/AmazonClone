import { colors, radius } from '@/constants/theme'
import { BackButtonProps } from '@/types'
import { verticalScale } from '@/utils/styling'
import { useNavigation, useRoute } from '@react-navigation/native'
import { CaretLeft } from 'phosphor-react-native'
import React from 'react'
import { StyleSheet , Text, TouchableOpacity, View } from 'react-native'

const BackButton = ({
    style,
    iconsize = 24,
} : BackButtonProps) => {
    const navigation = useNavigation();
  return (
    <TouchableOpacity  onPress={() => navigation.goBack()} style={[styles.button, style]}>
        <CaretLeft 
        size={verticalScale(iconsize)} 
        weight="bold" 
        color ={colors.white}
        />
    </TouchableOpacity>
  )
}

export default BackButton

const styles = StyleSheet.create({
  button: {
    backgroundColor : colors.neutral600,
    alignSelf : "flex-start",
    borderRadius : radius._12,
    borderCurve :'continuous',
    padding : 10,
    
  },
})
