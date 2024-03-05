import { Alert, Pressable, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useContext, useLayoutEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SIZES, FONTS } from "../constants/themes";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { BASE_URL, createConfig } from "../constants/config";
import User from "../components/User";
import * as Contacts from "expo-contacts";

const HomeScreen = () => {
  const { userToken, logout } = useContext(AuthContext);
  const navigation = useNavigation();
  const [matchedContacts, setMatchedContacts] = useState([]);
  const [phoneContacts, setPhoneContacts] = useState([]);

  useEffect(() => {
    const fecthContacts = async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });

        if (data.length > 0) {
          const contactsWithNumbers = data.filter(
            (contact) => contact.phoneNumbers && contact.phoneNumbers.length > 0
          );

          setPhoneContacts(contactsWithNumbers);
        } else {
          console.log("No Contacts Found");
        }
      } else {
        console.log("Permission to access contacts denied.");
      }
    };

    fecthContacts();
  }, []);

  useEffect(() => {
    const fetchMatchesFromBackend = async () => {
      const postData = {
        phoneContacts: phoneContacts.map(
          (contact) => contact.phoneNumbers[0].number
        ),
      };
      const config = createConfig(userToken);
      try {
        const response = await axios.post(
          `${BASE_URL}/user/compareContacts`,
          postData,
          config
        );
        if (response.status === 200) {
          setMatchedContacts(response.data);
        }
      } catch (error) {
        console.error(`Error comparing contacts with backend: ${error}`);
      }
    };

    fetchMatchesFromBackend();
  }, [phoneContacts]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
            color: COLORS.cornflowerBlue,
          }}
        >
          MidadChat
        </Text>
      ),
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={24}
            color="black"
          />
          <MaterialIcons
            onPress={() => navigation.navigate("FriendsScreen")}
            name="people-outline"
            size={24}
            color="black"
          />
        </View>
      ),
    });
  }, []);

  return (
    <SafeAreaView style={{ paddingHorizontal: 10 }}>
      {matchedContacts.length > 0 && <Text>Contacts on Midad !</Text>}

      {matchedContacts.map((item, index) => (
        <User key={index} item={item} navigation={navigation}/>
      ))}

      <Pressable
        style={{ marginTop: 15, alignItems: "center" }}
        onPress={logout}
      >
        <Text>logout</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default HomeScreen;
