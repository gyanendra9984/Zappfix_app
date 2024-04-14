import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Linking, Image } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { AuthContext } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const User_InteractionPage = (props) => {
  const [location, setLocation] = useState(null);
  const { API } = useContext(AuthContext);
  const [distance, setDistance] = useState(0);
  const { email, service } = props.route.params;
  const [workerProfile, setWorkerProfile] = useState([]);
  const [routeCoordinates, setRouteCoordinates] = useState([]);

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
      const user_email = await AsyncStorage.getItem("email");
      const response = await fetch(`${API}/get_worker_profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user_email, worker_email: email }),
      });

      const data = await response.json();
      data.latitude += 0.1;
      data.longitude += 0.1;
      if (response.ok) {
        setWorkerProfile(data);

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
          fetchRoute(userCoords, workerCoords);
        }
      } else {
        console.error('Failed to fetch worker profile:', data.message);
      }
    } catch (error) {
      console.error('Error fetching worker profile:', error);
    }
  };

  useEffect(() => {
    fetchWorkerProfile();
  }, [API, email]);

  const calculateDistance = (startCoords, endCoords) => {
    const earthRadius = 6371;
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
    return distance.toFixed(2);
  };

  const toRadians = (degrees) => {
    return degrees * (Math.PI / 180);
  };

  const openWhatsApp = () => {
    const phoneNumber = workerProfile.phone_number;
    const message = `Hello, I am interested in your ${service} service. Could you please provide me with more details about the service, including what it includes, any pricing information, and how I can avail of it? Additionally, I would like to inquire about your availability. Looking forward to your response. Thank you.`;

    Linking.openURL(`whatsapp://send?phone=+91${phoneNumber}&text=${encodeURIComponent(message)}`);
  };

  const fetchRoute = async (origin, destination) => {
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}?overview=full&geometries=geojson`;

      const response = await fetch(url);
      const data = await response.json();

      if (response.ok && data.routes.length > 0) {
        const routeCoordinates = data.routes[0].geometry.coordinates.map(coord => ({
          latitude: coord[1],
          longitude: coord[0],
        }));
        setRouteCoordinates(routeCoordinates);
      }
    } catch (error) {
      console.error('Error fetching route:', error);
    }
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
            <Marker
              coordinate={{
                latitude: workerProfile.latitude,
                longitude: workerProfile.longitude
              }}
              title="Worker Location"
            >
              <Image
                source={require('../assets/scooter_icon.png')}
                style={{ width: 40, height: 40 }}
              />
            </Marker>
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="Current Location"
            >
              <Image
                source={require('../assets/user_icon.png')}
                style={{ width: 40, height: 40 }}
              />
            </Marker>
            <Polyline
              coordinates={routeCoordinates}
              strokeWidth={2}
              strokeColor="#FF0000"
            />
          </MapView>
        )}
      </View>
      <View style={styles.whatsappContainer}>
        <TouchableOpacity onPress={openWhatsApp}>
          <Icon name="chat" size={42} color="#3498db" />
        </TouchableOpacity>
        <Text style={styles.whatsappText}>{distance} KM Away</Text>
      </View>
      <View styles={styles.whatsappContainer}></View>
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