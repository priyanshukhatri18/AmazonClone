import { createContext, useContext, useEffect, useState } from "react";
import { AuthContextType, Usertype } from "../types";
import {createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged} 
  from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, firestore } from "../config/firebase";
import { useRouter } from "expo-router";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children,
}) => {
  const [user, setUser] = useState<Usertype | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      console.log("Firebase User:", firebaseUser); // 🔍 Log the firebase user
      if (firebaseUser) {
        setUser({
          uid: firebaseUser?.uid,
          email: firebaseUser?.email,
          name: firebaseUser?.displayName,
        });
        updateUserData(firebaseUser.uid);
        router.replace("/(tabs)");
      } else {
        setUser(null);
        router.push("/(auth)/welcome");
      }
    });


    return () => unsub();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
      await updateUserData(result.user.uid);
      return { success: true };
    } catch (error: any) {
      let msg = error.message;
      console.log("error message:", msg); // 🔍 Log the error message
      if (msg.includes("(auth/invalid-credentials)")) msg = "Wrong credentials";
      if (msg.includes("(auth/invalid-email)")) msg = "Wrong credentials";

      return { success: false, msg };
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      console.log("Registering with email:", email); // 🔍 Log the input

      const response = await createUserWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
      await setDoc(doc(firestore, "users", response.user.uid), {
        name,
        email,
        uid: response?.user?.uid,
      });
      await updateUserData(response.user.uid);
      return { success: true };
    } catch (error: any) {
      let msg = error.message;
      console.log("error message:", msg); // 🔍 Log the error message
      
      return { success: false, msg };
    }
  };

  const updateUserData = async (uid: string) => {
    try {
      const docRef = doc(firestore, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const userData: Usertype = {
          name: data.name,
          email: data.email,
          uid: data.uid,
          image: data.image || null,
        };
        setUser(userData);
      }
    } catch (error: any) {
      console.error("Error updating user data:", error.message);
    }
  };

  const contextValue: AuthContextType = {
    user: user || { name: "", email: "", uid: "", image: null },
    setUser,
    login,
    register,
    updateUserData,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

