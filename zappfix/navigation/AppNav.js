import React, { useContext } from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import { NavigationContainer } from "@react-navigation/native";

import AuthStack from "./AuthStack";
// import Home from "./screens/Home"; 
import AppStack from "./AppStack";
import { AuthContext } from '../context/AuthContext';
import Map from '../screens/Map';

const AppNav = () => {
    const {isLoading,userToken}= useContext(AuthContext);
    if(isLoading){
        return (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <ActivityIndicator size={'large'}/> 
          </View>
        );
    }
    return (
      <NavigationContainer>
        { userToken!=null ? <AppStack/>:<AuthStack/>}
        {/* <AppStack /> */}
        {/* <AuthStack /> */}
        {/* <Map/> */}
      </NavigationContainer>
    );
}



export default AppNav;
