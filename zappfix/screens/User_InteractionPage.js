import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet ,Text ,TouchableOpacity,Linking,Image} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { AuthContext } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon1 from 'react-native-vector-icons/FontAwesome';

const User_InteractionPage = (props) => {
  const [location, setLocation] = useState(null);
  const {API}=useContext(AuthContext);
  const [distance,setDistance]=useState(0);
  const { email,service } = props.route.params;
  const [workerProfile,setWorkerProfile]=useState([])
  

  useEffect(() => {
    fetchWorkerProfile();
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const fetchWorkerProfile = async () => {
    try {
    //   setProgress(true);
      const user_email=await AsyncStorage.getItem("email");
      console.log(user_email,email)
      const response = await fetch(`${API}/get_worker_profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user_email,worker_email:email}),
      });
      
      const data = await response.json();
      data.latitude+=0.1;
      data.longitude+=0.1;
      console.log("here is the data=",data);
      // console.log(data,"jhhhhhhh")
      if (response.ok) {
        setWorkerProfile(data); // Set worker profile data to state

        if (location && data.latitude && data.longitude) {
          const userCoords = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };
          const workerCoords = {
            latitude: data.latitude,
            longitude: data.longitude,
          };
          const calculatedDistance = calculateDistance(userCoords, workerCoords);
          setDistance(calculatedDistance);
        }
      } else {
        console.error('Failed to fetch worker profile:', data.message);
      }
    } catch (error) {
      console.error('Error fetching worker profile:', error);
    }
    // setProgress(false);
  };
  useEffect(() => {
    fetchWorkerProfile();
  }, [API, email]);

    // Function to calculate distance using Haversine formula
  const calculateDistance = (startCoords, endCoords) => {
    const earthRadius = 6371; // Radius of the Earth in kilometers
    const dLat = toRadians(endCoords.latitude - startCoords.latitude);
    const dLon = toRadians(endCoords.longitude - startCoords.longitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(startCoords.latitude)) *
        Math.cos(toRadians(endCoords.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = earthRadius * c;
    return distance.toFixed(2); // Return distance rounded to 2 decimal places
  };

  // Function to convert degrees to radians
  const toRadians = (degrees) => {
    return degrees * (Math.PI / 180);
  };
       // Function to open WhatsApp
  const openWhatsApp = () => {
  const phoneNumber = workerProfile.phone_number;
  const message = `Hello,I am interested in your ${service} service. Could you please provide me with more details about the service, including what it includes, any pricing information, and how I can avail of it? Additionally, I would like to inquire about your availability.Looking forward to your response.Thank you.`;

  Linking.openURL(`whatsapp://send?phone=+91${phoneNumber}&text=${encodeURIComponent(message)}`);
};
  return (
    <View style={styles.container}>
    <View style={styles.mapContainer}>
    <Text>Loading ...</Text>
      {location && workerProfile.latitude && workerProfile.longitude && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {/* Current Location Marker */}
          <Marker
            coordinate={{
                latitude: workerProfile.latitude, longitude: workerProfile.longitude
            }}
            title="Worker Location"
            // image={require('../assets/Profile.png')}
            // width={1}
            // height={10}
            // borderRadius={50}
          />
          {/* <Image source={require('../assets/Profile.png')} style={{width:300,height:300}}/> */}
          {/* </Marker> */}
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Current Location"
          />
          
          {/* Example Polyline */}
          {/* <Polyline
            coordinates={[
              { latitude: location.coords.latitude, longitude: location.coords.longitude },
              { latitude: workerProfile.latitude, longitude: workerProfile.longitude }
            ]}
            strokeWidth={2}
            strokeColor="red"
          /> */}
          {/* Add more Polylines if needed */}
        </MapView>
      ) }
      </View>
      <View style={styles.whatsappContainer}>
        <TouchableOpacity onPress={openWhatsApp}>
        <Icon name="chat" size={42} color="#3498db" />
        
        </TouchableOpacity>
        <Text style={styles.whatsappText}>{distance} KM Away</Text>
        {/* Render worker data here */}
      </View>
      <View styles={styles.whatsappContainer}>
      </View>
      <View style={styles.reloadButtonContainer}>
              <TouchableOpacity style={styles.reloadButton} onPress={fetchWorkerProfile}>
                <Icon name="refresh" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  mapContainer: {
    flex: 6,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  whatsappContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  whatsappText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  reloadButtonContainer: {
    position: 'absolute',
    bottom: 120,
    right: 20,
  },
  reloadButton: {
    backgroundColor: '#3498db',
    borderRadius: 50,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default User_InteractionPage;
