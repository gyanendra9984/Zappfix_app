import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from './screens/Home';
import AppNav from './navigation/AppNav';
import { AuthProvider } from './context/AuthContext';


function App() {
  return (
    <AuthProvider>
        <AppNav/>
    </AuthProvider>
    
  );
}


export default App;