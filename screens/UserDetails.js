import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useState } from "react";
import { Avatar, TextInput } from "react-native-paper";
import axios from "axios";
import { COLORS, SIZES } from "../constants/themes";
import images from "../constants/images";
import * as ImagePicker from "expo-image-picker";
import Button from "../components/Button.js";
import { BASE_URL } from "../constants/config.js";
import { AuthContext } from "../context/AuthContext.js";

const UserDetails = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  // const [lastName, setLastName] = useState("dieng");
  // const [email, setEmail] = useState("dieng@gmail.com");
  const [image, setImage] = useState("");
  const { userToken, isFirstAuth, setIsFirstAuth } = useContext(AuthContext);

  const saveDetails = async () => {
    try {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("file", {
        uri: image,
        name: "image.jpg",
        type: "image/jpeg",
      });

      console.log(image);
      console.log(formData);

      const response = await fetch(`${BASE_URL}/user/update`, {
        method: "PUT",
        body: formData,
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      const contentType = response.headers.get("Content-Type");
      let responseData;

      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json();
        console.log(responseData);
      } else {
        responseData = await response.text();
        console.log(responseData);
      }

      if (response.ok) {
        setIsFirstAuth(!isFirstAuth);
      } else {
        console.log(`Error: ${responseData}`);
      }
    } catch (error) {
      console.log(`Error while updating user details ${error}`);
    }
  };

  const pickImage = async () => {
    //  const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
    //  setHasGalleryPermission( galleryStatus.status === 'granted');

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity onPress={pickImage}>
            <Avatar.Image
              size={96}
              source={image ? { uri: image } : images.cameraPlus}
            />
          </TouchableOpacity>
        </View>

        <TextInput
          label="Firstname"
          mode="outlined"
          onChangeText={(text) => setFirstName(text)}
          value={firstName}
        />

        {/* 
        <TextInput
          label="lastname"
          mode="outlined"
          onChangeText={(text) => setLastName(text)}
          value={lastName}
        /> */}

        {/* <TextInput
          label="email"
          mode="outlined"
          onChangeText={(text) => setEmail(text)}
          value={email}
        /> */}

        <Button title="Save" onPress={saveDetails} style={{ marginTop: 24 }} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: SIZES.height,
    width: SIZES.width,
    justifyContent: "center",
    paddingHorizontal: 12,
    backgroundColor: COLORS.white,
  },
  input: {},
});

export default UserDetails;
