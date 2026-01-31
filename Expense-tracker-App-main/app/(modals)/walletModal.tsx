import { ScrollView, StyleSheet, Text, View, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import ModalWrapper from "@/components/ModalWrapper";
import { colors, spacingX, spacingY } from "@/constants/theme";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import { scale, verticalScale } from "@/utils/styling";
import * as Icons from "phosphor-react-native";
import Typo from "@/components/Typo";
import { Input } from "@/components/Input";
import { walletType } from "@/types";
import Button from "@/components/Button";
import { useAuth } from "@/contexts/authContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import ImageUpload from "@/components/ImageUpload";
import { createrOrupdateWallet, deletewallet } from "@/services/walletServices";

const WalletModal = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [wallet, setWallet] = useState<walletType>({
    name: "",
    image: null,
  });

  const oldWallet = useLocalSearchParams() as {
    name?: string;
    image?: string;
    id?: string;
  };

  useEffect(() => {
    if (oldWallet?.id) {
      setWallet({
        name: oldWallet.name || "",
        image: oldWallet.image || null,
      });
    }
  }, []);

  const onSubmit = async () => {
    let { name, image } = wallet;
    if (!name.trim() || !image) {
      Alert.alert("Wallet", "Please enter your wallet name and upload an icon.");
      return;
    }

    const data: walletType = {
      name,
      image,
      uid: user?.uid,
    };

    if (oldWallet?.id) data.id = oldWallet.id;

    setLoading(true);
    const res = await createrOrupdateWallet(data);
    setLoading(false);

    if (res.success) {
      router.back();
    } else {
      Alert.alert("Wallet", res.msg);
    }
  };

  const onDelete = async () => {
    if (!oldWallet?.id) return;
    setLoading(true);
    const res = await deletewallet(oldWallet.id);
    setLoading(false);
    if (res.success) {
      router.back();
    } else {
      Alert.alert("Wallet", res.msg);
    }
  };

  const showDeleteAlert = () => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to do this?\nThis action will remove all the transactions.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Delete"),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => onDelete(),
          style: "destructive",
        },
      ]
    );
  };

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title={oldWallet?.id ? "Update Wallet" : "New Wallet"}
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />

        {/* form  */}
        <ScrollView contentContainerStyle={styles.form}>
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Wallet Name</Typo>
            <Input
              placeholder="Ex:- Salary"
              value={wallet.name}
              onChangeText={(value) => setWallet({ ...wallet, name: value })}
              placeholderTextColor={colors.neutral500}
              styleinput={undefined}
              stylecontainer={undefined}
            />
          </View>

          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Wallet Icon</Typo>
            <ImageUpload
              file={wallet.image}
              onClear={() => setWallet({ ...wallet, image: null })}
              onSelect={(file) => setWallet({ ...wallet, image: file })}
              placeholder="Upload image"
            />
          </View>
        </ScrollView>
      </View>

      <View style={styles.Footer}>
        {oldWallet?.id && !loading && (
          <Button
            onPress={showDeleteAlert}
            style={{
              backgroundColor: colors.rose,
              paddingHorizontal: spacingX._15,
            }}
          >
            <Icons.Trash
              color={colors.white}
              size={verticalScale(24)}
              weight="bold"
            />
          </Button>
        )}
        <Button onPress={onSubmit} loading={loading} style={{ flex: 1 }}>
          <Typo fontweight={"600"}>
            {oldWallet?.id ? "Update Wallet" : "Create Wallet"}
          </Typo>
        </Button>
      </View>
    </ModalWrapper>
  );
};

export default WalletModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacingY._20,
  },
  form: {
    gap: spacingY._30,
    marginTop: spacingY._10,
  },
  inputContainer: {
    gap: spacingY._10,
  },
  Footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacingY._20,
    gap: scale(12),
    paddingTop: spacingY._15,
    borderTopColor: colors.neutral700,
    marginBottom: spacingY._5,
    borderTopWidth: 1,
  },
});
