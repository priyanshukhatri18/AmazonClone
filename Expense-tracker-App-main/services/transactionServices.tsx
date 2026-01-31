import { firestore } from "@/config/firebase";
import { ResponseType, TransactionType, walletType } from "@/types";
import { collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, setDoc, Timestamp, updateDoc, where } from "firebase/firestore";
import { uploadFileToCloudinary } from "./imageservices";
import { createrOrupdateWallet } from "./walletServices";
import { scale } from "@/utils/styling";
import { colors } from "@/constants/theme";
import { getLast7Days, getLast12Months, getYearsRange } from "@/utils/common";

export const createrOrupdateTransaction = async (
    transactionData: Partial<TransactionType>
): Promise<ResponseType> => {
    try {
        const { id, type, walletId, amount, image } = transactionData;

        if (!amount || amount <= 0 || !walletId || !type) {
            return { success: false, msg: "Invalid transaction data" };
        }

        if (id) {
            const oldTransactionSnapshot = await getDoc(doc(firestore, "transaction", id));
            const oldTransaction = oldTransactionSnapshot.data() as TransactionType;

            const amountChanged = oldTransaction.amount !== amount;
            const typeChanged = oldTransaction.type !== type;
            const walletChanged = oldTransaction.walletId !== walletId;

            if (typeChanged || walletChanged) {
                const res = await revertAndUpdateWallets(
                    oldTransaction,
                    Number(amount),
                    type,
                    walletId
                );
                if (!res.success) return res;
            } else if (amountChanged) {
                // Handle wallet update for same type & wallet
                const walletRef = doc(firestore, "wallets", walletId!);
                const walletSnapshot = await getDoc(walletRef);
                const walletData = walletSnapshot.data() as walletType;

                const difference = Number(amount) - Number(oldTransaction.amount);
                const isExpense = type === "expense";

                if (isExpense && walletData.amount! - difference < 0) {
                    return { success: false, msg: "Wallet doesn't have enough balance" };
                }

                const updateField = isExpense ? "totalExpense" : "totalIncome";
                const newWalletAmount = Number(walletData.amount) + (isExpense ? -difference : difference);
                const newTotal = Number(walletData[updateField]) + difference;

                await updateDoc(walletRef, {
                    amount: newWalletAmount,
                    [updateField]: newTotal,
                });
            }
        } else {
            const res = await updateWalletForNewTransaction(walletId!, Number(amount!), type);
            if (!res.success) return res;
        }

        if (image) {
            const imageUploadRes = await uploadFileToCloudinary(image, "transactions");
            if (!imageUploadRes.success) {
                return { success: false, msg: imageUploadRes.msg || "Failed to upload the receipt" };
            }
            transactionData.image = imageUploadRes.data;
        }

        const transactionRef = id
            ? doc(firestore, "transaction", id)
            : doc(collection(firestore, "transaction"));

        await setDoc(transactionRef, transactionData, { merge: true });

        return {
            success: true,
            data: { ...transactionData, id: transactionRef.id }
        };
    } catch (err: any) {
        console.log("Error creating or updating transaction: ", err);
        return { success: false, msg: err.message };
    }
};

const updateWalletForNewTransaction = async (
    walletId: string,
    amount: number,
    type: string
) => {
    try {
        const walletRef = doc(firestore, "wallets", walletId);
        const walletSnapshot = await getDoc(walletRef);

        if (!walletSnapshot.exists()) {
            return { success: false, msg: "Wallet not found" };
        }

        const walletData = walletSnapshot.data() as walletType;

        // Ensure sufficient balance if it's an expense
        if (type === "expense" && walletData.amount! - amount < 0) {
            return { success: false, msg: "Wallet doesn't have enough balance" };
        }

        // Update wallet balance and totals (income or expense)
        const updateType = type == "income" ? "totalIncome" : "totalExpense";
        const updatedWalletAmount = type == "income" ? Number(walletData.amount) + amount : Number(walletData.amount) - amount;
        const updatedTotal = type == "income" ? Number(walletData.totalIncome) + amount : Number(walletData.totalExpense) + amount;

        await updateDoc(walletRef, { amount: updatedWalletAmount, [updateType]: updatedTotal });
        return { success: true };
    } catch (err: any) {
        console.log("Error updating wallet:", err);
        return { success: false, msg: err.message };
    }
};

const revertAndUpdateWallets = async (
    oldTransaction: TransactionType,
    newTransactionAmount: number,
    newTransactionType: string,
    newWalletId: string
) => {
    try {
        // Fetch original and new wallets
        const originalWalletSnapshot = await getDoc(doc(firestore, "wallets", oldTransaction.walletId));
        const originalWallet = originalWalletSnapshot.data() as walletType;

        let newWalletSnapshot = await getDoc(doc(firestore, "wallets", newWalletId));
        let newWallet = newWalletSnapshot.data() as walletType;

        const revertType = oldTransaction.type == 'income' ? "totalIncome" : "totalExpense";
        const revertedIncomeExpense: number = oldTransaction.type == "income"
            ? -Number(oldTransaction.amount)
            : Number(oldTransaction.amount);
        const revertWalletAmount = Number(originalWallet.amount) + revertedIncomeExpense;

        const revertedIncomeExpenseAmount = Number(originalWallet[revertType]) - Number(oldTransaction.amount);

        if (newTransactionType === 'expense') {

            if (
                oldTransaction.walletId == newWalletId &&
                revertWalletAmount! < newTransactionAmount
            ) {
                return {
                    success: false,
                    msg: "The selected wallet doesn't have enough balance"
                };

            };
            if (newWallet.amount! < newTransactionAmount) {
                return {
                    success: false,
                    msg: "The selected wallet doesn't have enough balance"

                };
            }
        }
        // Revert original wallet
        await createrOrupdateWallet({
            id: oldTransaction.walletId,
            amount: revertWalletAmount,
            [revertType]: revertedIncomeExpenseAmount,
        });

        // Update the new wallet with the new transaction
        const updateType = newTransactionType === "income" ? "totalIncome" : "totalExpense";
        const updatedTransactionAmount = newTransactionType == "income" ? Number(newTransactionAmount) : -Number(newTransactionAmount);
        const newWalletAmount = Number(newWallet.amount) + updatedTransactionAmount;
        const newIncomeExpenseAmount = Number(newWallet[updateType]! + Number(newTransactionAmount));

        await createrOrupdateWallet({
            id: newWalletId,
            amount: newWalletAmount,
            [updateType]: newIncomeExpenseAmount
        });

        return { success: true };
    } catch (err: any) {
        console.log("Error updating wallet:", err);
        return { success: false, msg: err.message };
    }
};

export const deleteTransaction = async (TransactionId: string, walletId: string) => {
    try {
        const transactionRef = doc(firestore, "transaction", TransactionId);
        const transactionSnapshot = await getDoc(transactionRef);

        if (!transactionSnapshot.exists()) {
            return { success: false, msg: "Transaction not found" };
        }

        const transactionData = transactionSnapshot.data() as TransactionType;
        const transactionType = transactionData?.type;
        const transactionAmount = transactionData?.amount;

        // fetch wallet to update amount, total income, total expense

        let walletSnapshot = await getDoc(doc(firestore, "wallets", walletId));
        const walletData = walletSnapshot.data() as walletType;

        // check fields to be updated based on transaction type

        const updateType = transactionType == "income" ? "totalIncome" : "totalExpense";
        const newWalletAmount = walletData?.amount! - (transactionType == "income" ? transactionAmount : -transactionAmount);
        const newIncomeExpenseAmount = walletData[updateType]! - transactionAmount;

        if (transactionType === "income" && newWalletAmount < 0) {
            return { success: false, msg: "You cannot delete this transaction" };
        }

        // Update wallet and delete the transaction
        await createrOrupdateWallet({
            id: walletId,
            amount: newWalletAmount,
            [updateType]: newIncomeExpenseAmount
        });

        await deleteDoc(transactionRef);

        return { success: true };
    } catch (err: any) {
        console.log("Error deleting transaction:", err);
        return { success: false, msg: err.message };
    }
};

export const fetchWeeklyStats = async (
    uid: string
): Promise<ResponseType> => {
    try {
        const db = firestore;
        const today = new Date();
        const sevenDayAgo = new Date(today);
        sevenDayAgo.setDate(today.getDate() - 7);

        const TransactionQuery = query(
            collection(db, 'transaction'),
            where("date", ">=", Timestamp.fromDate(sevenDayAgo)),
            where("date", "<=", Timestamp.fromDate(today)),
            orderBy("date", "desc"),
            where("uid", "==", uid)
        );

        const querySnapshot = await getDocs(TransactionQuery);
        const weeklyData = getLast7Days();
        const transactions: TransactionType[] = [];

        querySnapshot.forEach((doc) => {
            const transactionData = doc.data() as TransactionType;
            transactionData.id = doc.id;
            transactions.push(transactionData);

            const transactionDate = (transactionData.date as Timestamp)
                .toDate()
                .toISOString()
                .split("T")[0];

            const dayData = weeklyData.find((day) => day.date == transactionDate);

            if (dayData) {
                if (transactionData.type == "income") {
                    dayData.income += transactionData.amount;
                } else if (transactionData.type == "expense") {
                    dayData.expense += transactionData.amount;
                }
            }
        });

        const stats = weeklyData.flatMap((day) => {
            const date = new Date(day.date);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            
            return [
                {
                    value: day.income,
                    label: dayName,
                    spacing: scale(4),
                    labelWidth: scale(30),
                    frontColor: colors.primary,
                },
                {
                    value: day.expense,
                    frontColor: colors.rose,
                }
            ];
        });

        return {
            success: true,
            data: {
                stats,
                transactions,
            }
        };
    } catch (err: any) {
        console.log("Error fetching weekly stats:", err);
        return { success: false, msg: err.message };
    }
};

function getLast7days() {
    const today = new Date();
    const days = [];

    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        days.push({ date: date.toISOString().split("T")[0], income: 0, expense: 0 });
    }

    return days;
}

export const fetchMonthlyStats = async (
    uid: string
): Promise<ResponseType> => {
    try {
        const db = firestore;
        const today = new Date();
        const twelveMonthAgo = new Date(today);
        twelveMonthAgo.setMonth(today.getMonth() - 12);

        const TransactionQuery = query(
            collection(db, 'transaction'),
            where("uid", "==", uid),
            where("date", ">=", Timestamp.fromDate(twelveMonthAgo)),
            where("date", "<=", Timestamp.fromDate(today)),
            orderBy("date", "desc")
        );

        const querySnapshot = await getDocs(TransactionQuery);
        const monthlyData = getLast12Months();
        const transactions: TransactionType[] = [];

        querySnapshot.forEach((doc) => {
            const singleTransaction = doc.data() as TransactionType;
            singleTransaction.id = doc.id;
            transactions.push(singleTransaction);

            const transactionDate = (singleTransaction.date as Timestamp).toDate();
            const monthName = transactionDate.toLocaleString("default", {
                month: "short",
            });
            const shortYear = transactionDate.getFullYear().toString().slice(-2);
            const monthData = monthlyData.find(
                (month) => month.month === `${monthName} ${shortYear}`
            );

            if (monthData) {
                if (singleTransaction.type == "income") {
                    monthData.income += singleTransaction.amount;
                } else if (singleTransaction.type == "expense") {
                    monthData.expense += singleTransaction.amount;
                }
            }
        });

        const stats = monthlyData.flatMap((month) => [
            {
                value: month.income,
                label: month.month,
                spacing: scale(4),
                labelWidth: scale(46),
                frontColor: colors.primary,
            },
            {
                value: month.expense,
                frontColor: colors.rose,
            }
        ]);

        return {
            success: true,
            data: {
                stats,
                transactions,
            }
        };
    } catch (error) {
        console.log("Error fetching monthly transaction:", error);
        return {
            success: false,
            msg: "Failed to fetch monthly transactions"
        };
    }
};


export const fetchYearlyStats = async (
    uid: string
): Promise<ResponseType> => {
    try {
        const db = firestore;

        const TransactionQuery = query(
            collection(db, 'transaction'),
            orderBy("date", "desc"),
            where("uid", "==", uid)
        );

        const querySnapshot = await getDocs(TransactionQuery);
        const transactions: TransactionType[] = [];

        const firstTransaction = querySnapshot.docs.reduce((earliest, doc) => {
            const transactionDate = doc.data().date.toDate();
            return transactionDate < earliest ? transactionDate : earliest;
        }, new Date());

        const firstYear = firstTransaction.getFullYear();
        const currentYear = new Date().getFullYear();
        const yearlyData = getYearsRange(firstYear, currentYear);

        querySnapshot.forEach((doc) => {
            const transaction = doc.data() as TransactionType;
            transaction.id = doc.id;
            transactions.push(transaction);

            const transactionYear = (transaction.date as Timestamp).toDate().getFullYear();
            const yearData = yearlyData.find(
                (item: { year: string; }) => item.year === transactionYear.toString()
            );

            if (yearData) {
                if (transaction.type == "income") {
                    yearData.income += transaction.amount;
                } else if (transaction.type == "expense") {
                    yearData.expense += transaction.amount;
                }
            }
        });

        const stats = yearlyData.flatMap((year: { income: any; year: any; expense: any; }) => [
            {
                value: year.income,
                label: year.year,
                spacing: scale(4),
                labelWidth: scale(35),
                frontColor: colors.primary,
            },
            {
                value: year.expense,
                frontColor: colors.rose,
            }
        ]);

        return {
            success: true,
            data: {
                stats,
                transactions,
            }
        };
    } catch (error) {
        console.log("Error fetching yearly transaction:", error);
        return {
            success: false,
            msg: "Failed to fetch yearly transactions"
        };
    }
};