import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import React from "react";
import { walletType } from '@/types';
import { router, Router } from 'expo-router';
import Typo from './Typo';
import index from '@/app';
import { Image } from "expo-image";
import * as Icons from "phosphor-react-native"
import { verticalScale } from '@/utils/styling';
import { colors, radius, spacingX } from '@/constants/theme';

const WalletListItem = ({
    item,
    index,
    router,
}: {
    item: walletType,
    index: number,
    router: Router,
}
) => {

    const openWallet = () => {
        router.push({
            pathname: "/(modals)/walletModal",
            params: {
                id: item?.id,
                name: item?.name,
                image: item?.image
            }
        })
    }

    return (
        <Animated.View
            entering={FadeInDown.delay(index * 50)
                .springify()
                .damping(13)}
        >
            <TouchableOpacity style={styles.container} onPress={openWallet}>
                <View style={styles.imageContainer}>
                    <Image
                        style={{ flex: 1 }}
                        source={item?.image}
                        contentFit="cover"
                        transition={100}
                    />
                </View>
                <View style={styles.nameContainer}>
                    <Typo size={16}>
                        {item?.name}
                    </Typo>
                    <Typo size={14} color={colors.neutral400}>
                        $
                        {item?.amount}
                    </Typo>
                </View>
                <Icons.CaretRight
                    size={verticalScale(24)}
                    weight="bold"
                    color={colors.white}
                />
            </TouchableOpacity>
        </Animated.View>
    );
};

export default WalletListItem;
const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: verticalScale(17),
    },
    imageContainer: {
        height: verticalScale(45),
        width: verticalScale(45),
        borderRadius: radius._12,
        backgroundColor: colors.neutral600,
        borderCurve: "continuous",
        overflow: "hidden",
    },
    nameContainer: {
        flex: 1,
        gap: 2,
        marginLeft: spacingX._10
    },
});