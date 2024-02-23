import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import {
  Input,
  NativeBaseProvider,
  Button,
  Icon,
  Box,
  Image,
  AspectRatio,
  Select,
} from "native-base";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

function Signup() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [selectedGender, setSelectedGender] = React.useState("");
  const [phoneNumberError, setPhoneNumberError] = React.useState("");
  const [emailError, setEmailError] = React.useState("");


  const navigation = useNavigation();
  const isPhoneNumberValid = (number) => {
    // You can implement your phone number validation logic here
    const phoneNumberPattern = /^\d{10}$/; // Assuming a valid phone number is a 10-digit number
    return phoneNumberPattern.test(number);
  };
  const isEmailValid = (email) => {
    // You can implement your email validation logic here
    const emailPattern = /^[a-zA-Z0-9._-]+@iitrpr.ac.in$/;
    return emailPattern.test(email);
  };
  

  const handleSignUp = () => {
    // Perform your signup logic here


    if (!isEmailValid(email)) {
        setEmailError("Please enter a valid IITRPR email address");
        return; // Stop the signup process if the email is not valid
      }
    // Phone number validation
    if (!isPhoneNumberValid(phoneNumber)) {
      setPhoneNumberError("Please enter a valid phone number");
      return; // Stop the signup process if the phone number is not valid
    }

    // Continue with the signup process if the phone number is valid

    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Phone Number:", phoneNumber);
    console.log("Gender:", selectedGender);
    // Add additional logic for password and confirm password if needed
  };
  return (
    <View style={styles.container}>
      <View style={styles.Middle}>
        <Text style={styles.LoginText}>Signup</Text>
      </View>
      <View style={styles.text2}>
        <Text>Already have account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.signupText}> Login </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
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
              placeholder="Name"
              _light={{
                placeholderTextColor: "blueGray.400",
              }}
              _dark={{
                placeholderTextColor: "blueGray.50",
              }}
              onChangeText={(text) => setName(text)}
            />
          </View>
        </View>

        <View style={styles.buttonStyleX}>
          <View style={styles.emailInput}>
            <Select
              InputLeftElement={
                <Icon
                  as={<FontAwesome5 name="venus-mars" />}
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
              selectedValue={selectedGender}
              onValueChange={(itemValue) => setSelectedGender(itemValue)}
              variant="outline"
              placeholder="Select Gender"
            >
              <Select.Item label="Male" value="male" />
              <Select.Item label="Female" value="female" />
              <Select.Item label="Other" value="other" />
            </Select>
          </View>
        </View>

        {/* Username or Email Input Field */}
        <View style={styles.buttonStyleX}>
          <View style={styles.emailInput}>
            <Input
              InputLeftElement={
                <Icon
                  as={<FontAwesome5 name="envelope" />}
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

        {/* Username or Email Input Field */}
        <View style={styles.buttonStyleX}>
          <View style={styles.emailInput}>
            <Input
              InputLeftElement={
                <Icon
                  as={<MaterialCommunityIcons name="phone" />}
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
              placeholder="Phone Number"
              _light={{
                placeholderTextColor: "blueGray.400",
              }}
              _dark={{
                placeholderTextColor: "blueGray.50",
              }}
              onChangeText={(text) => {
                setPhoneNumber(text);
                setPhoneNumberError(""); // Clear the validation error when the user starts typing
              }}
            />
          </View>
        </View>
        {phoneNumberError !== "" && (
          <Text style={styles.errorText}>{phoneNumberError}</Text>
        )}
      </View>

      {/* Button */}
      <View style={styles.buttonStyle}>
        <Button style={styles.buttonDesign} onPress={handleSignUp}>
          REGISTER NOW
        </Button>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

export default () => {
  return (
    <NativeBaseProvider>
      <Signup />
    </NativeBaseProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  LoginText: {
    marginTop: 100,
    fontSize: 30,
    fontWeight: "bold",
  },
  Middle: {
    alignItems: "center",
    justifyContent: "center",
  },
  text2: {
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: 5,
  },
  signupText: {
    fontWeight: "bold",
  },
  emailField: {
    marginTop: 30,
    marginLeft: 15,
  },
  emailInput: {
    marginTop: 10,
    marginRight: 5,
  },
  buttonStyle: {
    marginTop: 30,
    marginLeft: 15,
    marginRight: 15,
  },
  buttonStyleX: {
    marginTop: 12,
    marginLeft: 15,
    marginRight: 15,
  },
  buttonDesign: {
    backgroundColor: "#026efd",
  },
  buttonContainer: {
    //   marginTop:30
  },
  errorText: {
    color: "red",
    marginLeft: 15,
  },
});
