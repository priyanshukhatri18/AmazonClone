import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { verticalScale } from "@/utils/styling";
import { colors, radius, spacingX } from "@/constants/theme";
import Typo from "@/components/Typo";
import * as Icons from 'phosphor-react-native'
import { useRouter } from "expo-router";
import useFetchData from "@/hooks/useFetchData";
import { walletType } from "@/types";
import { useAuth } from "@/contexts/authContext";
import { orderBy, where } from "firebase/firestore";
import Loading from "@/components/Loading";
import WalletListItem from "@/components/WalletListItem";

const Wallet = () => {

  const router = useRouter();
  const {user} = useAuth();
  const {data : wallets , error , loading} = useFetchData<walletType>("wallets" , [
    where ("uid" , "==" , user?.uid),
    orderBy("created" , "desc"),
  ]);
  const getTotalbalance = () =>
  wallets.reduce((total, item) => {
    return total + (item.amount || 0);
  }, 0);

  return (
    <ScreenWrapper style={{ backgroundColor: "black" }}>
      <View style={styles.container}>
        <View style={styles.balaceView}>
          <View style={{ alignItems: "center" }}>
            <Typo size={40} fontweight={"500"}>
              ${getTotalbalance()?.toFixed(2)}
            </Typo>
            <Typo size={16} fontweight={"400"} color={colors.neutral300}>
              Total Balance
            </Typo>
          </View>
        </View>
        <View style={styles.wallet} >
          {/* Add your wallet content here */}
          <View style={styles.flexRow}>
            <Typo size={20} fontweight={"500"} >
              My Wallet
            </Typo>
            <TouchableOpacity onPress={() => router.push("/(modals)/walletModal")}>
              <Icons.PlusCircle
                size={24}
                color={colors.primary}
                weight="fill"
              />
            </TouchableOpacity>
          </View>

          {loading && <Loading />}
          <FlatList
          data={wallets}
          renderItem={({ item , index }) => {
            return ( 
              <WalletListItem 
                item = {item} 
                index={index} 
                router = {router} />
           );
          }}
          contentContainerStyle={styles.lifeStyle}
        />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Wallet;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  balaceView: {
    height: verticalScale(160),
    backgroundColor: colors.black,
    justifyContent: "center",
    alignItems: "center",
  },
  wallet: {
    flex: 1,
    backgroundColor: colors.neutral900,
    borderTopRightRadius: radius._30,
    borderTopLeftRadius: radius._30,
    padding: spacingX._20,
    paddingTop: spacingX._25,
  },
  flexRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingX._10,
  },
  lifeStyle: {
    paddingBottom: verticalScale(10), // ✅ You can customize this as needed
  },
});