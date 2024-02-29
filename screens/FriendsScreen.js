import { View, Text, SafeAreaView } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { BASE_URL, createConfig } from "../constants/config";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import User from "../components/User";
import FriendRequest from "../components/FriendRequest";

const FriendsScreen = () => {
  const { userToken } = useContext(AuthContext);
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    const config = createConfig(userToken);

    const fecthFriendRequests = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/user/friendRequests`,
          config
        );
        if (response.status === 200) {
          setFriendRequests(response.data);
        }
      } catch (error) {
        console.log(`Error retrieving friend requests ${error}`);
      }
    };

    fecthFriendRequests();
  }, []);

  return (
    <SafeAreaView style={{ padding: 10, marginHorizontal: 12 }}>
      {friendRequests.length > 0 && <Text>Your Friend Requests !</Text>}

      {friendRequests.map((item, index) => (
        <FriendRequest
          key={index}
          item={item}
          friendRequests={friendRequests}
          setFriendRequests={setFriendRequests}
        />
      ))}
    </SafeAreaView>
  );
};

export default FriendsScreen;
