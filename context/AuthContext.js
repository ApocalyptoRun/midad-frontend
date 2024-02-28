import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { ACCESS_TOKEN_SECRET, BASE_URL } from "../constants/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import JWT from "expo-jwt";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstAuth, setIsFirstAuth] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("58071373");
  const [callingCode, setCallingCode] = useState("216");
  const [uid, setUid] = useState("");

  const login = async () => {
    setIsLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/auth/signin`, {
        phoneNumber: callingCode + "" + phoneNumber,
      });
      console.log(response.data);
      setUserToken(response.data.accessToken);

      AsyncStorage.setItem("userToken", response.data.accessToken);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log(error.response.data);
      } else {
        console.log(error);
      }
    }

    setIsLoading(false);
  };

  const logout = () => {
    setUserToken(null);
    AsyncStorage.removeItem("userToken");
    setIsLoading(false);
  };

  useEffect(() => {
    const isLoggedIn = async () => {
      try {
        setIsLoading(true);
        if (!userToken) {
          let userToken = await AsyncStorage.getItem("userToken");
          const decodedToken = JWT.decode(userToken, ACCESS_TOKEN_SECRET);
          setUid(decodedToken.user.id);
          setUserToken(userToken);
        }
        setIsLoading(false);
      } catch (error) {
        console.log(`is LoggedIn Error : ${error}`);
      }
    };

    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        phoneNumber,
        setPhoneNumber,
        isLoading,
        userToken,
        setUserToken,
        callingCode,
        setCallingCode,
        isFirstAuth,
        setIsFirstAuth,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
