import { Text, View } from "react-native";
import React, { useEffect, useContext, useLayoutEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SIZES, FONTS } from "../constants/themes";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { BASE_URL, createConfig } from "../constants/config";
import User from "../components/User";
import FriendsScreen from "./FriendsScreen";

const HomeScreen = () => {
  const { userToken } = useContext(AuthContext);
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);

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

    fecthUsers();
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
          />
          <MaterialIcons
            onPress={() => navigation.navigate(FriendsScreen)}
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
    </SafeAreaView>
  );
};

export default HomeScreen;
