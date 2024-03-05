import {
  Button,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { BASE_URL, createConfig } from "../constants/config";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { io } from "socket.io-client";
import { set } from "react-hook-form";
import { SIZES } from "../constants/themes";

const ChatScreen = ({ route }) => {
  const { currentChatId } = route.params;
  const { userToken, userId } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState("");
  const socket = useRef("");
  const scrollRef = useRef();

  useEffect(() => {
    if (currentChatId) {
      const fecthMessages = async () => {
        const postData = {
          to: currentChatId,
        };
        const config = createConfig(userToken);

        try {
          const response = await axios.post(
            `${BASE_URL}/message/messages`,
            postData,
            config
          );

          setMessages(response.data);
        } catch (err) {
          console.log(`Error fecthing messages ${err}`);
        }
      };

      fecthMessages();
    }
  }, [currentChatId]);

  useEffect(() => {
    if (userId) {
      socket.current = io(BASE_URL);
      socket.current.emit("add-user", userId);
    }
  }, [userId]);

  const handleSendMessage = async () => {
    const postData = {
      to: currentChatId,
      message: msg,
    };
    const config = createConfig(userToken);

    axios
      .post(`${BASE_URL}/message/addMessage`, postData, config)
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => {
        console.log(`Error adding message ${err}`);
      });

    socket.current.emit("send-msg", { ...postData, from: userId });

    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs);

    setMsg("");
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-receive", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, [messages]);

  return (
    <ScrollView style={{ padding: 10 }}>
      {messages.map((msg, index) => (
        <View
          key={index}
          style={msg.fromSelf ? styles.sended : styles.received}
        >
          <Text style={msg.fromSelf ? styles.textSended : styles.textReceived}>
            {msg.message}
          </Text>
        </View>
      ))}

      <View>
        <TextInput
          style={{ marginVertical: 10, backgroundColor: "white" }}
          placeholder="send a message"
          value={msg}
          onChangeText={(text) => setMsg(text)}
        />

        <Button title="send" onPress={handleSendMessage} />
      </View>
    </ScrollView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  sended: {
    alignSelf: "flex-end",
    backgroundColor: "gray",
    marginVertical: 3,
    padding: 5,
  },
  received: {
    alignSelf: "flex-start",
    backgroundColor: "white",
    marginVertical: 3,
    padding: 5,
  },

  textSended: {
    color: "white",
  },
  textReceived: {},
});
