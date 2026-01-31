import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB2hmiVc_dijcF9Yyc-m0PldxiHjqVWxFg",
  authDomain: "expense-tracker-d9241.firebaseapp.com",
  projectId: "expense-tracker-d9241",
  storageBucket: "expense-tracker-d9241.appspot.com",
  messagingSenderId: "382921381999",
  appId: "1:382921381999:web:ce0beb46be2c54b393d59a"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const firestore = getFirestore(app);
