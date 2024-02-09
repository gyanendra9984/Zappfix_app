// App.js

import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Login from "./screens/Login";
import Signup from "./screens/Signup";
import Homepage from "./screens/Homepage";

const Stack = createStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedInUser = async () => {
      try {
        const user = await AsyncStorage.getItem("loggedInUser");
        if (user) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Error checking logged-in user:", error);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedInUser();
  }, []);

  if (loading) {
    return null; // or render a loading indicator
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!isLoggedIn && (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Signup" component={Signup} />
          </>
        )}
        <Stack.Screen name="Homepage" component={Homepage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
