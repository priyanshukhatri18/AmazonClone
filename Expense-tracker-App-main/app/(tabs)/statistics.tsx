import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import Header from "@/components/Header";
import { scale, verticalScale } from "@/utils/styling";
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { BarChart, LineChart, PieChart, PopulationPyramid, RadarChart } from "react-native-gifted-charts";
import Loading from "@/components/Loading";
import { fetchMonthlyStats, fetchWeeklyStats, fetchYearlyStats } from "@/services/transactionServices";
import { useAuth } from "@/contexts/authContext";
import TransactionList from "@/components/TransactionList";
import { TransactionType } from "@/types";

type ChartData = {
    value: number;
    label: string;
    spacing: number;
    labelWidth: number;
    frontColor: string;
}[];

const Statistics = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const { user } = useAuth();
    const [chartData, setChartData] = useState<ChartData>([]);
    const [chartLoading, setChartLoading] = useState(false);
    const [transactions, setTransactions] = useState<TransactionType[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user?.uid) {
            setError("User not authenticated");
            return;
        }

        if (activeIndex === 0) {
            getWeeklyStats();
        } else if (activeIndex === 1) {
            getMonthlyStats();
        } else if (activeIndex === 2) {
            getYearlyStats();
        }
    }, [activeIndex, user?.uid]);

    const handleStatsFetch = async (fetchFunction: (uid: string) => Promise<any>) => {
        if (!user?.uid) return;
        
        setChartLoading(true);
        setError(null);
        try {
            const res = await fetchFunction(user.uid);
            if (res.success) {
                setChartData(res.data.stats);
                setTransactions(res.data.transactions);
            } else {
                setError(res.msg);
                Alert.alert("Error", res.msg);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
            setError(errorMessage);
            Alert.alert("Error", errorMessage);
        } finally {
            setChartLoading(false);
        }
    };

    const getWeeklyStats = () => handleStatsFetch(fetchWeeklyStats);
    const getMonthlyStats = () => handleStatsFetch(fetchMonthlyStats);
    const getYearlyStats = () => handleStatsFetch(fetchYearlyStats);

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Header title="Statistics" />
                </View>

                <ScrollView
                    contentContainerStyle={{
                        gap: spacingY._20,
                        paddingTop: spacingY._5,
                        paddingBottom: verticalScale(100)
                    }}
                    showsVerticalScrollIndicator={false}
                >
                    <SegmentedControl
                        values={['Weekly', 'Monthly', 'Yearly']}
                        selectedIndex={activeIndex}
                        onChange={(event) => {
                            setActiveIndex(event.nativeEvent.selectedSegmentIndex);
                        }}
                        tintColor={colors.neutral200}
                        backgroundColor={colors.neutral800}
                        appearance="dark"
                        activeFontStyle={styles.segmentFontStyle}
                        style={styles.segmentStyle}
                        fontStyle={{ ...styles.segmentFontStyle, color: colors.white }}
                    />

                    <View style={styles.chartContainer}>
                        {
                            chartData.length > 0 ? (
                                <BarChart
                                    data={chartData}
                                    barWidth={scale(12)}
                                    spacing={[1, 2].includes(activeIndex) ? scale(25) : scale(16)}
                                    roundedTop
                                    roundedBottom
                                    hideRules
                                    yAxisLabelPrefix="$"
                                    yAxisThickness={0}
                                    xAxisThickness={0}
                                    yAxisLabelWidth={
                                        [1, 2].includes(activeIndex) ? scale(38) : scale(35)
                                    }
                                    yAxisTextStyle={{ color: colors.neutral350 }}
                                    xAxisLabelTextStyle={{
                                        color: colors.neutral350,
                                        fontSize: verticalScale(12),
                                    }}
                                    noOfSections={3}
                                    minHeight={5}
                                //isAnimated={true}
                                //maxValue={100}
                                />
                            ) : (
                                <View style={styles.noChart} />
                            )}

                        {
                            chartLoading && (
                                <View style={styles.chartContainer}>
                                    <Loading color={colors.white} />
                                </View>
                            )
                        }
                    </View>

                    {/* //Transaction */}
                    <View>
                        <TransactionList
                            title="Transactions"
                            emptyListMessage="No transaction found"
                            data={transactions}
                        />
                    </View>

                </ScrollView>
            </View>
        </ScreenWrapper>
    );
}

export default Statistics;
const styles = StyleSheet.create({

    container: {
        paddingHorizontal: spacingX._20,
        paddingVertical: spacingY._5,
        gap: spacingY._10,
    },
    header: {

    },
    segmentFontStyle: {
        fontSize: verticalScale(13),
        fontWeight: "bold",
        color: colors.black,
    },
    segmentStyle: {
        height: scale(37),
    },
    chartContainer: {
        position: "relative",
        justifyContent: "center",
        alignItems: "center",
    },
    noChart: {
        backgroundColor: "rgba(0,0,0,0.6)",
        height: verticalScale(120),
    },
    chartLoadingContainer: {
        position: "absolute",
        width: "100%",
        height: 100,
        borderRadius: radius._12,
        backgroundColor: "rgba(0,0,0,0.6)",
    }
});