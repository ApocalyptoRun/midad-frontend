import { View, Text, SafeAreaView } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { BASE_URL, createConfig } from "../constants/config";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import User from "../components/User";

const FriendsScreen = () => {
  const { userToken } = useContext(AuthContext);
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    const config = createConfig(userToken);

    const fecthFriendRequests = async () => {
        try {
           const response = await axios.get(`${BASE_URL}/user/friendRequests`, config);
           if(response.status === 200) {
                const friendRequestsData = response.data.map((friendRequest) => ({
                    _id : friendRequest._id,
                    firstName: friendRequest.firstName,
                    imageUrl: friendRequest.imageUrl 
                }))

                setFriendRequests(friendRequestsData);
           }
            
        } catch (error) {
            console.log(`Error retrieving friend requests ${error}`)
        }
        
    };

    fecthFriendRequests();
  }, []);

  console.log(friendRequests)
  return (
    <SafeAreaView>
     
    </SafeAreaView>
  );
};

export default FriendsScreen;
