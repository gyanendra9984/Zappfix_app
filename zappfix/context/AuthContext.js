import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext =createContext();

export const AuthProvider =({children}) => {
    const [test,setTest]=useState('Test Value');
    const [isLoading,setIsLoading]=useState(false);
    const [userToken,setUserToken]=useState(null);
    const [isWorker,setIsWorker]=useState("");
    const API="http://172.26.12.215:8000"
  
    const logout=()=>{
        setIsLoading(true);
        AsyncStorage.removeItem('userToken');
        AsyncStorage.removeItem('isWorker');
        setUserToken(null);
        setIsLoading(false);
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
                body: JSON.stringify({ 
                  email: email,
                  otp:otp,
                  isWorker:isWorker,
                 }),
              });
      
            const result = await response.json();
            if(response.ok){
              alert(result.message)
              setUserToken('RandomToken');
              AsyncStorage.setItem('userToken',"RandValue");
              AsyncStorage.setItem('isWorker',isWorker);
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
            setUserToken(token);
            setIsWorker(workerBool);
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
        <AuthContext.Provider value={{logout,verifyLoginOtp,API,userToken,isLoading,test,setIsLoading,isWorker,setIsWorker}}>
            {children}
        </AuthContext.Provider>
    );
}