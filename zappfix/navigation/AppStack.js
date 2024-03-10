import * as React from "react";
import { Button, View ,Text} from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthContext } from "../context/AuthContext";
import Home from "../screens/Home";
import Map from '../screens/Map';
import Profile from "../screens/Profile"
import WorkerInfo from "../screens/WokerInfo";

const Stack = createStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="ZappFix"
        component={Home}
        options={{
          headerLeft: null, // This will hide the back button
        }}
      />
      <Stack.Screen name="Map" component={Map}/>
      <Stack.Screen name="Profile" component={Profile}/>
      <Stack.Screen name="WorkerInfo" component={WorkerInfo}/>
    </Stack.Navigator>
  );
}
