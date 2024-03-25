import React from 'react';

import AppNav from './navigation/AppNav';
import { AuthProvider } from './context/AuthContext';
import { usePushNotifications } from './context/pushNotifications';
import Home from './screens/Home';


function App() {
  // const {expoPushToken, notification} = usePushNotifications();
  // const data=JSON.stringify(notification, undefined, 2);
  // console.log('data:',data, 'expoPushToken:',expoPushToken.data);
  return (
    <AuthProvider>
      <Home/>
    </AuthProvider>
    
  );
}


export default App;