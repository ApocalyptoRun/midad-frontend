import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import UserDetails from "../screens/UserDetails";
import { AuthContext } from "../context/AuthContext";
import { TabsNav } from "./TabsNav";
import HomeScreen from "../screens/HomeScreen";
import ChatScreen from "../screens/ChatScreen";
import ChatMessagesScreen from "../screens/ChatMessagesScreen";

const Stack = createStackNavigator();

export const AppStack = () => {
  const { isFirstAuth, userToken } = useContext(AuthContext);

  return (
    <Stack.Navigator>
      {isFirstAuth && !userToken && (
           <Stack.Screen name='UserDetails' component={UserDetails} options={{headerShown: false}}/>
         )}

      {/* <Stack.Screen name='TabsNav'  component={TabsNav} options={{headerShown: false}}/> */}
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="ChatScreen" component={ChatScreen}/>
      <Stack.Screen name="ChatMessagesScreen" component={ChatMessagesScreen}/>

    </Stack.Navigator>
  );
};
