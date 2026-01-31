import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Typo from "@/components/Typo";
import { colors, spacingX } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import ScreenWrapper from "@/components/ScreenWrapper";
import { verticalScale } from "@/utils/styling";
import * as Icons from 'phosphor-react-native'
import { ScrollView } from "react-native";
import HomeCard from "@/components/HomeCard";
import TransactionList from "@/components/TransactionList";
import CustomButton from "@/components/Button";
import { useRouter } from "expo-router";
import { limit, orderBy, where } from "firebase/firestore";
import { TransactionType } from "@/types";
import useFetchData from "@/hooks/useFetchData";


const Home = () => {
  const { user } = useAuth();
  const router = useRouter();

  const constraints =[
    where("uid", "==", user?.uid),
    orderBy("date" , "desc"),
    limit(30)
  ];

  const {
    data : recentTransactions , 
    error , 
    loading : transactionLoading
} = useFetchData<TransactionType>("transaction" ,constraints)
     

  return (
    <ScreenWrapper>

      <View style={styles.container}>
        {/* {heaer} */}
        <View style={styles.header}>
          <View style={{ gap: 4 }}>
            <Typo size={16} color={colors.neutral400}>
              Recall.Ai
            </Typo>
            <Typo size={20} fontweight={"600"}>
              {user?.name}
            </Typo>
          </View>
          <TouchableOpacity style={styles.searchIcon}>
            <Icons.MagnifyingGlass
              size={verticalScale(22)}
              color={colors.neutral200}
              weight="bold"
            />
          </TouchableOpacity>
        </View>
        <ScrollView
          contentContainerStyle={styles.scrollViewStyle}
          showsVerticalScrollIndicator={false}
        >
          {/* {card} */}
          <View>
            <HomeCard />
          </View>
          <TransactionList
            data={recentTransactions}
            loading={transactionLoading}
            emptyListMessage="NO Transaction added yet!"
            title="Recent Transactions" />
        </ScrollView>

        <CustomButton style={styles.floatingButton} onPress={() => router.push("/(modals)/transactionModal")}>
          <Icons.Plus
            color={colors.black}
            weight="bold"
            size={verticalScale(24)}
          />
        </CustomButton>

      </View>
    </ScreenWrapper>
  );
}

export default Home;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
    marginTop: verticalScale(8),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingX._10
  },
  searchIcon: {
    backgroundColor: colors.neutral700,
    padding: spacingX._10,
    borderRadius: 50,
  },
  floatingButton: {
    height: verticalScale(50),
    width: verticalScale(50),
    borderRadius: verticalScale(28), // half of height/width for perfect circle
    position: "absolute",
    bottom: verticalScale(30),
    right: verticalScale(30),
  },
  scrollViewStyle: {
  }
});