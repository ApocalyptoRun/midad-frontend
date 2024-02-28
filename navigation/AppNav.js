import React, { useContext, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";

import { AppStack } from "./AppStack";
import { AuthStack } from "./AuthStack";
import { AuthContext } from "../context/AuthContext";
import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { COLORS } from "../constants/themes";
import UserDetails from "../screens/UserDetails";
import HomeScreen from "../screens/HomeScreen";

export const AppNav = () => {
  const { isLoading, userToken } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={"large"} color={COLORS.cornflowerBlue} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {userToken !== null ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};
