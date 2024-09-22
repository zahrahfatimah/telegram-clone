import React from "react";
import {
  View,
  Text,
  Button,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useQuery } from "@apollo/client";
import { GET_POST } from "../config/queries"; // Query untuk mengambil semua post

const PostsScreen = ({ navigation }) => {
  const { data, loading, error } = useQuery(GET_POST);

  if (loading) return <Text>Loading posts...</Text>;
  if (error) return <Text>Error loading posts: {error.message}</Text>;
  console.log(data.ShowPost, "<<<<< data di home screen");

  return (
    <View style={styles.container}>
      <ScrollView>
        {data?.ShowPost?.map((post, index) => (
          <TouchableOpacity
            key={`${post.authorId}-${index}`} 
            style={styles.postContainer}
            onPress={() => navigation.navigate("ChatScreen", { _id: post._id })}
          >
            <Text style={styles.title}>{post.title}</Text>
            <Text style={styles.description}>{post.description}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  postContainer: {
    padding: 15,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "#666",
  },
});

export default PostsScreen;
