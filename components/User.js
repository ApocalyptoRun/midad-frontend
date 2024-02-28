import { View, Text, Pressable, Image } from "react-native";
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { BASE_URL, createConfig } from "../constants/config";
import axios from "axios";

const User = ({ item }) => {
  const { userToken } = useContext(AuthContext);
  const [requestSent, setRequestSent] = useState(false);

  const sendFriendRequest = async (selectedUserId) => {
    const postData = {
      selectedUserId: selectedUserId,
    };

    const config = createConfig(userToken);

    try {
      const response = await axios.post(
        `${BASE_URL}/user/friend-request`,
        postData,
        config
      );
      if (response.ok) {
        setRequestSent(true);
      }
    } catch (error) {
      console.log(`Error sending friend request ${error}`);
    }
  };

  return (
    <Pressable
      style={{ flexDirection: "row", alignItems: "center", marginVertical: 10 }}
    >
      <View>
        <Image
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            resizeMode: "cover",
          }}
          source={{ uri: item.imageUrl }}
        />
      </View>

      <View style={{ marginLeft: 12, flex: 1 }}>
        <Text style={{ fontWeight: "bold" }}>{item?.firstName}</Text>
        <Text style={{ marginTop: 4, color: "grey" }}>{item?.email}</Text>
      </View>

      <Pressable
        onPress={() => sendFriendRequest(item._id)}
        style={{
          backgroundColor: "#567189",
          padding: 10,
          borderRadius: 6,
          width: 105,
        }}
      >
        <Text style={{ textAlign: "center", color: "white", fontSize: 13 }}>
          Add Friend
        </Text>
      </Pressable>
    </Pressable>
  );
};

export default User;
