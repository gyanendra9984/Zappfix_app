import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { usePushNotifications } from "./pushNotifications";
export const AuthContext =createContext();

export const AuthProvider =({children}) => {
  const {expoPushToken, notification} = usePushNotifications();
    const [test,setTest]=useState('Test Value');
    const [isLoading,setIsLoading]=useState(false);
    const [userToken,setUserToken]=useState(null);
    const [isWorker,setIsWorker]=useState("");
    const [email,setEmail]=useState("");
    const [isAdmin,setIsAdmin]=useState("False");
    const API="http://172.23.7.148:8000"
    const [imageUri,setImageUri]=useState(null);

    const API="http://172.23.6.97:8000"




  
    const logout= async ()=>{
        setIsLoading(true);
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('isWorker');
        await AsyncStorage.removeItem('email');
        setUserToken(null);
        setIsWorker("");
        setIsLoading(false);
        setEmail("");
    }

    const verifyLoginOtp = async (email,otp,isAdmin) =>{
        setIsLoading(true);
        try {
          if(isAdmin){
            setIsWorker("True");
          }
          else{
            setIsWorker("False");
          }
            const response = await fetch(`${API}/verify_login_otp`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                credentials:"include",
                body: JSON.stringify({ 
                  email: email,
                  otp:otp,
                  isWorker:isWorker,
                  notification_id: expoPushToken
                 }),
              });
      
            const result = await response.json();
            console.log("here is the result",result);
            if(response.ok){
              alert(result.message)
              setUserToken(result.token);
              setEmail(email);
              AsyncStorage.setItem('userToken',result.token);
              AsyncStorage.setItem('isWorker',isWorker);
              AsyncStorage.setItem('email',email);
            }
            else{
              alert(result.error);
            }
          } catch (error) {
            alert(result.error);
          }
        
        setIsLoading(false);
    }
    const isLoggedIn = async ()=>{
        try{
            setIsLoading(true);
            const token=await AsyncStorage.getItem('userToken');
            const workerBool = await AsyncStorage.getItem('isWorker');
            const tempEmail= await AsyncStorage.getItem('email');
            setUserToken(token);
            setIsWorker(workerBool);
            setEmail(tempEmail);
            setIsLoading(false);
        }
        catch(e){
            alert("error",e);
        }
    }
    useEffect(()=>{
        isLoggedIn();
    },[]);

    return (
        <AuthContext.Provider value={{logout,verifyLoginOtp,API,userToken,isLoading,test,setIsLoading,isWorker,setIsWorker,email,imageUri,setImageUri}}>
            {children}
        </AuthContext.Provider>
    );
}