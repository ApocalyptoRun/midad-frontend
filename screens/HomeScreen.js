import { Pressable, Text, View } from "react-native";
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
  const [users, setUsers] = useState([]);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const config = createConfig(userToken);

    const fecthUsers = async () => {
      axios
        .get(`${BASE_URL}/user/users`, config)
        .then((response) => {
          setUsers(response.data);
        })
        .catch((error) => {
          console.log(`Error retrieving users ${error}`);
        });
    };

    const fecthContacts = async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if( status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers]
        });

        if(data.length > 0 ) {
          setContacts(data);
          console.log(data);
        } else {
          console.log("No Contacts Found");
        }
      } else {
        console.log("Permission to access contacts denied.")
      }
    }


    //fecthUsers();
    fecthContacts()
  }, []);

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
            onPress={() => navigation.navigate("ChatsScreen")}
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
    <SafeAreaView style={{ padding: 10 }}>
      {users.map((item, index) => (
        <View>
          <User key={index} item={item} />
        </View>
      ))}

      {contacts.length > 0 && <Text>Invite to Midad</Text>}

      {contacts.map((contact)=> (
        <View>
          <Text>{contact.name}</Text>
        </View>
      ))}

      <Pressable
        style={{marginTop:15}}
        onPress={logout}
      >
        <Text>logout</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default HomeScreen;
