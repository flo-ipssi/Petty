import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MessagesInStackParamList } from "@/@types/navigation";
import moment from "moment";
import React, { FC, useEffect, useState } from "react";
import {
  Button,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Keys, getFromAsyncStorage } from "@/utils/asyncStorage";
import { upldateNotification } from "@/store/notification";
import { useDispatch, useSelector } from "react-redux";
import { getAuthState, UserProfile } from "@/store/auth";
import client from "@/api/client";

type Props = NativeStackScreenProps<MessagesInStackParamList, "Conversation">;

const Conversation: FC<Props> = ({ route }) => {
  const dispatch = useDispatch();
  const { profile } = useSelector(getAuthState);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { conversationId, petInfos } = route.params;

  async function fetchMessages() {
    try {
      const token = await getFromAsyncStorage(Keys.AUTH_TOKEN);
      if (!token) return;
      const data = await fetch(client + `message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          conversationId: conversationId,
        }),
      });

      const res = await data.json();

      if (res.messages) {
        setMessages(res.messages);
      }
    } catch (error) {
      dispatch(upldateNotification({ message: error, type: "error" }));
    }
  }
  async function sendMessage(message: string) {
    try {
      const token = await getFromAsyncStorage(Keys.AUTH_TOKEN);
      if (!token) return;
      await fetch(client + `message/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          messageText: message,
          ownerId: profile.id,
          conversationId: conversationId,
        }),
      });
    } catch (error) {
      dispatch(upldateNotification({ message: error, type: "error" }));
    }
  }

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      const updatedMessages = [
        ...messages,
        { text: newMessage, owner: profile?.id },
      ];
      setMessages(updatedMessages);
      setNewMessage("");
      sendMessage(newMessage);
    }
  };

  const formatMessageDate = (dateString: moment.MomentInput) => {
    const timestamp = moment(dateString);

    if (timestamp.isSame(moment(), "day")) {
      return timestamp.format("HH:mm");
    } else {
      return timestamp.format("dd MMMM yyyy à HH:mm");
    }
  };

  const renderItem = ({ item }) => {
    const isMe = item.owner == profile?.id ? true : false;

    return (
      <View
        style={{
          flexDirection: isMe ? "row-reverse" : "row",
          flex: 1,
          marginVertical: 15,
        }}
      >
        {!isMe && (
          <Image
            source={{ uri: petInfos.photo[0] }}
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              marginRight: 10,
              marginTop: 10,
            }}
          />
        )}
        <View
          style={{
            backgroundColor: isMe ? "#DCF8C6" : "#F0F0F0",
            alignSelf: isMe ? "flex-end" : "flex-start",
            borderRadius: 20,
            padding: 10,
            maxWidth: "100%",
          }}
        >
          <Text style={{ fontSize: 16 }}>{item.text}</Text>
          <Text style={{ fontSize: 12, marginTop: 5, color: "#666" }}>
            {formatMessageDate(item.createdAt)}
          </Text>
        </View>
      </View>
    );
  };

  useEffect(() => {
    fetchMessages();
    if (conversationId) {
      const intervalId = setInterval(() => {
        fetchMessages();
      }, 5000);

      return () => clearInterval(intervalId);
    }
  }, [conversationId]);

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#FAFAFA" }}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        inverted // show the messages from the bottom to the top
      />
      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}
      >
        <TextInput
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: "#CCCCCC",
            borderRadius: 30,
            paddingHorizontal: 15,
            paddingVertical: 10,
            backgroundColor: "#FFFFFF",
          }}
          value={newMessage}
          onChangeText={(text) => setNewMessage(text)}
          placeholder="Saisissez votre message..."
        />
        <Button title="Envoyer" onPress={handleSendMessage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default Conversation;
