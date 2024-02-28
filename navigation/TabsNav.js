import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { COLORS } from "../constants/themes";
import { Image, StyleSheet, Text, View } from "react-native";
import images from "../constants/images";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

export const TabsNav = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 25,
          left: 20,
          right: 20,
          elevation: 0,
          backgroundColor: COLORS.white,
          borderRadius: 15,
          height: 90,
          ...styles.shadow,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                top: 10,
              }}
            >
              <Image
                resizeMode="contain"
                style={{
                  width: 25,
                  height: 25,
                  tintColor: focused ? COLORS.cornflowerBlue : COLORS.black2,
                }}
                source={images.home}
              />
              {focused && (
                <Text
                  style={{
                    color: focused ? COLORS.cornflowerBlue : COLORS.black2,
                  }}
                >
                  HOME
                </Text>
              )}
            </View>
          ),
          // headerShown: false
        }}
      />

      <Tab.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                top: 10,
              }}
            >
              <Image
                resizeMode="contain"
                style={{
                  width: 25,
                  height: 25,
                  tintColor: focused ? COLORS.cornflowerBlue : COLORS.black2,
                }}
                source={images.profile}
              />
              {focused && (
                <Text
                  style={{
                    color: focused ? COLORS.cornflowerBlue : COLORS.black2,
                  }}
                >
                  PROFILE
                </Text>
              )}
            </View>
          ),
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                top: 10,
              }}
            >
              <Image
                resizeMode="contain"
                style={{
                  width: 25,
                  height: 25,
                  tintColor: focused ? COLORS.cornflowerBlue : COLORS.black2,
                }}
                source={images.settings}
              />
              {focused && (
                <Text
                  style={{
                    color: focused ? COLORS.cornflowerBlue : COLORS.black2,
                  }}
                >
                  SETTINGS
                </Text>
              )}
            </View>
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#7F5DF0",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
});
