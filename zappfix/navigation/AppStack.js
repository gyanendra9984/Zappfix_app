import * as React from "react";
import { Button, View ,Text,Avatar,Image} from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthContext } from "../context/AuthContext";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Home from "../screens/Home";
import Map from '../screens/Map';
import Profile from "../screens/Profile"
import WorkerInfo from "../screens/WokerInfo";
import EditProfile from "../screens/EditProfile";
import RequestPage from "../screens/RequestPage";
import { Pressable } from "react-native";
import Search from "../components/Search";
import RecentSearches from "../screens/RecentSearches";

const Tab = createBottomTabNavigator();
const Drawer= createDrawerNavigator();
const Stack= createStackNavigator();
function DrawerNavigator() {
  const headerOptions = {
    title: 'Task List',
    drawerIcon: ({ focused, size, color }) => <Ionicons name="hammer" color="red" size={24} />,
  };
  
  return (
    <Drawer.Navigator screenOptions={({ navigation }) => ({
      headerRight: () =>(
         <Pressable style={{ flexDirection: 'row', alignItems: 'center' }} onPress={navigation.toggleDrawer}>
           {/* <Search /> */}
           <Image size={5} style={{ maxHeight: 40, maxWidth: 40, borderRadius: 50, marginRight: 10 }} source={require('../assets/Profile.png')} />
        </Pressable>),
        headerLeft:()=>(
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image  style={{ maxHeight: 50, maxWidth: 50, borderRadius: 50, marginLeft: 5 }} source={require('../assets/icon.png')} />
            <Search />
          </View>
        ),
        headerLeftContainerStyle:{width:250,maxWidth:300,marginLeft:20},
        headerBackgroundContainerStyle:{borderWidth:1}

     })}>
      <Drawer.Screen name="Home Page" component={TabNavigator} options={{headerTitleContainerStyle:{width:0}}} />
      {/* <Drawer.Screen name="Search" component={RecentSearches} options={{headerTitleContainerStyle:{width:0}}}/> */}
    </Drawer.Navigator>
  );
}

export default function AppStack(){
  return (
      <Stack.Navigator>
        <Stack.Screen name="DrawerNavigator" component={DrawerNavigator}  options={{headerShown:false}}/>
      </Stack.Navigator>
    
  );
};

function TabNavigator() {
  return (
    <Tab.Navigator initialRouteName="Home" 
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'ZappFix') {
            iconName = 'hammer';
          } else if (route.name === 'Map') {
            iconName = 'map';
          } else if (route.name === 'EditProfile') {
            iconName = 'person';
          } else if (route.name === 'WorkerInfo') {
            iconName = 'information-circle';
          }else if (route.name === 'Profile') {
            iconName = 'person';
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerShown:false
      })}
    >
      <Tab.Screen name="ZappFix" component={Home}  options={{headerShown:false}}/>
      <Tab.Screen name="Map" component={Map} options={{ tabBarButton:()=>null }} />
      <Tab.Screen name="EditProfile" component={EditProfile} options={{ tabBarButton:()=>null }}/>
      <Tab.Screen name="Profile" component={Profile}/>
      <Tab.Screen name="WorkerInfo" component={WorkerInfo} options={{ tabBarButton:()=>null }}/>
      <Tab.Screen name="RequestPage" component={RequestPage} options={{ tabBarButton:()=>null }}/>
      <Tab.Screen name="Search" component={RecentSearches} options={{ tabBarButton:()=>null }}/>
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


