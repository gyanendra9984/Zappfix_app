import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext =createContext();

export const AuthProvider =({children}) => {
    const [test,setTest]=useState('Test Value');
    const [isLoading,setIsLoading]=useState(false);
    const [userToken,setUserToken]=useState(null);
    const API="http://127.0.0.1:8000/"

    const login = async (username,password)=>{
        setIsLoading(true);
        // const response=await axios.post('/login',{username,password});
        // console.log(response.data);
        setUserToken('RandomToken');
        AsyncStorage.setItem('userToken',"RandValue");
        setIsLoading(false)
    }
    const verifyOtp = async (email,otp)=>{
        setIsLoading(true);
        const response = await fetch(`http://172.23.4.155:8000/verify_otp`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            email: email,
            otp:otp
           }),
        });
        alert("axios done")

      const result = await response.json();
        // console.log(response.data);
        // setUserToken('RandomToken');
        AsyncStorage.setItem('userToken',"RandValue");
        setIsLoading(false)
    } 
    const logout=()=>{
        setIsLoading(true);
        AsyncStorage.removeItem('userToken');
        setUserToken(null);
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
        <AuthContext.Provider value={{login,logout,verifyOtp,userToken,isLoading,test}}>
            {children}
        </AuthContext.Provider>
    );
}