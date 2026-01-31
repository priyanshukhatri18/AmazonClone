import { firestore } from "@/config/firebase";
import { ResponseType, userDataType } from "@/types";
import { doc, updateDoc } from "firebase/firestore";
import { uploadFileToCloudinary } from "./imageservices";

export const updateUser = async (
    uid : string,
    updatedData : userDataType 
): Promise<ResponseType> => {
   try {
    if (updatedData.image && updatedData?.image?.uri) {
        const imageUploadRes = await uploadFileToCloudinary(
            updatedData.image,
            "users"
        );
        if (!imageUploadRes.success) {
            return { 
                success: false, 
                msg: imageUploadRes.msg || "Could not upload image" 
            };
        }

        updatedData.image = imageUploadRes.data;
    }
        
    const userRef = doc(firestore, "users" , uid);
    await updateDoc(userRef, updatedData);


    return { success : true, msg : "User data updated successfully" };
   } 
    catch (error : any ) {
    console.log("Error updating user data: ", error);
   return {success : false , msg : error?.message};
   }
};
