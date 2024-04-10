import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet ,Text ,TouchableOpacity,Linking} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { AuthContext } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

const InteractionPage = (props) => {
  const [location, setLocation] = useState(null);
  const {API}=useContext(AuthContext);
  const [distance,setDistance]=useState(0);
  const { email } = props.route.params;
  

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      try {
        // setProgress
        // setProgress(true);
        const response = await fetch(`${API}/update_worker_location`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email:email,
                liveLatitude:location.coords.latitude,
                liveLongitude:location.coords.longitude,
              }),
        });
        const data = await response.json();
        if (response.ok) {
            alert(data.message);
        } else {
            console.error('Failed to Update Location:', data.error);
        }
    } catch (error) {
        console.error('Error Updating Location:', error);
    }
    })();
  }, []);

  const UpdateLocation = async () =>{
    try {
        // setProgress
        // setProgress(true);
        const response = await fetch(`${API}/update_worker_location`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email:email,
                liveLatitude:location.coords.latitude,
                liveLongitude:location.coords.longitude,
              }),
        });
        const data = await response.json();
        if (response.ok) {
            alert(data.message);
        } else {
            console.error('Failed to Update Location:', data.error);
        }
    } catch (error) {
        console.error('Error Updating Location:', error);
    }
    }
       // Function to open WhatsApp
  const openWhatsApp = () => {
    Linking.openURL('whatsapp://send?phone=+1234567890'); // Replace +1234567890 with your WhatsApp number
  };
  return (
    <View style={styles.container}>
    <View style={styles.mapContainer}>
    <Text>Loading ...</Text>
      {location ? (
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
                latitude: 30.9, longitude: 75.9 
            }}
            title="User Location"
          />
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Current Location"
          />
          
          {/* Example Polyline */}
          <Polyline
            coordinates={[
              { latitude: location.coords.latitude, longitude: location.coords.longitude },
              { latitude: 30.9, longitude: 75.9 }
            ]}
            strokeWidth={2}
            strokeColor="red"
          />
          {/* Add more Polylines if needed */}
        </MapView>
      ) : null}
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
              <TouchableOpacity style={styles.reloadButton} onPress={UpdateLocation}>
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

export default InteractionPage;
