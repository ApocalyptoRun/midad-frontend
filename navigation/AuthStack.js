import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import WelcomeScreen from '../screens/WelcomeScreen.js';
import PhoneNumber from '../screens/PhoneNumber.js';
import OTPVerification from '../screens/OTPVerification.js';

const Stack = createStackNavigator();

export const AuthStack = () => {
  return (
    <Stack.Navigator initialRouteName='Welcome'>
        <Stack.Screen name='Welcome' component={WelcomeScreen} options={{headerShown: false}}/>
        <Stack.Screen name='PhoneNumber' component={PhoneNumber} options={{headerShown: false}}/>
        <Stack.Screen name='OTPVerification' component={OTPVerification} options={{headerShown: false}}/>
    </Stack.Navigator>
  )
}

