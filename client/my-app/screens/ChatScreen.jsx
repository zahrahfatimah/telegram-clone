import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useQuery, useMutation } from "@apollo/client";
import { GET_POST_BY_ID, ADD_COMMENT } from "../config/queries";

const ChatScreen = ({ route }) => {
  const [content, setContent] = useState("");
  const { _id } = route.params; // Ambil postId dari navigasi

  // Query untuk mendapatkan post berdasarkan ID
  const { data, loading, error } = useQuery(GET_POST_BY_ID, {
    variables: { postId: _id },
  });

  const [addComment] = useMutation(ADD_COMMENT);

  // Fungsi untuk mengirim pesan
  const handleSendMessage = async () => {
    try {
      await addComment({
        variables: {
          id: _id,
          content,
        },
        refetchQueries: [
          { query: GET_POST_BY_ID, variables: { postId: _id } },
        ],
      });
      setContent('');
      
    } catch (error) {
      console.error("Send message error:", error);
    }
  };

  if (loading) return <Text>Loading chats...</Text>;
  if (error) return <Text>Error loading chats: {error.message}</Text>;

  return (
    <View style={styles.container}>
      {/* Bagian untuk menampilkan chat bubble */}
      <ScrollView style={styles.chatContainer}>
        {data?.GetPostById?.data?.comments.map((comment, index) => (
          <View
            key={index}
            style={[
              styles.chatBubble,
              index % 2 === 0 ? styles.userBubble : styles.otherUserBubble,
            ]}
          >
            <Text style={styles.chatText}>{comment.content}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Bagian untuk input pesan */}
      <View style={styles.inputContainer}>
        <TextInput
          value={content}
          onChangeText={setContent}
          placeholder="Type a message"
          style={styles.input}
        />
        <Button title="Send" onPress={handleSendMessage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  chatContainer: {
    flex: 1,
    padding: 10,
  },
  chatBubble: {
    maxWidth: "80%",
    padding: 10,
    borderRadius: 20,
    marginVertical: 5,
  },
  userBubble: {
    backgroundColor: "#DCF8C6",
    alignSelf: "flex-end",
  },
  otherUserBubble: {
    backgroundColor: "#E2E2E2",
    alignSelf: "flex-start",
  },
  chatText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
  },
});

export default ChatScreen;
