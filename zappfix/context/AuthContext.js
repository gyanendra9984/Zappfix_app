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
    const [imageUri,setImageUri]=useState(null);
    const [user, setUser] = useState(null);
    const API="http://172.23.6.5:8000"




  
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


    const fetchUserData = async () => {
      try {
        // SetProgress(true);
        console.log("HELLO 1")
        const response = await fetch(`${API}/get_user_data`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ isWorker: isWorker,email:email,token:userToken }),
        });
        const data = await response.json();
        console.log("HELLO 2")
        if (response.ok) {
          setUser(data.worker_details);
          console.log("data", data)
        } else {
          console.log("HELLO 3")
          console.error('Failed to fetch user data:', data.error);
          if(data.error == "Token expired"){
            alert(data.error);
            logout();
          }
        }
      } catch (error) {
        console.log("HELLO 4")
        console.error('Error fetching user data:', error);
      } finally {
        console.log("HELLO 5")
        
      }
      // SetProgress(false);
    };

    useEffect(()=>{
      if(isWorker && email && userToken){
        fetchUserData();
      }
    }
    ,[isWorker,email,userToken]);

    return (
        <AuthContext.Provider value={{logout,verifyLoginOtp,API,userToken,isLoading,test,setIsLoading,isWorker,setIsWorker,email,imageUri,setImageUri, user}}>
            {children}
        </AuthContext.Provider>
    );
}