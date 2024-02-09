// Homepage.js

import React, { useState, useEffect } from "react";
import { View, Text, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Homepage = ({ navigation }) => {
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      const user = await AsyncStorage.getItem("loggedInUser");
      setLoggedInUser(user);
    };
    fetchLoggedInUser();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("loggedInUser");
    navigation.navigate("Login");
  };

  return (
    <View>
      <Text>Welcome, {loggedInUser}!</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default Homepage;
