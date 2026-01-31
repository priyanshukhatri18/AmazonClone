import { ScrollView, StyleSheet, Text, View, Image, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import ModalWrapper from "@/components/ModalWrapper";
import { colors, spacingY } from "@/constants/theme";
import Header from "../../components/Header";
import BackButton from "@/components/BackButton";
import { getProfileImage } from "@/services/imageservices";
import { scale, verticalScale } from "@/utils/styling";
import { Image as ExpoImage } from 'expo-image';
import * as Icons from "phosphor-react-native";
import Typo from "@/components/Typo";
import { Input } from "@/components/Input";
import { userDataType } from "@/types";
import Button from "@/components/Button";
import { useAuth } from "@/contexts/authContext";
import { updateUser } from "@/services/userService";
import { useRouter } from "expo-router";
import * as ImagePicker from 'expo-image-picker';


const ProfileModal = () => {
  const {user , updateUserData} = useAuth();
  const [userData , setUserData] = useState<userDataType>({
    name : "",
    image : null,
  });
  const router = useRouter();
  const [loading , setLoading] = useState(false);
  useEffect(() => {
    setUserData({
      name : user?.name|| "",
      image : user?.image || null,
    });
  }, [user]);

  const onPickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      //allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });
    if (!result.canceled) {
      setUserData({...userData , image: result.assets[0]});
    }
  }

  const onSubmit = async () => {
    let { name, image } = userData;
    if (!name.trim()) {
      Alert.alert("User","Please enter your name");
      return;
    }
    setLoading(true);
    const res = await updateUser(user?.uid as string,userData);
    if (res.success) {
      updateUserData(user?.uid as string);
      router.back();
    } else {
      Alert.alert("User", res.msg);
    }
  }
  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title="Update Profile"
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />
        {/* Profile form goes here */}
        <ScrollView
          contentContainerStyle={styles.form} >
          <View style={styles.avatarContainer}>
            <ExpoImage
              style={styles.avatar}
              source={getProfileImage(userData.image)}
              contentFit="cover"
              transition={100}
            />
            <TouchableOpacity onPress={onPickImage} style={styles.editIcon}>
              <Icons.Pencil
                size={verticalScale(20)}
                color={colors.neutral800}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}> Full Name</Typo>
            <Input
              placeholder="Enter your Name"
              value={userData.name}
              onChangeText={(value) => setUserData({ ...userData, name: value })}
              placeholderTextColor={colors.neutral500} styleinput={undefined} stylecontainer={undefined}            
              />
          </View>
        </ScrollView>
      </View>
      <View style= {styles.Footer}>
        <Button onPress={onSubmit} loading={loading} style = {{ flex: 1 }}>
          <Typo fontweight={"600"} color={colors.black} size={16}>
            Update
          </Typo>
        </Button>
      </View>
    </ModalWrapper>
  );
}



export default ProfileModal;
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
  avatarContainer: {
    position: "relative",
    alignSelf: "center",
  },
  avatar: {
    alignSelf: "center",
    backgroundColor: colors.neutral300,
    height: verticalScale(135),
    width: verticalScale(135),
    borderRadius: 200,
    borderWidth: 1,
    borderColor: colors.neutral500,
  },
  editIcon: {
    position: "absolute",
    bottom: spacingY._5,
    right: spacingY._7,
    borderRadius: 100,
    backgroundColor: colors.neutral300,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    padding: spacingY._7,
  },
  inputContainer: {
    gap: spacingY._10,
  },
  Footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacingY._20,
    gap : scale(12),
    paddingTop : spacingY._15,
    borderTopColor: colors.neutral700,
    marginBottom : spacingY._5,
    borderTopWidth: 1,
  },
  contentContainer: {
    paddingBottom: spacingY._30,
  },
  section: {
    marginBottom: spacingY._20,
  },
  sectionTitle: {
    marginBottom: spacingY._10,
  },
  paragraph: {
    lineHeight: verticalScale(24),
  },

});
