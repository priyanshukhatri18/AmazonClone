import { ScrollView, StyleSheet, Text, View, Alert, Pressable, Platform, Touchable, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import ModalWrapper from "@/components/ModalWrapper";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import { scale, verticalScale } from "@/utils/styling";
import * as Icons from "phosphor-react-native";
import Typo from "@/components/Typo";
import { Input } from "@/components/Input";
import { TransactionType, walletType } from "@/types";
import Button from "@/components/Button";
import { useAuth } from "@/contexts/authContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import ImageUpload from "@/components/ImageUpload";
import { createrOrupdateWallet, deletewallet } from "@/services/walletServices";
import { Dropdown } from 'react-native-element-dropdown';
import { expenseCategories, transactionTypes } from "@/constants/data";
import { orderBy, Transaction, where } from "firebase/firestore";
import useFetchData from "@/hooks/useFetchData";
import DateTimePicker from '@react-native-community/datetimepicker';
import { createrOrupdateTransaction, deleteTransaction } from "@/services/transactionServices";

const TransactionModal = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setshowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const router = useRouter();

  type paramType = {
    description: string;
    id: string;
    type: string;
    amount: string;
    category: string;
    date: string;
    image: any;
    uid: string;
    walletId: string;
  };

  const oldTransaction: paramType = useLocalSearchParams();

  const [transaction, setTransaction] = useState<TransactionType>({
    type: 'expense',
    amount: 0,
    description: "",
    category: "",
    date: new Date(),
    walletId: oldTransaction?.walletId || "",
    image: null,
  });

  const {
    data: wallets,
    error: walletError,
    loading: walletLoading
  } = useFetchData<walletType>("wallets", [
    where("uid", "==", user?.uid),
    orderBy("created", "desc"),
  ]);

  const onDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || transaction.date;
    setTransaction({ ...transaction, date: currentDate })
    setshowDatePicker(Platform.OS == 'ios' ? true : false);
  };
  useEffect(() => {
    if (oldTransaction?.id) {
      setTransaction(prev => ({
        ...prev,
        type: oldTransaction?.type,
        amount: Number(oldTransaction.amount),
        description: oldTransaction.description || "",
        category: oldTransaction.category || "",
        date: new Date(oldTransaction.date),
        walletId: oldTransaction.walletId,
        image: oldTransaction.image || null,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oldTransaction?.id]);

  const onSubmit = async () => {
    const { type, amount, description, category, date, walletId, image } = transaction;

    if (!walletId || !date || !amount || (type == "expense" && !category)) {
      Alert.alert("Transaction", "please fill all the fields");
      return;
    }

    let transactionData: TransactionType = {
      type,
      amount,
      description,
      category,
      date,
      walletId,
      image: image ? image : null,
      uid: user?.uid,
 
    };

    if (oldTransaction?.id) transaction.id = oldTransaction.id;
    setLoading(true);
    const res = await createrOrupdateTransaction(transactionData);

    setLoading(false);
    if (res.success) {
      router.back();
    } else {
      Alert.alert("Transaction", res.msg);
    }
  };

  const onDelete = async () => {
    console.log('Deleting transaction with params:', {
      id: oldTransaction?.id,
      walletId: oldTransaction?.walletId,
      allParams: oldTransaction
    });

    if (!oldTransaction?.id || !oldTransaction?.walletId) {
      console.log('Missing required fields:', {
        hasId: !!oldTransaction?.id,
        hasWalletId: !!oldTransaction?.walletId
      });
      Alert.alert("Transaction", "No transaction or wallet selected for deletion.");
      return;
    }

    setLoading(true);
    const res = await deleteTransaction(oldTransaction.id, oldTransaction.walletId);
    setLoading(false);

    if (res.success) {
      router.back();
    } else {
      Alert.alert("Transaction", res.msg);
    }
  };
  console.log('Deleting transaction with id:', oldTransaction?.id);
  console.log('Using wallet id:', oldTransaction?.walletId);

  const showDeleteAlert = () => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to Delete this transaction?",
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
      ]);
  };
  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title={oldTransaction?.id ? "Update Transaction" : "New Transaction"}
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />
        {/* form  */}
        <ScrollView contentContainerStyle={styles.form}
          showsHorizontalScrollIndicator={false}
        >
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200} size={16}>Type</Typo>
            <Dropdown
              style={styles.dropdownContainer}
              activeColor={colors.neutral700}
              placeholderStyle={styles.dropdownPlaceholder}
              selectedTextStyle={styles.dropdownSelectedText}
              iconStyle={styles.dropdowmIcon}
              data={transactionTypes}
              maxHeight={300}
              labelField="label"
              valueField="value"
              // placeholder={!isFocus? 'Select item' : '...'}
              itemTextStyle={styles.dropdownItemText}
              itemContainerStyle={styles.dropdownItemContainer}
              containerStyle={styles.dropdownListContainer}
              value={transaction.type}
              onChange={item => {
                setTransaction({ ...transaction, type: item.value });

              }}
            />
          </View>

          {
            wallets && wallets.length > 0 && (
              <View style={styles.inputContainer}>
                <Typo color={colors.neutral200} size={16}>Wallet</Typo>
                <Dropdown
                  style={styles.dropdownContainer}
                  activeColor={colors.neutral700}
                  placeholderStyle={styles.dropdownPlaceholder}
                  selectedTextStyle={styles.dropdownSelectedText}
                  iconStyle={styles.dropdowmIcon}
                  data={wallets.map(wallet => ({
                    label: `${wallet?.name} ($${wallet.amount})`,
                    value: wallet?.id,
                  }))}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={"Select wallet"}
                  itemTextStyle={styles.dropdownItemText}
                  itemContainerStyle={styles.dropdownItemContainer}
                  containerStyle={styles.dropdownListContainer}
                  value={transaction.walletId}
                  onChange={item => {
                    setTransaction({ ...transaction, walletId: item.value || "" });
                  }}
                />
              </View>
            )
          }

          {/* expense category  */}
          {
            transaction.type == 'expense' && (
              <View style={styles.inputContainer}>
                <Typo color={colors.neutral200} size={16}>Expense Category</Typo>
                <Dropdown
                  style={styles.dropdownContainer}
                  activeColor={colors.neutral700}
                  placeholderStyle={styles.dropdownPlaceholder}
                  selectedTextStyle={styles.dropdownSelectedText}
                  iconStyle={styles.dropdowmIcon}
                  data={Object.values(expenseCategories)}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={"Select category"}
                  itemTextStyle={styles.dropdownItemText}
                  itemContainerStyle={styles.dropdownItemContainer}
                  containerStyle={styles.dropdownListContainer}
                  value={transaction.category}
                  onChange={item => {
                    setTransaction({
                      ...transaction,
                      category: item.value || ""
                    });
                  }}
                />
              </View>
            )}

          {/* date picker */}

          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200} size={16}>Date</Typo>
            {
              !showDatePicker &&
              (
                <Pressable
                  style={styles.dateInput}
                  onPress={() => setshowDatePicker(true)}
                >
                  <Typo size={14}>
                    {(transaction.date as Date).toLocaleDateString()}
                  </Typo>
                </Pressable>
              )}
            {
              showDatePicker && (
                <View style={Platform.OS === 'ios' ? styles.iosDatePicker : undefined}>
                  <DateTimePicker
                    themeVariant="dark"
                    value={transaction.date as Date}
                    textColor={colors.white}
                    mode="date"
                    display={Platform.OS == 'ios' ? "spinner" : "default"}
                    onChange={onDateChange}
                  />
                  {
                    Platform.OS == 'ios' && (
                      <TouchableOpacity
                        style={styles.datePickerButton}
                        onPress={() => setshowDatePicker(false)}
                      >
                        <Typo size={15} fontweight={"500"}>
                          ok
                        </Typo>
                      </TouchableOpacity>
                    )
                  }
                </View>
              )}
          </View>

          {/* amount */}

          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200} size={16}>Amount</Typo>
            <Input
              //placeholder="Salary"
              keyboardType="numeric"
              value={transaction.amount?.toString()}

              onChangeText={(value) =>
                setTransaction({
                  ...transaction,
                  amount: Number(value.replace(/[^0-9]/g, "")),
                })}
              styleinput={undefined}
              stylecontainer={undefined} />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.flexRow}>
              <Typo color={colors.neutral200} size={16}>
                Description
              </Typo>
              <Typo color={colors.neutral500} size={14}>
                (optional)
              </Typo>
            </View>

            <Input
              value={transaction.description}
              multiline
              containerStyle={{
                flexDirection: "row",
                alignItems: "flex-start",
              }}
              inputStyle={{
                height: 100,
                textAlignVertical: "top", // ensures text starts at the top
                paddingVertical: 10,
              }}
              onChangeText={(value) =>
                setTransaction({
                  ...transaction,
                  description: value,
                })
              }
              styleinput={undefined}
              stylecontainer={undefined}
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.flexRow}>
              <Typo color={colors.neutral200} size={16}>
                Receipt
              </Typo>
              <Typo color={colors.neutral500} size={14}>
                (optional)
              </Typo>
            </View>
            <ImageUpload
              file={transaction.image}
              onClear={() => setTransaction({ ...transaction, image: null })}
              onSelect={(file) => setTransaction({ ...transaction, image: file })}
              placeholder="Upload image"
            />
          </View>
        </ScrollView>
      </View>

      <View style={styles.Footer}>
        {oldTransaction?.id && !loading && (
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
          <Typo color={colors.black} fontweight={"700"}>
            {oldTransaction?.id ? "Update" : "Submit"}
          </Typo>
        </Button>
      </View>
    </ModalWrapper>
  );
};

export default TransactionModal;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    paddingHorizontal: spacingY._17,
    //marginBottom: spacingY._10
  },

  form: {
    paddingVertical: spacingY._10,

  },
  dropdownContainer: {
    height: verticalScale(54),
    borderWidth: 1,
    borderColor: colors.neutral300,
    paddingHorizontal: spacingX._15,
    borderRadius: radius._15,
    borderCurve: "continuous",

  },
  dropdownPlaceholder: {
    color: colors.white,
  },
  dropdownSelectedText: {
    color: colors.white,
    fontSize: verticalScale(14),

  },
  dropdownListContainer: {
    backgroundColor: colors.neutral900,
    borderRadius: radius._15,
    borderCurve: "continuous",
    paddingVertical: spacingY._7,
    top: 5,
    borderColor: colors.neutral500,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 5,

  },
  dropdowmIcon: {
    height: verticalScale(30),
    tintColor: colors.neutral300,

  },
  dropdownItemText: {
    color: colors.white,

  },
  dropdownItemContainer: {
    borderRadius: radius._15,
    marginHorizontal: spacingX._7,

  },
  Footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: spacingX._20,
    gap: scale(12),
    paddingTop: spacingY._15,
    borderTopColor: colors.neutral700,
    marginBottom: spacingY._5,
    borderTopWidth: 1,
  },

  inputContainer: {
    marginBottom: spacingY._17
  },

  iosDatePicker: {
    backgroundColor: colors.neutral800,
    padding: spacingY._10,
    borderRadius: radius._15,
    marginTop: spacingY._7,
  },
  dateInput: {
    height: verticalScale(54),
    borderWidth: 1,
    borderColor: colors.neutral300,
    paddingHorizontal: spacingX._15,
    borderRadius: radius._15,
    justifyContent: "center",
  },
  datePickerButton: {
    backgroundColor: colors.neutral700,
    alignSelf: "flex-end",
    padding: spacingY._7,
    marginRight: spacingX._7,
    paddingHorizontal: spacingX._15,
    borderRadius: radius._10
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._5,
  },
});
