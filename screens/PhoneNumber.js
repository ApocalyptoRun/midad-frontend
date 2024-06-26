import React, { useState, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SIZES, FONTS } from "../constants/themes";
import { StatusBar } from "expo-status-bar";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import images from "../constants/images";
import Icon from "react-native-vector-icons/FontAwesome5";
import Button from "../components/Button";
import CountryPicker from "react-native-country-picker-modal";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { BASE_URL } from "../constants/config";

const PhoneNumber = ({ navigation }) => {
  const [selectedCountry, setSelectedCountry] = useState({cca2: "TN", callingCode: "216"});
  const [otp, setOTP] = useState("");
  const { phoneNumber, setPhoneNumber, setIsFirstAuth, setCallingCode } = useContext(AuthContext);

  const onSelectCountry = (country) => {
    setSelectedCountry(country);
  };

  const showAlert = () => {
    Alert.alert(
      "Alert Title",
      "Alert Message",
      [
        {
          text: "OK",
          onPress: () => console.log("OK Pressed"),
        },
      ],
      { cancelable: false }
    );
  };

  const sendPhoneNumber = () => {
    const postData = {
      phoneNumber: selectedCountry.callingCode + "" + phoneNumber,
    };

    console.log(postData);

    axios
      .post(`${BASE_URL}/auth/sendOTP`, postData)
      .then((response) => {
        console.log(response.data);
        setOTP(response.data.code);
        setIsFirstAuth(!response.data.existingUser ? true : false);
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          console.log(error.response.data);
        } else {
          console.log(error);
        }
      });

    navigation.navigate("OTPVerification", { data: phoneNumber });
  };

  return (
    <SafeAreaView style={styles.area}>
      <StatusBar hidden />
      <View style={styles.container}>
        <Image
          source={images.secureLogin}
          resizeMode="contain"
          style={styles.secureLogin}
        />
      </View>

      <View>
        <Text style={{ ...FONTS.h2, textAlign: "center" }}>
          Enter Your Phone Number
        </Text>
        <Text style={{ ...FONTS.h4, textAlign: "center" }}>
          We will send you a verification code
        </Text>

        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.selectedFlagTunisie}
            onPress={() => {}}
          >
            <View style={{ justifyContent: "center" }}>
              <Icon name="chevron-down" size={8} color="black" />
            </View>

            <View style={{ justifyContent: "center", marginLeft: 3 }}>
              <CountryPicker
                countryCode={selectedCountry.cca2}
                withFilter
                withCallingCode
                withCountryNameButton={false}
                withAlphaFilter
                withModal
                onSelect={onSelectCountry}
              />
            </View>

            <View style={{ justifyContent: "center" }}>
              <Text style={{ color: COLORS.black, fontSize: 13 }}>
                +{selectedCountry.callingCode}
              </Text>
            </View>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Enter your phone number"
            placeholderTextColor={COLORS.black}
            selectionColor={COLORS.black}
            keyboardType="numeric"
            onChangeText={(text) => {
              setPhoneNumber(text);
              setCallingCode(selectedCountry.callingCode);
            }}
            value={phoneNumber}
          />
        </View>

        <Button
          title="VERIFY"
          onPress={sendPhoneNumber}
          style={{ marginLeft: 16 }}
        />
      </View>
    </SafeAreaView>
  );
};

export default PhoneNumber;

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    backgroundColor: COLORS.white,
    padding: 16,
    alignItems: "center",
  },
  secureLogin: {
    width: SIZES.width * 0.8,
    height: SIZES.height * 0.3,
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: "row",
    borderColor: COLORS.gray6,
    borderBottomWidth: 0.8,
    height: 58,
    width: SIZES.width,
    alignItems: "center",
    marginVertical: 32,
  },
  downIcon: {
    width: 12,
    height: 12,
  },
  selectedFlagTunisie: {
    width: 90,
    height: 50,
    marginHorizontal: 5,
    flexDirection: "row",
  },
  flagTunisie: {
    width: 30,
    height: 30,
  },
  input: {
    flex: 1,
    marginVertical: 10,
    height: 40,
    fontSize: 14,
    color: COLORS.black,
  },
});
