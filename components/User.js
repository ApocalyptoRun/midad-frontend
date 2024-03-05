import { View, Text, Pressable, Image, TouchableOpacity } from "react-native";
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { BASE_URL, createConfig } from "../constants/config";
import axios from "axios";

const User = ({ item, navigation }) => {
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("ChatScreen", { currentChatId: item._id })
      }
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
    </TouchableOpacity>
  );
};

export default User;
