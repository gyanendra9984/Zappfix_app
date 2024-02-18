import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext =createContext();

export const AuthProvider =({children}) => {
    const [test,setTest]=useState('Test Value');
    const [isLoading,setIsLoading]=useState(false);
    const [userToken,setUserToken]=useState(null);

    const login = async (username,password)=>{
        setIsLoading(true);
        // const response=await axios.post('/login',{username,password});
        // console.log(response.data);
        setUserToken('RandomToken');
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
        <AuthContext.Provider value={{login,logout,userToken,isLoading,test}}>
            {children}
        </AuthContext.Provider>
    );
}