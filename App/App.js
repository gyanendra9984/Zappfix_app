import React from 'react';
import 'react-native-gesture-handler';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


import AuthStack from './navigation/AuthStack';
import Home from './screens/Home';
import AppStack from './navigation/AppStack';


function App() {
  return (
    <NavigationContainer>
      {/* <AppStack /> */}
      <AuthStack />
    </NavigationContainer>
  );
}


export default App;