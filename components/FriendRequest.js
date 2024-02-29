import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { BASE_URL, createConfig } from "../constants/config";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import ChatsScreen from "../screens/ChatsScreen";

const FriendRequest = ({ item, friendRequests, setFriendRequests }) => {
  const { userToken } = useContext(AuthContext);
  const navigation = useNavigation();

  const acceptRequest = async (friendRequestId) => {
    const postData = {
      senderId: friendRequestId,
    };

    const config = createConfig(userToken);

    try {
      const response = await axios.post(
        `${BASE_URL}/user/friend-request/accept`,
        postData,
        config
      );

      if (response.ok) {
        setFriendRequests(
          friendRequests.filter((request) => request._id !== friendRequestId)
        );

        navigation.navigate('ChatsScreen');
      }
    } catch (error) {
      console.log(`Error accepting request ${error}`);
    }
  };

  return (
    <Pressable
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 10,
      }}
    >
      <Image
        style={{ width: 50, height: 50, borderRadius: 25 }}
        source={{ uri: item.imageUrl }}
      />

      <Text
        style={{ fontSize: 15, fontWeight: "bold", marginLeft: 10, flex: 1 }}
      >
        {item.firstName} sent you a friend request
      </Text>

      <Pressable
        onPress={() => acceptRequest(item._id)}
        style={{ backgroundColor: "#0066b2", padding: 10, borderRadius: 6 }}
      >
        <Text style={{ textAlign: "center", color: "white" }}>Accept</Text>
      </Pressable>
    </Pressable>
  );
};

export default FriendRequest;

const styles = StyleSheet.create({});
