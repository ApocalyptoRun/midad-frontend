import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import UserDetails from "../screens/UserDetails";
import { AuthContext } from "../context/AuthContext";
import { TabsNav } from "./TabsNav";
import HomeScreen from "../screens/HomeScreen";
import FriendsScreen from "../screens/FriendsScreen";

const Stack = createStackNavigator();

export const AppStack = () => {
  const { isFirstAuth } = useContext(AuthContext);

  return (
    <Stack.Navigator>
      {/* {isFirstAuth && (
           <Stack.Screen name='UserDetails' component={UserDetails} options={{headerShown: false}}/>
         )} */}

      {/* <Stack.Screen name='TabsNav'  component={TabsNav} options={{headerShown: false}}/> */}
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="FriendsScreen" component={FriendsScreen}/>
    </Stack.Navigator>
  );
};
