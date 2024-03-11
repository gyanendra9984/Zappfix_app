import React, { useContext } from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import { NavigationContainer } from "@react-navigation/native";

import AuthStack from "./AuthStack";
import AppStack from "./AppStack";
import { AuthContext } from '../context/AuthContext';


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
        {/* { userToken!=null ? <AppStack/>:<AuthStack/>} */}
        <AppStack></AppStack>
      </NavigationContainer>
    );
}

export default AppNav;
