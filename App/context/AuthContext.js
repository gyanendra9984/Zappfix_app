import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useState } from "react";

export const AuthContext =createContext();

export const AuthProvider =({children}) => {
    const [test,setTest]=useState('Test Value');
    const [isLoading,setIsLoading]=useState(false);
    const [userToken,setUserToken]=useState(null);

    const login = ()=>{
        setIsLoading(true);
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
    return (
        <AuthContext.Provider value={{login,logout,userToken,isLoading,test}}>
            {children}
        </AuthContext.Provider>
    );
}