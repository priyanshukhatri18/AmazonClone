import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated from "react-native-reanimated";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import { colors, radius, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import Typo from "@/components/Typo";
import { useAuth } from "@/contexts/authContext";
import { Image } from 'expo-image';
import { getProfileImage } from "@/services/imageservices";
import { accountOptionType } from "@/types";
import * as Icons from "phosphor-react-native";
import { FadeInDown } from "react-native-reanimated";
import { signOut } from "firebase/auth";
import { auth } from "@/config/firebase";
import { useRoute } from "@react-navigation/native";
import { router } from "expo-router";

const Profile = () => {
  const { user } = useAuth();
  const route = useRoute();

  const accountOptions: accountOptionType[] = [
    {
      title: "Edit profile",
      icon: <Icons.User size={20} color={colors.white} weight="fill" />,
      routeName: '/(modals)/profileModal',
      
      bgcolor: '#6366f1',
    },
    {
      title: "Settings",
      icon: <Icons.GearSix size={20} color={colors.white} weight="fill" />,
      //routeName: '/(model)/profileModel',
      bgcolor: '#059669',
    },
    {
      title: "Privacy Policy",
      icon: <Icons.Shield size={20} color={colors.white} weight="fill" />, // Changed to Shield icon for better visual meaning
      routeName: '/(modals)/privacyPolicyModal', // This will trigger the modal
      bgcolor: colors.neutral600,
    },
    {
      title: "Logout",
      icon: <Icons.Power size={20} color={colors.white} weight="fill" />,
      //routeName: '/(model)/profileModel',
      bgcolor: '#e11d40',
    }
  ];

  const handleLogOut = async () => {
      await signOut(auth);
    };

  const showLogoutAlert = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text : "Cancel",
        onPress : () => console.log("cancel"),
        style : 'cancel'
      },
      {
        text: "Logout",
        onPress: () => handleLogOut(),
        style : 'destructive'
      }
    ]) 
  }

  const handlePress =   (item : accountOptionType) => {
    if (item.title== "Logout") {
      showLogoutAlert();
    }

    if (item.routeName) router.push(item.routeName as any);
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header title="Profile" style={{ marginVertical: spacingY._10 }} />

        {/* user info */}
        <View style={styles.userInfo}>
          {/* avatar */}
          <View>
            {/* {user image} */}
            <Image
              source={getProfileImage(user?.image)}
              style={styles.avatar}
              contentFit="cover"
              transition={100}
            />
          </View>
          {/* user name & email */}
          <View style={styles.namecontainer}>
            <Typo size={24} fontweight={"600"} color={colors.neutral100}>
              {user?.name}
            </Typo>
            <Typo size={15} color={colors.neutral400}>
              {user?.email}
            </Typo>
          </View>
        </View>

        {/* account options */}
        <View style={styles.accountOption}>
          {
            accountOptions.map((item, index) => {
              return (
                <Animated.View 
                key ={index.toString()}
                entering={FadeInDown.delay(index*50).springify().damping(14)}  
                style={styles.listItem}>
                  <TouchableOpacity style={styles.flexRow} onPress ={() => {
                    handlePress(item)
                  }}>
                    {/* icon */}
                    <View style={[styles.listIcon,
                    { backgroundColor: item?.bgcolor }]}>

                      {item.icon && item.icon}
                    </View>
                    <Typo size={16}
                      style={{ flex: 1 }}
                      fontweight="600"
                      color={colors.neutral100}>
                      {item.title}
                    </Typo>
                    <Icons.CaretRight
                      size={verticalScale(20)}
                      color={colors.white}
                      weight="bold"
                    />
                  </TouchableOpacity>
                </Animated.View>
              )
            })
          }

        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Profile;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingY._15
  },

  userInfo: {
    marginTop: verticalScale(20),
    alignItems: "center",
    gap: spacingY._15,
  },

  avtarcontainer: {
    position: "relative",
    alignSelf: "center",
  },

  namecontainer: {
    alignItems: "center",
    gap: verticalScale(2),
  },

  avatar: {
    alignSelf: "center",
    backgroundColor: colors.neutral300,
    width: verticalScale(200),
    height: verticalScale(200),
    borderRadius: 200,
    //overflow: "hidden",
    //position: "relative",
  },

  listIcon: {
    height: verticalScale(44),
    width: verticalScale(44),
    backgroundColor: colors.neutral500,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius._15,
    borderCurve: "continuous",
  },

  accountOption: {
    marginTop: spacingY._35,
  },

  listItem: {
    marginBottom: verticalScale(17),
  },

  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingY._10,
  },

}) 