import React, { useContext } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";

import AuthStack from "./AuthStack";
import AppStack from "./AppStack";
import WorkerAppStack from './WorkerAppStack';
import { AuthContext } from '../context/AuthContext';
import AdminAppStack from './AdminAppStack';
import Home from '../screens/Home';
import Profile from '../screens/Profile';
import WorkerHome from '../screens/WorkerHome';
import LoadingScreen from '../screens/LoadingScreen';
import EditProffDetails from '../screens/EditProffDetails';


const AppNav = () => {
  const { isLoading, userToken, isWorker } = useContext(AuthContext);
  if (isLoading) {
    return (
      <LoadingScreen/>
    );
  }
  return (
    <NavigationContainer>
      {/* { (userToken!=null && isWorker =="False") ? <AppStack/>:<AuthStack/>} */}
      {userToken != null && isWorker=="True" ? <WorkerAppStack /> : (userToken != null ? <AppStack /> : <AuthStack />)}
      {/* <LoadingScreen/> */}
      {/* <WorkerHome/> */}
      {/* <AdminAppStack/> */}
      {/* {
        userToken != null ? (
          isAdmin=="True" ? <AdminAppStack /> : (
            isWorker=="True" ? <WorkerAppStack /> : <AppStack />
          )
        ) : <AuthStack />
      } */}
      {/* <EditProffDetails/> */}
      {/* {(userToken!=null && isWorker =="True") ? <WorkerAppStack/>:<AuthStack/>} */}
      {/*{ userToken!=null ? <AppStack/>:<AuthStack/>}*/}
    </NavigationContainer>
  );
}

export default AppNav;
