import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext =createContext();

export const AuthProvider =({children}) => {
    const [test,setTest]=useState('Test Value');
    const [isLoading,setIsLoading]=useState(false);
    const [userToken,setUserToken]=useState(null);
    const API="http://172.23.7.118:8000"
  
    const logout=()=>{
        setIsLoading(true);
        AsyncStorage.removeItem('userToken');
        setUserToken(null);
        setIsLoading(false);
    }
    const verifyLoginOtp = async (email,otp) =>{
        setIsLoading(true);
        try {
            const response = await fetch(`${API}/verify_login_otp`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                  email: email,
                  otp:otp
                 }),
              });
      
            const result = await response.json();
            if(response.ok){
              alert(result.message)
              setUserToken('RandomToken');
              AsyncStorage.setItem('userToken',"RandValue");
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
            setUserToken(token);
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
        <AuthContext.Provider value={{logout,verifyLoginOtp,API,userToken,isLoading,test,setIsLoading}}>
            {children}
        </AuthContext.Provider>
    );
}