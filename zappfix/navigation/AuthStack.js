import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import Login from '../screens/Login';
import Signup from '../screens/Signup';

const Stack = createStackNavigator();

function AuthStack (){
    return (
      <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="Signup" >
        {/* <Stack.Screen name="Login" component={Login} /> */}
        <Stack.Screen name="Signup" component={Signup} />
      </Stack.Navigator>
    );
}

export default AuthStack;