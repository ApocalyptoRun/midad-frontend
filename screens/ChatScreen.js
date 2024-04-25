import {
  AppState,
  Button,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
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
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { COLORS } from "../constants/themes";
import EmojiSelector from "react-native-emoji-selector";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { Audio } from "expo-av";
import SoundPlayer from "../components/SoundPlayer";
import * as Notifications from "expo-notifications";
import { Camera, CameraType } from "expo-camera";

import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { shareAsync } from "expo-sharing";

const ChatScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { currentChat } = route.params;
  const currentChatId = currentChat._id;
  const { userToken, userId, setSocket } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [msg, setMsg] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState("");
  const config = createConfig(userToken);
  const socket = useRef("");
  const [showEmojiSelector, setShowEmojiSelector] = useState(false);
  const [audio, setAudio] = useState();
  const [audioUri, setAudioUri] = useState("");
  const [recording, setRecording] = useState(null);
  const [appState, setAppState] = useState(AppState.currentState);
  const [filePath, setFilePath] = useState("");
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();

  useEffect(() => {
    fecthMessages();
    setupSocket();
  }, [currentChatId]);

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
              source={{ uri: currentChat?.profilePhoto }}
            />
            <Text style={{ marginLeft: 5, fontSize: 15, fontWeight: "bold" }}>
              {currentChat?.firstName}
            </Text>
          </View>
        </View>
      ),
      headerRight: () => (
        <View style={{ marginRight: 16 }}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("VideoCall", {
                from: userId,
                to: currentChatId,
              })
            }
          >
            <Feather name="video" size={24} color="black" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, []);

  const fecthMessages = async () => {
    if (currentChatId) {
      try {
        const response = await axios.post(
          `${BASE_URL}/message/messages`,
          { recepientId: currentChatId },
          config
        );
        if (response) setMessages(response.data);
      } catch (error) {
        console.log(`Error fecthing message ${error}`);
      }
    }
  };

  const setupSocket = () => {
    if (userId) {
      socket.current = io(BASE_URL);
      setSocket(socket.current);
      socket.current.emit("add-user", userId);

      socket.current.on("msg-receive", (data) => {
        console.log(appState);
        setArrivalMessage(data);
      });
    }
  };

  const displayLocalNotification = async (message) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "New Message",
          body: message,
        },
        trigger: null,
      });
    } catch (error) {
      console.log("Error displaying notification:", error);
    }
  };

  const handleSend = async (messageType, content, documentName) => {
    try {
      const formData = new FormData();
      formData.append("recepientId", currentChatId);

      let name, type;
      if (messageType !== "text") {
        name = content.split("/").pop();
        type = content.split(".").pop();
        if (documentName) name = documentName;
      }

      if (messageType === "image") {
        formData.append("messageType", "image");
        formData.append("file", {
          uri: content,
          name: name,
          type: `image/${type}`,
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
      } else if (messageType === "document") {
        formData.append("messageType", "document");
        formData.append("file", {
          uri: content,
          name: name,
          type: `application/${type}`,
        });
      }

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

  const pickDocumentAndSend = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        await handleSend(
          "document",
          result.assets[0].uri,
          result.assets[0].name
        );
      }
    } catch (error) {
      console.error("Error picking document:", error);
      return null;
    }
  };

  const handleDownloadFile = async (filePath) => {
    setFilePath(filePath);
    await downloadFile();
  };

  const downloadFile = async () => {
    const downloadFromUrl = async () => {
      const filename = "test.pdf";
      const result = await FileSystem.downloadAsync(
        filePath,
        FileSystem.documentDirectory + filename
      );
      console.log(result);

      save(result.uri, filename, result.headers["Content-Type"]);
    };

    const save = async (uri, filename, mimetype) => {
      if (Platform.OS === "android") {
        const permissions =
          await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (permissions.granted) {
          const base64 = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
          });
          await FileSystem.StorageAccessFramework.createFileAsync(
            permissions.directoryUri,
            filename,
            mimetype
          )
            .then(async (uri) => {
              await FileSystem.writeAsStringAsync(uri, base64, {
                encoding: FileSystem.EncodingType.Base64,
              });
            })
            .catch((e) => console.log(e));
        } else {
          shareAsync(uri);
        }
      } else {
        shareAsync(uri);
      }
    };

    downloadFromUrl();
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView>
        {messages.map((item, index) => {
          const isCurrentUser = item?.senderId?._id === userId;

          const messageStyle = isCurrentUser
            ? {
                alignSelf: "flex-end",
                backgroundColor: COLORS.cornflowerBlue,
              }
            : {
                alignSelf: "flex-start",
                backgroundColor: COLORS.gray4,
              };

          const textStyle = isCurrentUser
            ? {
                fontSize: 13,
                color: "white",
                textAlign: "left",
              }
            : {
                fontSize: 13,
                textAlign: "left",
              };

          const timeStyle = isCurrentUser
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
              };

          if (item?.messageType === "text") {
            return (
              <Pressable
                key={index}
                style={[
                  messageStyle,
                  {
                    padding: 8,
                    margin: 10,
                    maxWidth: "60%",
                    borderRadius: 7,
                  },
                ]}
              >
                <Text style={textStyle}> {item?.message} </Text>
                <Text style={timeStyle}> {formatTime(item.timeStamp)} </Text>
              </Pressable>
            );
          }

          if (item?.messageType === "image") {
            return (
              <Pressable
                key={index}
                onPress={() => handleDownloadFile(item.imageUrl)}
                style={[
                  messageStyle,
                  {
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
                  <Text style={timeStyle}> {formatTime(item.timeStamp)} </Text>
                </View>
              </Pressable>
            );
          }

          if (item?.messageType === "document") {
            let fileName = item.imageUrl.split("/").pop();
            fileName = fileName.split("-").pop();
            return (
              <Pressable
                key={index}
                onPress={() => handleDownloadFile(item.imageUrl)}
                style={[
                  messageStyle,
                  {
                    padding: 8,
                    margin: 10,
                    maxWidth: "60%",
                    borderRadius: 7,
                  },
                ]}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
                >
                  <FontAwesome name="file" size={24} color="white" />
                  <Text style={{color:COLORS.white}} numberOfLines={1} ellipsizeMode="tail">
                    {fileName}
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
          <Entypo
            onPress={pickImageAndSend}
            name="camera"
            size={24}
            color="gray"
          />

          <Ionicons
            onPress={pickDocumentAndSend}
            name="document-attach-outline"
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
