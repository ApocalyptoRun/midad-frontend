import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import UserDetails from "../screens/UserDetails";
import { AuthContext } from "../context/AuthContext";
import { TabsNav } from "./TabsNav";
import HomeScreen from "../screens/HomeScreen";
import FriendsScreen from "../screens/FriendsScreen";
import ChatsScreen from "../screens/ChatsScreen";

const Stack = createStackNavigator();

export const AppStack = () => {
  const { isFirstAuth, userToken } = useContext(AuthContext);

  return (
    <Stack.Navigator>
      {isFirstAuth && !userToken && (
           <Stack.Screen name='UserDetails' component={UserDetails} options={{headerShown: false}}/>
         )}

      {/* <Stack.Screen name='TabsNav'  component={TabsNav} options={{headerShown: false}}/> */}
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="FriendsScreen" component={FriendsScreen}/>
      <Stack.Screen name="ChatsScreen" component={ChatsScreen}/>
    </Stack.Navigator>
  );
};
