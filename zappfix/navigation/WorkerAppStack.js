import * as React from "react";
import { Button, View ,Text} from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthContext } from "../context/AuthContext";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Home from "../screens/Home";
import Map from '../screens/Map';
import Profile from "../screens/Profile"
import WorkerInfo from "../screens/WokerInfo";
import WorkerHome from "../screens/WorkerHome";
import EditProffDetails from "../screens/EditProffDetails";
import EditProfile from "../screens/EditProfile";
import WorkerHistory from "../screens/workerHistory";
import InteractionPage from "../screens/InteractionPage";

const Tab = createBottomTabNavigator();

export default function WorkerAppStack() {
  return (
    <Tab.Navigator initialRouteName="WorkerHome"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'DashBoard') {
            iconName = 'hammer';
          } else if (route.name === 'Map') {
            iconName = 'map';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }  else if (route.name === 'EditProffDetails') {
            iconName = 'information-circle';
          }else if (route.name === 'EditProfile') {
            iconName = 'person';
          }else if (route.name === 'Worker History') {
            iconName = 'person';
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        }
      })}
    >
      <Tab.Screen name="DashBoard" component={WorkerHome} />
      {/* <Tab.Screen name="Map" component={Map} /> */}
      <Tab.Screen name="Profile" component={Profile} />
      {/* <Tab.Screen name="WorkerInfo" component={WorkerInfo} /> */}
      <Tab.Screen name="EditProffDetails" component={EditProffDetails}/>
      <Tab.Screen name="EditProfile" component={EditProfile} options={{ tabBarButton:()=>null }}/>
      <Tab.Screen name="Worker History" component={WorkerHistory}/>
      <Tab.Screen name="Interaction Page" component={InteractionPage} options={{ tabBarButton:()=>null }}/>
    </Tab.Navigator>
    // <Stack.Navigator initialRouteName="Home" >
    //   <Stack.Screen
    //     name="ZappFix"
    //     component={Home}
    //     options={{
    //       headerLeft: null, // This will hide the back button
    //     }}
    //   />
    //   <Stack.Screen name="Map" component={Map}/>
    //   <Stack.Screen name="Profile" component={Profile}/>
    //   <Stack.Screen name="WorkerInfo" component={WorkerInfo}/>
    // </Stack.Navigator>
  );
}


