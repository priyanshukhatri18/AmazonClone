import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Animated from 'react-native-reanimated';
import React from 'react'
import { TransactionItemProps, TransactionListType, TransactionType } from '@/types'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import Typo from './Typo';
import { FlashList } from "@shopify/flash-list";
import { verticalScale } from '@/utils/styling';
import Loading from './Loading';
import { expenseCategories, incomeCategory, fallbackCategory } from '@/constants/data';
import { FadeInDown } from 'react-native-reanimated';
import { Timestamp } from 'firebase/firestore';
import { useRouter } from 'expo-router';

const TransactionList = ({
    data = [],
    title,
    loading,
    emptyListMessage = "No transactions found"
}: TransactionListType) => {

    const router = useRouter();
    const handleClick = (item: TransactionType) => {
        router.push({
            pathname : "/(modals)/transactionModal",
            params:{
                id : item?.id,
                type : item?.type,
                amount: item?.amount?.toString(),
                category: item?.category,
                date : (item.date as Timestamp)?.toDate()?.toISOString(),
                description:item?.description,
                image: item?.image,
                uid : item?.uid,
                walletId: item?.walletId,
            }
        })
        
    }

    return (
        <View style={styles.container}>
            {title && (
                <Typo size={20} fontweight="500">
                    {title}
                </Typo>
            )}

            <View style={styles.list}>
                <FlashList
                    data={data}
                    renderItem={({ item, index }) => (
                        <TransactionItem
                            item={item}
                            index={index}
                            handleClick={handleClick}
                        />
                    )}
                    estimatedItemSize={60}
                    ListEmptyComponent={
                        !loading ? (
                            <Typo 
                                size={15}
                                color={colors.neutral400}
                                style={styles.emptyMessage}
                            >
                                {emptyListMessage}
                            </Typo>
                        ) : null
                    }
                    keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                />
            </View>

            {loading && (
                <View style={styles.loadingContainer}>
                    <Loading />
                </View>
            )}
        </View>
    );
};

const TransactionItem = ({
    item, 
    index, 
    handleClick
}: TransactionItemProps) => {
    const isIncome = item?.type === "income";
const category = isIncome 
    ? incomeCategory 
    : (expenseCategories[item.category!] || fallbackCategory);

const IconComponent = category.icon;
const amountColor = isIncome ? colors.primary : colors.rose;
    
    // Safe date handling
    const transactionDate = item?.date instanceof Timestamp 
        ? item.date.toDate()
        : new Date(item?.date || Date.now());
    
    const formattedDate = transactionDate.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short"
    });

    return (
        <Animated.View
            entering={FadeInDown.delay(index * 70)
                .springify()
                .damping(14)
            }
        >
            <TouchableOpacity 
                style={styles.row} 
                onPress={() => handleClick(item)}
                activeOpacity={0.8}
            >
                <View style={[styles.icon, { backgroundColor: category.bgColor }]}>
                    <IconComponent
                        height={verticalScale(25)}
                        width={verticalScale(25)}
                        color={colors.white}
                    />
                </View>

                <View style={styles.categoryDes}>
                    <Typo size={17} >
                        {category.label}
                    </Typo>
                    <Typo size={12} color={colors.neutral400} >
                        {item?.description || "No description"}
                    </Typo>
                </View>
                
                <View style={styles.amountDate}>
                    <Typo 
                        fontweight="500" 
                        color={amountColor}
                    >
                        {`${isIncome ? "+" : "-"} $${item?.amount?.toLocaleString()}`}
                    </Typo>
                    <Typo size={13} color={colors.neutral400}>
                        {formattedDate}
                    </Typo>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}

export default TransactionList;

const styles = StyleSheet.create({
    container: {
        gap: spacingY._17,
        flex: 1,
    },
    list: {
        minHeight: 3,
        flex: 1,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: spacingX._12,
        marginBottom: spacingY._12,
        backgroundColor: colors.neutral800,
        padding: spacingY._10,
        paddingHorizontal: spacingX._10,
        borderRadius: radius._17,
    },
    icon: {
        width: 40,
        height: 40,
        borderRadius: radius._10,
        justifyContent: "center",
        alignItems: "center",
    },
    categoryDes: {
        flex: 1,
        gap: 2.5
    },
    amountDate: {
        alignItems: "flex-end",
        gap: 3,
        maxWidth: '30%',
    },
    loadingContainer: {
        position: 'absolute',
        width: '100%',
        top: '50%',
        transform: [{ translateY: -verticalScale(25) }],
    },
    emptyMessage: {
        textAlign: "center", 
        marginTop: verticalScale(20)
    }
});