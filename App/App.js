import React from 'react';
import 'react-native-gesture-handler';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


import AuthStack from './navigation/AuthStack';
import Home from './screens/Home';
import AppStack from './navigation/AppStack';
import { AuthProvider } from './context/AuthContext';
import AppNav from './navigation/AppNav';


function App() {
  return (
    <AuthProvider>
      <AppNav/>
    </AuthProvider>
  );
}


export default App;