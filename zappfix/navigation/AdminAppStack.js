import * as React from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AdminHome from "../screens/AdminHome";
import HandleWorkersPage from "../screens/HandleWorkersPage";
import Profile from "../screens/Profile";
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HandleWorkersStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HandleWorkers" component={HandleWorkersPage} options={{ title: 'Worker Details' }}/>
      <Stack.Screen name="WorkerInfo" component={Profile} options={{ title: 'Worker Details' }} />
    </Stack.Navigator>
  );
}

export default function AdminAppStack() {
  return (
    <Tab.Navigator initialRouteName="AdminHome"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Admin DashBoard') {
            iconName = 'person';
          } else if (route.name === 'Handle Workers') {
            iconName = 'hammer';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        }
      })}
    >
      <Tab.Screen name="Admin DashBoard" component={AdminHome} />
      <Tab.Screen name="Handle Workers" component={HandleWorkersStack} />
    </Tab.Navigator>
  );
}
