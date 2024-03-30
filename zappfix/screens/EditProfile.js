import React, { useContext, useState,useEffect } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import LoadingScreen from './LoadingScreen';

const EditProfile = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const { API, isWorker, email,userToken } = useContext(AuthContext);
  const [progress,SetProgress]=useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      SetProgress(true);
      const response = await fetch(`${API}/get_user_data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ isWorker: isWorker,email:email,token:userToken }),
      });
      const data = await response.json();
      if (response.ok) {
        user=data.worker_details;
        setFirstName(user.first_name);
        setLastName(user.last_name);
        setAge(user.age);
        setAddress(user.address)
        setCity(user.city);
        setGender(user.gender);
        setPhoneNumber(user.phone_number);
        setState(user.state);
        setZipCode(user.zip_code)
      } else {
        console.error('Failed to fetch user data:', data.error);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      
    }
    SetProgress(false);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${API}/edit_personal_profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          first_name: firstName,
          last_name: lastName,
          age: age,
          gender: gender,
          address: address,
          city: city,
          state: state,
          zip_code: zipCode,
          phone_number: phoneNumber,
          isWorker:isWorker,
          token:userToken,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', data.message);
        // Handle successful profile update
      } else {
        Alert.alert('Error', data.error);
        // Handle error from backend
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'An unexpected error occurred.');
      // Handle unexpected errors
    }
  };

  return (
    <View style={styles.container}>
      {progress ? (
        <LoadingScreen />
      ) : (
        <View>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="First Name"
          />
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Last Name"
          />
          <TextInput
            style={styles.input}
            value={age}
            onChangeText={setAge}
            placeholder="Age"
            keyboardType="numeric" // Set keyboard type to numeric
          />
          <TextInput
            style={styles.input}
            value={gender}
            onChangeText={setGender}
            placeholder="Gender"
          />
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
            placeholder="Address"
          />
          <TextInput
            style={styles.input}
            value={city}
            onChangeText={setCity}
            placeholder="City"
          />
          <TextInput
            style={styles.input}
            value={state}
            onChangeText={setState}
            placeholder="State"
          />
          <TextInput
            style={styles.input}
            value={zipCode}
            onChangeText={setZipCode}
            placeholder="Zip Code"
            keyboardType="numeric" // Set keyboard type to numeric
          />
          <TextInput
            style={styles.input}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="Phone Number"
            keyboardType="phone-pad" // Set keyboard type to phone pad
          />
          <Button
            title="Submit"
            onPress={handleSubmit}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    height: 40,
    marginBottom: 10,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
});

export default EditProfile;
