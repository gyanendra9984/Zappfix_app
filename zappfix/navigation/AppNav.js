import React, { useContext } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";

import AuthStack from "./AuthStack";
import AppStack from "./AppStack";
import WorkerAppStack from './WorkerAppStack';
import { AuthContext } from '../context/AuthContext';
import AdminAppStack from './AdminAppStack';
import Home from '../screens/Home';


const AppNav = () => {
  const { isLoading, userToken, isWorker } = useContext(AuthContext);
  if (isLoading) {
    return (
      <View
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        <ActivityIndicator size={'large'} />
      </View>

    );
  }
  return (
    <NavigationContainer>
      {/* { (userToken!=null && isWorker =="False") ? <AppStack/>:<AuthStack/>} */}
      {userToken != null && isWorker=="True" ? <WorkerAppStack /> : (userToken != null ? <AppStack /> : <AuthStack />)}
      {/* <AdminAppStack/> */}
      {/* {
        userToken != null ? (
          isAdmin ? <AdminAppStack /> : (
            isWorker ? <WorkerAppStack /> : <AppStack />
          )
        ) : <AuthStack />
      } */}

      {/* {(userToken!=null && isWorker =="True") ? <WorkerAppStack/>:<AuthStack/>} */}
      {/*{ userToken!=null ? <AppStack/>:<AuthStack/>}*/}
    </NavigationContainer>
  );
}

export default AppNav;
