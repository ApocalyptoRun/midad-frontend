import {
  Button,
  Image,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { BASE_URL, createConfig } from "../constants/config";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { io } from "socket.io-client";
import { set } from "react-hook-form";
import { SIZES } from "../constants/themes";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "../constants/themes";
import EmojiSelector from "react-native-emoji-selector";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import images from "../constants/images";

const ChatScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { currentChat } = route.params;
  const currentChatId = currentChat._id;
  const { userToken, userId } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [msg, setMsg] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState("");
  const socket = useRef("");
  const [showEmojiSelector, setShowEmojiSelector] = useState(false);

  useEffect(() => {
    if (currentChatId) {
      try {
        config = createConfig(userToken);

        const fecthMessages = async () => {
          const response = await axios.post(
            `${BASE_URL}/message/messages`,
            { recepientId: currentChatId },
            config
          );
          if (response) setMessages(response.data);
        };

        fecthMessages();
      } catch (error) {
        console.log(`Error fecthing message ${error}`);
      }
    }
  }, [currentChatId]);

  useEffect(() => {
    if (userId) {
      socket.current = io(BASE_URL);
      socket.current.emit("add-user", userId);
    }
  }, [userId]);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-receive", (data) => {
        setArrivalMessage(data);
      });
    }
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Ionicons
            onPress={() => navigation.goBack()}
            style={{ marginLeft: 5 }}
            name="arrow-back"
            size={24}
            color="black"
          />

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              style={{
                width: 30,
                height: 30,
                borderRadius: 50,
                resizeMode: "cover",
              }}
              source={{ uri: currentChat?.imageUrl }}
            />
            <Text style={{ marginLeft: 5, fontSize: 15, fontWeight: "bold" }}>
              {currentChat?.firstName}
            </Text>
          </View>
        </View>
      ),
    });
  }, []);

  const handleSend = async (messageType, imageUri) => {
    try {
      const formData = new FormData();
      formData.append("recepientId", currentChatId);

      if (messageType === "image") {
        formData.append("messageType", "image");
        formData.append("imageFile", {
          uri: imageUri,
          name: "image.jpg",
          type: "image/jpeg",
        });
      } else {
        formData.append("messageType", "text");
        formData.append("messageText", msg);
      }

      console.log(formData);

      const response = await fetch(`${BASE_URL}/message/addMessage`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (response) {
        const responseData = await response.json();
        console.log(responseData);

        socket.current.emit("send-msg", responseData);

        const msgs = [...messages];
        msgs.push(responseData);
        setMessages(msgs);

        setMsg("");
        setSelectedImage("");
      }

      /*       axios
        .post(`${BASE_URL}/message/addMessage`, postData, config)
        .then((response) => {
          console.log(response.data);

          socket.current.emit("send-msg", response.data);

          const msgs = [...messages];
          msgs.push(response.data);
          setMessages(msgs);

          setMsg("");
        })
        .catch((err) => {
          console.log(`Error adding message ${err}`);
        }); */
    } catch (error) {
      console.log(`Error in sending the message ${error}`);
    }
  };

  const handleEmojiPress = () => {
    setShowEmojiSelector(!showEmojiSelector);
  };

  const formatTime = (time) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("en-US", options);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      handleSend("image", result.assets[0].uri);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView>
        {messages.map((item, index) => {
          if (item?.messageType === "text") {
            return (
              <Pressable
                key={index}
                style={[
                  item?.senderId?._id === userId
                    ? {
                        alignSelf: "flex-end",
                        backgroundColor: COLORS.cornflowerBlue,
                        padding: 8,
                        margin: 10,
                        maxWidth: "60%",
                        borderRadius: 7,
                      }
                    : {
                        alignSelf: "flex-start",
                        backgroundColor: COLORS.gray4,
                        padding: 8,
                        margin: 10,
                        maxWidth: "60%",
                        borderRadius: 7,
                      },
                ]}
              >
                <Text
                  style={[
                    item?.senderId?._id === userId
                      ? {
                          fontSize: 13,
                          color: "white",
                          textAlign: "left",
                        }
                      : {
                          fontSize: 13,
                          textAlign: "left",
                        },
                  ]}
                >
                  {item?.message}
                </Text>
                <Text
                  style={[
                    item?.senderId?._id === userId
                      ? {
                          textAlign: "right",
                          fontSize: 9,
                          color: COLORS.gray6,
                          marginTop: 5,
                        }
                      : {
                          textAlign: "left",
                          fontSize: 9,
                          marginTop: 5,
                        },
                  ]}
                >
                  {formatTime(item.timeStamp)}
                </Text>
              </Pressable>
            );
          }

          if (item?.messageType === "image") {
            return (
              <Pressable
                key={index}
                style={[
                  item?.senderId?._id === userId
                    ? {
                        alignSelf: "flex-end",
                        backgroundColor: COLORS.cornflowerBlue,
                        padding: 8,
                        margin: 10,
                        maxWidth: "60%",
                        borderRadius: 7,
                      }
                    : {
                        alignSelf: "flex-start",
                        backgroundColor: COLORS.gray4,
                        padding: 8,
                        margin: 10,
                        maxWidth: "60%",
                        borderRadius: 7,
                      },
                ]}
              >
                <View>
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={{ width: 200, height: 200, borderRadius: 7 }}
                  />
                  <Text
                    style={[
                      item?.senderId?._id === userId
                        ? {
                            textAlign: "right",
                            fontSize: 9,
                            color: COLORS.gray6,
                            marginTop: 5,
                          }
                        : {
                            textAlign: "left",
                            fontSize: 9,
                            marginTop: 5,
                          },
                    ]}
                  >
                    {formatTime(item.timeStamp)}
                  </Text>
                </View>
              </Pressable>
            );
          }
        })}
      </ScrollView>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 10,
          paddingVertical: 10,
          borderTopWidth: 1,
          borderTopColor: "#dddddd",
          marginBottom: showEmojiSelector ? 0 : 25,
        }}
      >
        <Entypo
          onPress={handleEmojiPress}
          style={{ marginRight: 5 }}
          name="emoji-happy"
          size={24}
          color="gray"
        />

        <TextInput
          value={msg}
          onChangeText={(text) => setMsg(text)}
          style={{
            flex: 1,
            height: 40,
            borderWidth: 1,
            borderColor: "#dddddd",
            borderRadius: 20,
            paddingHorizontal: 10,
          }}
          placeholder="Midad message"
        />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 7,
            marginHorizontal: 8,
          }}
        >
          <Entypo onPress={pickImage} name="camera" size={24} color="gray" />

          <Feather name="mic" size={24} color="gray" />
        </View>

        <Pressable
          onPress={() => handleSend("text")}
          style={{
            backgroundColor: COLORS.cornflowerBlue,
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 20,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Send</Text>
        </Pressable>
      </View>

      {showEmojiSelector && (
        <EmojiSelector
          onEmojiSelected={(emoji) => {
            setMsg((prev) => prev + emoji);
          }}
          style={{ height: 250 }}
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;
