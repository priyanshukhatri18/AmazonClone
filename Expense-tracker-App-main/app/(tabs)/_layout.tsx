import { StyleSheet, Text, View } from "react-native";
import { Tabs } from "expo-router";
import React from "react";
import CustomTabs from "@/components/CustomTabs";

const _layout = () => {
  return  <Tabs tabBar={CustomTabs} screenOptions={{headerShown: false}}>
        <Tabs.Screen name="index" options={{title: "Home"}}/>
        <Tabs.Screen name="statistics" options={{title: "statistics"}}/>
        <Tabs.Screen name="wallet" options={{title: "wallet"}}/>
        <Tabs.Screen name="profile" options={{title: "profile"}}/>
  </Tabs>      
};

export default _layout;
const styles = StyleSheet.create({});
