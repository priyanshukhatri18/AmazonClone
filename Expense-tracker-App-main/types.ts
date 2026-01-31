import { Href } from "expo-router"
import { Firestore, Timestamp } from "firebase/firestore";
import { Icon } from "phosphor-react-native";
import React, { ReactNode } from "react";
import {
  ActivityIndicator,
  ActivityIndicatorProps,
  ImageStyle,
  PressableProps,
  TextInput,
  TextInputProps,
  TextProps,
  TextStyle,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";

export type ScreenwrapperProps = {
  style?: ViewStyle;
  children: React.ReactNode;
  
};

export type ModalWrapperProps = {
  style?: ViewStyle;
  children: React.ReactNode;
  bg?: string;
};

export type accountOptionType = {
  title: string;
  icon: React.ReactNode;
  bgcolor: string;
  routeame?: any;
  routeName?: string; // Added backgroundColor property

};

export type TypoProps = {
  size?: number;
  color?: string;
  fontweight?: TextStyle["fontWeight"];
  children: any | null;
  style?: TextStyle;
  textProps?: TextProps;
};

export type ButtonProps = {
  size?: number;
  color?: string;
  backgroundColor?: string;
  fontWeight?: TextStyle["fontWeight"];
  children: React.ReactNode;
  style?: ViewStyle | TextStyle;
  onPress?: () => void;
  disabled?: boolean;
  textProps?: TextProps;
};

export type IconComponent = React.ComponentType<{
  height?: number;
  width?: number;
  strokeWidth?: number;
  color?: string;
  fill?: string;
}>;

export type IconProps = {
  name: string;
  color?: string;
  size?: number;
  strokeWidth?: number;
  fill?: string;
};

export type HeaderProps = {
  title?: string;
  style?: ViewStyle;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

export type BackButtonProps = {
  style?: ViewStyle;
  iconsize?: number;
};

export type TransactionType = {
  id?: string;
  type: string;
  amount: number;
  category?: string;
  date: Date | Timestamp | string;
  description?: string;
  image?: any;
  uid?: string;
  walletId: string;
};

export type CategoryType = {
  label: string;
  value: string;
  icon: IconComponent;
  bgColor: string;
};

export type ExpenseCategoriesType = {
  [key: string]: CategoryType;
};

export type TransactionListType = {
  data: TransactionType[];
  title?: string;
  loading?: boolean;
  emptyListMessage?: string;
};

export type TransactionItemProps = {
  item: TransactionType;
  index: number;
  handleClick: Function;
};

export interface InputProps extends TextInputProps {
  styleinput: any;
  stylecontainer: any;
  icon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  inputRef?: React.RefObject<TextInput>;
}

export interface CustomButtonProps extends TouchableOpacityProps{
   style ?: ViewStyle;
   onpress?: () => void ;
   loading ?: boolean ;
   children : React.ReactNode;
}

export type ImageUploadProps = {
  file?: any ;
  onSelect: (file: any) => void;
  onClear: () => void;
  containerStyle ?: ViewStyle;
  imageStyle?: ViewStyle;
  placeholder ?: string; 
}

export type Usertype = {
  uid?: string;
  email?: string | null;
  name: string | null;
  image?: any;
};

export type userDataType = {
  name: string;
  image: any;
};

export type AuthContextType = {
  user: Usertype;
  setUser: Function;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; msg?: string }>;
  register: (
    email: string,
    password: string,
    name: string
  ) => Promise<{ success: boolean; msg?: string }>;
  updateUserData: (userId: string) => Promise<void>;
};

export type ResponseType= {
  success: boolean;
  data ?: any;
  msg ?: string;
};

export type walletType = {
  id?: string;
  name: string;
  amount?: number;
  totalIncome?: number;
  totalExpense?: number;
  image: any; // you might want to narrow this to string | null or ExpoImageSource
  uid?: string;
  created?: Date;
};