import { StatusBar } from 'expo-status-bar';
import React, { useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Input, NativeBaseProvider, Button, Icon, Box, Image, AspectRatio } from 'native-base';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';

function ToggleButton({ label, active, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.toggleButton, active && styles.activeButton]}>
      <Text style={[styles.toggleButtonText, active && styles.activeButtonText]}>{label}</Text>
    </TouchableOpacity>
  );
}

function Login() {
  const navigation = useNavigation();
  const { API, verifyLoginOtp, setIsLoading,isWorker,setIsWorker} = useContext(AuthContext);
  const [email, setEmail] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [isOtpSent, setIsOtpSent] = React.useState(0);
  const [otp, setOtp] = React.useState("");
  const [isAdmin, setIsAdmin] = React.useState(false); // Default to user

  const isEmailValid = (email) => {
    // You can implement your email validation logic here
    const emailPattern = /^[a-zA-Z0-9._-]+@iitrpr.ac.in$/;
    return emailPattern.test(email);
  };

  const sendOtp = async () => {
    // Perform your signup logic here
    if (!isEmailValid(email)) {
      setEmailError("Please enter a valid IITRPR email address");
      alert("Please enter a valid IITRPR email address");
      return; // Stop the signup process if the email is not valid
    }

    try {
      // Send a POST request to the backend with the user's information
      // setIsLoading(true);
      // if(isAdmin){
      //   const response = await fetch(`${API}/worker_login`, {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify({ email: email }),
      //   });
  
      //   const result = await response.json();
      // }
      // else if(!isAdmin){
        if(isAdmin){
          setIsWorker("True");
        }
        else{
          setIsWorker("False");
        }
        const response = await fetch(`${API}/user_login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: email,isWorker:isWorker }),
        });
  
        const result = await response.json();
      // }
      

      // setIsLoading(false);
      // Handle the response from the backend
      console.log("Response:", response.data);

      // Check if the OTP needs to be sent
      if (response.ok) {
        setIsOtpSent(1);
        console.log("OTP sent successfully");
        alert("OTP sent successfully")
      } else {
        console.log("Failed to send OTP");
        alert("Error code",response.status)
        // Handle the case where OTP sending fails
      }
    } catch (error) {
      console.error("Error signing up:", error);
      alert("Error code",response.status)
      // Handle errors from the backend
    }

  };

  const handleVerifyOTP = async () => {
    try {
      await verifyLoginOtp(email, otp,isAdmin); // Assuming you have email and otp state variables
    } catch (error) {
      console.error("Error verifying OTP:", error);
      // Handle error if needed
    }
  };

  return (
    <View style={styles.container}>
      {isOtpSent ? (
        <View>
          <View style={styles.Middle}>
            <Text style={styles.LoginText}>VERIFY OTP</Text>
          </View>
          <View style={styles.buttonStyleX}>
            <View style={styles.emailInput}>
              <Input
                variant="outline"
                placeholder="Enter OTP"
                _light={{
                  placeholderTextColor: "blueGray.400",
                }}
                _dark={{
                  placeholderTextColor: "blueGray.50",
                }}
                onChangeText={(text) => {
                  // Handle OTP input
                  setOtp(text);
                }}
              />
            </View>
          </View>
          <View style={styles.buttonStyle}>
            <Button style={styles.buttonDesign} onPress={handleVerifyOTP}>
              VERIFY OTP
            </Button>
          </View>
        </View>
      ) : (
        <View>
          <View style={styles.Middle}>
            <Text style={styles.LoginText}>Login as</Text>
          </View>
          {/* Toggle button for user type */}
          <View style={styles.toggleContainer}>
  <ToggleButton
    label="User"
    active={!isAdmin}
    onPress={() => setIsAdmin(false)}
  />
  <Text style={styles.orText}> OR </Text>
  <ToggleButton
    label="Worker"
    active={isAdmin}
    onPress={() => setIsAdmin(true)}
  />
</View>
          
          {/* Username or Email Input Field */}
          <View style={styles.buttonStyle}>

            <View style={styles.emailInput}>
              <Input
                InputLeftElement={
                  <Icon
                    as={<FontAwesome5 name="user-secret" />}
                    size="sm"
                    m={2}
                    _light={{
                      color: "black",
                    }}
                    _dark={{
                      color: "gray.300",
                    }}
                  />
                }
                variant="outline"
                placeholder="Email"
                _light={{
                  placeholderTextColor: "blueGray.400",
                }}
                _dark={{
                  placeholderTextColor: "blueGray.50",
                }}
                onChangeText={(text) => {
                  setEmail(text);
                  setEmailError(""); // Clear the validation error when the user starts typing
                }}

              />
            </View>
          </View>
          {emailError !== "" && (
            <Text style={styles.errorText}>{emailError}</Text>
          )}
          
          {/* Button */}
          <View style={styles.buttonStyle}>
            <Button style={styles.buttonDesign} onPress={sendOtp}>
              Send OTP
            </Button>
          </View>
          <View style={styles.text2}>
            <Text>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Signup")} ><Text style={styles.signupText}> Sign up</Text></TouchableOpacity>
          </View>

          <StatusBar style="auto" />
        </View>
        
      )}

    </View>
  );
}

export default () => {
  return (
    <NativeBaseProvider>

      <Login />

    </NativeBaseProvider>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  LoginText: {
    marginTop: 100,
    fontSize: 30,
    fontWeight: 'bold',
  },
  Middle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text2: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 5
  },
  signupText: {
    fontWeight: 'bold'
  },
  emailField: {
    marginTop: 30,
    marginLeft: 15
  },
  emailInput: {
    marginTop: 10,
    marginRight: 5
  },
  buttonStyle: {
    marginTop: 30,
    marginLeft: 15,
    marginRight: 15
  },
  buttonStyleX: {
    marginTop: 12,
    marginLeft: 15,
    marginRight: 15
  },
  buttonDesign: {
    backgroundColor: '#026efd'
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center', // Add this line to center items vertically
    marginVertical: 10,
  },
  toggleButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 5,
    backgroundColor: '#eee',
    borderRadius: 5,
  },
  orText: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333', // Adjust the color if needed
  },
  activeButton: {
    backgroundColor: '#026efd',
  },
  toggleButtonText: {
    fontWeight: 'bold',
  },
  activeButtonText: {
    color: '#fff',
  },
  errorText: {
    color: 'red',
    marginLeft: 15,
  }
});
