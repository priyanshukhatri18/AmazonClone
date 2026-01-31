import { ResponseType, walletType } from "@/types";
import { uploadFileToCloudinary } from "./imageservices";
import { firestore } from "@/config/firebase";
import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    query,
    setDoc,
    where,
    writeBatch
} from "firebase/firestore";

export const createrOrupdateWallet = async (
    walletData: Partial<walletType>
): Promise<ResponseType> => {
    try {
        let walletToSave = { ...walletData };

        // Upload image if provided
        if (walletData.image) {
            const imageUploadRes = await uploadFileToCloudinary(walletData.image, "users");
            if (!imageUploadRes.success) {
                return {
                    success: false,
                    msg: imageUploadRes.msg || "Could not upload image",
                };
            }
            walletToSave.image = imageUploadRes.data;
        }

        // Set default fields for new wallet
        if (!walletData.id) {
            walletToSave.amount = 0;
            walletToSave.totalIncome = 0;
            walletToSave.totalExpense = 0;
            walletToSave.created = new Date();
        }

        const walletRef = walletData.id
            ? doc(firestore, "wallets", walletData.id)
            : doc(collection(firestore, "wallets"));

        await setDoc(walletRef, walletToSave, { merge: true });

        return {
            success: true,
            data: { ...walletToSave, id: walletRef.id },
        };
    } catch (error: any) {
        console.log("Error creating or updating wallet: ", error);
        return { success: false, msg: error?.message };
    }
};

export const deletewallet = async (walletId: string): Promise<ResponseType> => {
    try {
        const walletRef = doc(firestore, "wallets", walletId);
        await deleteDoc(walletRef);

        const deleteRes = await deleteTransactionByWalletId(walletId);
        if (!deleteRes.success) return deleteRes;

        return { success: true, msg: "Wallet and its transactions deleted successfully" };
    } catch (err: any) {
        console.log("Error deleting wallet: ", err);
        return { success: false, msg: err.message };
    }
};

export const deleteTransactionByWalletId = async (walletId: string): Promise<ResponseType> => {
    try {
        let hasMoreTransaction = true;

        while (hasMoreTransaction) {
            const transactionQuery = query(
                collection(firestore, "transaction"),
                where("walletId", "==", walletId)
            );

            const transactionSnapshot = await getDocs(transactionQuery);

            if (transactionSnapshot.empty) {
                hasMoreTransaction = false;
                break;
            }

            const batch = writeBatch(firestore);
            transactionSnapshot.forEach((transactionDoc) => {
                batch.delete(transactionDoc.ref);
            });

            await batch.commit();

            console.log(`${transactionSnapshot.size} transactions deleted in this batch`);
        }

        return {
            success: true,
            msg: "All transactions deleted successfully",
        };
    } catch (err: any) {
        console.log("Error deleting transactions by wallet ID: ", err);
        return { success: false, msg: err.message };
    }
};
