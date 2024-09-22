import React, { useState, useContext } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useMutation } from "@apollo/client";
// import { useNavigation } from '@react-navigation/native';
import { DO_REGISTER } from "../config/queries";
import { AuthContext } from "../context/AuthContext";

const RegisterScreen = ({ navigation }) => {
  const { setIsLoggedIn } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [dispatch, { data }] = useMutation(DO_REGISTER, {
    onCompleted: (data) => {
      console.log("Register berhasil", data);

      navigation.navigate("Login");
    },
    onError: (error) => {
      console.error("Registration error", error);
    },
  });

  const handleRegister = () => {
    dispatch({
      variables: {
        payload: {
          username,
          email,
          password,
        },
      },
    });
  };

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://tse4.mm.bing.net/th?id=OIP.9GePYPo_rTpZpV-6GpETQAHaHa&pid=Api&P=0&h=180",
        }}
        style={styles.logo}
      />
      <Text style={styles.title}>Sign Up</Text>
      <Text style={styles.subTitle}>
        Please confirm your email and password
      </Text>

      <TextInput
        placeholder="Username"
        style={styles.input}
        onChangeText={setUsername}
        value={username}
      />
      <TextInput
        placeholder="Email"
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        onChangeText={setPassword}
        value={password}
      />

      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Register</Text>
      </TouchableOpacity>

      {/* {error && <Text style={styles.errorText}>Error: {error.message}</Text>} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 14,
    color: "#808080",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: "#0088cc",
    paddingVertical: 12,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
});

export default RegisterScreen;
