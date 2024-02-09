// Login.js

import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from "react-native";

const Login = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!username) {
      Alert.alert("Error", "Username cannot be empty.");
      return;
    }

    try {
      const storedPassword = await AsyncStorage.getItem(username);
      if (!storedPassword) {
        Alert.alert("Error", "Username does not exist.");
        return;
      }
      else if (storedPassword !== password) {
        Alert.alert("Error", "Wrong password.");
        return;
      }
      await AsyncStorage.setItem("loggedInUser", username);
      setUsername("");
      setPassword("");
      navigation.navigate("Homepage");
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const handleSignupRedirect = () => {
    navigation.navigate("Signup");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Sign Up" onPress={handleSignupRedirect} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default Login;
