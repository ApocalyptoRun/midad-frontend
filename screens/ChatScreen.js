import {
  Button,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
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
import { Audio } from "expo-av";
import SoundPlayer from "../components/SoundPlayer";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { Divider, IconButton } from "react-native-paper";

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
  const [audio, setAudio] = useState();
  const [audioUri, setAudioUri] = useState("");

  const [recording, setRecording] = useState(null);

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

  const handleSend = async (messageType, content) => {
    try {
      const formData = new FormData();
      formData.append("recepientId", currentChatId);

      if (messageType === "image") {
        formData.append("messageType", "image");
        formData.append("file", {
          uri: content,
          name: "image.jpg",
          type: "image/jpeg",
        });
      } else if (messageType === "text") {
        formData.append("messageType", "text");
        formData.append("messageText", msg);
      } else if (messageType === "audio") {
        formData.append("messageType", "audio");
        formData.append("file", {
          uri: content,
          name: "audio.m4a",
          type: "audio/m4a",
        });
      }

      console.log(formData);

      const response = await fetch(`${BASE_URL}/message/addMessage`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "multipart/form-data",
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

  const pickImageAndSend = async () => {
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

  const startRecording = async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        console.log("Permissions denied for audio recording.");
        return;
      }

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await recording.startAsync();
      setAudio(recording);
      setRecording(recording);
    } catch (error) {
      console.log(`Error starting recording ${error}`);
    }
  };

  const stopRecordingAndSend = async () => {
    if (recording) {
      try {
        setAudio(undefined);
        setRecording(null);
        await audio.stopAndUnloadAsync();
        const uri = audio.getURI();
        console.log(uri);
        setAudioUri(uri);
        handleSend("audio", uri);
      } catch (error) {
        console.log(`Error stopping recording ${error}`);
      }
    }
  };

  const playAudio = async () => {
    try {
      const soundObject = new Audio.Sound();
      await soundObject.loadAsync({ uri: audioUri });
      await soundObject.playAsync();
    } catch (error) {
      console.log("Error playing audio:", error);
    }
  };

  const handlePressIn = async () => {
    await startRecording();
  };

  const handlePressOut = async () => {
    if (recording) {
      await stopRecordingAndSend();
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

          if (item?.messageType === "audio") {
            return <SoundPlayer key={index} item={item} />;
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
          <Entypo
            onPress={pickImageAndSend}
            name="camera"
            size={24}
            color="gray"
          />

          <TouchableOpacity
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <View style={{ transform: [{ scale: audio ? 2 : 1 }] }}>
              <Feather
                name={audio ? "stop-circle" : "mic"}
                size={24}
                color="gray"
              />
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => handleSend("text")}
          style={{
            backgroundColor: COLORS.cornflowerBlue,
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 20,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Send</Text>
        </TouchableOpacity>
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

    /*   <View style={{ alignItems: "center" }}>
      <Button
        title={audio ? "Stop Recording" : "Start Recording"}
        onPress={audio ? stopRecordingAndSend : startRecording}
      />

      <Button title="play" onPress={playAudio} />
    </View> */
  );
};

export default ChatScreen;
