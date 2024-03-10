import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const Map = () => {
  const [location, setLocation] = useState(null);
  const [scrollOffset, setScrollOffset] = useState(0);

  useEffect(() => {
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

  const handleScroll = (event) => {
    setScrollOffset(event.nativeEvent.contentOffset.y);
  };

  const maxMapHeight = Dimensions.get('window').height / 2;

  const mapHeight = Math.max(0, maxMapHeight - scrollOffset);

  return (
    <View style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        contentContainerStyle={{ paddingBottom: 200 }} // Adjust this value as needed
      >
        <View style={{ height: maxMapHeight }}>
          {location && (
            <MapView
              style={[styles.map, { height: mapHeight }]}
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
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }}
                title="Current Location"
              />
            </MapView>
          )}
        </View>
        <View style={styles.contentContainer}>
          {/* Content below the map */}
          <Text style={styles.editText}>Nakul & Akanksh have to edit</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderColor: 'black',
    borderWidth: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  contentContainer: {
    height: 500,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Map;
