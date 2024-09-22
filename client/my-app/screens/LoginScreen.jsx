import { useState, useContext } from "react";
import { View, TextInput, Button, Text, Image, StyleSheet } from "react-native";
import { useMutation } from "@apollo/client";
import { DO_LOGIN } from "../config/queries";
import { AuthContext } from "../context/AuthContext";
import * as SecureStore from 'expo-secure-store'

const LoginScreen = () => {
  const { setIsLoggedIn } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [dispatch, { data }] = useMutation(DO_LOGIN, {
    onCompleted: async (res) => {
      console.log(res);
      let token = null;
      if (res && res.login && res.login.data && res.login.data.token) {
        token = res.login.data.token;
      }
      console.log("token mu muncul juga yaaa", token);
      await SecureStore.setItemAsync("token", token);

      setIsLoggedIn(true);
    },
    onError: async (err) => {
      console.log(email, password);

      console.log(err);
    },
  });

  const handleLogin = async () => {
    await dispatch({
      variables: {
        email,
        password,
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
      <Text style={styles.title}>Sign In</Text>
      <Text style={styles.subTitle}>
        Input your email and password
      </Text>
      <TextInput
        placeholder="Email"
        style={styles.input}
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        onChangeText={setPassword}
        value={password}
      />
      <Button title="Login" onPress={handleLogin} />
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
  logo: {
    width: 100,
    height: 100,
    marginBottom: 40,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
});

export default LoginScreen;
