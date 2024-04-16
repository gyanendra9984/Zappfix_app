import * as React from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';


import Profile from "../screens/Profile/Profile"
import WorkerHome from "../screens/Worker/WorkerHome";
import EditProffDetails from "../screens/Worker/EditProffDetails";
import EditProfile from "../screens/Profile/EditProfile";
import WorkerHistory from "../screens/Worker/workerHistory";
import InteractionPage from "../screens/Worker/InteractionPage";

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
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="EditProffDetails" component={EditProffDetails}/>
      <Tab.Screen name="EditProfile" component={EditProfile} options={{ tabBarButton:()=>null }}/>
      <Tab.Screen name="Worker History" component={WorkerHistory}/>
      <Tab.Screen name="Interaction Page" component={InteractionPage} options={{ tabBarButton:()=>null }}/>
    </Tab.Navigator>
  );
}


