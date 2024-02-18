import * as React from "react";
import { Button, View ,Text} from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthContext } from "../context/AuthContext";
import Home from "../screens/Home";

// HomeScreen component
function HomeScreen({ navigation }) {
  const {logout,userToken} =React.useContext(AuthContext);
  return (
    // <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
    //   <Text>{userToken}</Text>
    //   <Button onPress={logout} title="LOGOUT" />
    //   <Button
    //     onPress={() => {
    //       navigation.reset({
    //         index: 0,
    //         routes: [{ name: "Notifications" }],
    //       });
    //     }}
    //     title="Go to notifications"
    //   />
    // </View>
    <View>
      <Home/>
    </View>
  );
}
  
  // NotificationsScreen component
  function NotificationsScreen({ navigation }) {
    const { logout } = React.useContext(AuthContext);
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Button onPress={logout} title="LOGOUT" />
        <Button
          onPress={() => {
            navigation.reset({
              index: 0,
              routes: [{ name: "Home" }],
            });
          }}
          title="Go Back Home"
        />
      </View>
    );
  }
  

const Stack = createStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerLeft: null, // This will hide the back button
        }}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          headerLeft: null, // This will hide the back button
        }}
      />
    </Stack.Navigator>
  );
}
