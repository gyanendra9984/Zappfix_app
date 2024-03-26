import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
  Animated,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from "@react-navigation/native";

const WorkerInfo = () => {
  const [location, setLocation] = useState(null);
  const [scrollOffset, setScrollOffset] = useState(new Animated.Value(0));
  const [selectedRating, setSelectedRating] = useState(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [workersData, setWorkersData] = useState([]);
  const navigation = useNavigation();

  const {API} = useContext(AuthContext);

  // Function to fetch nearest workers
  const fetchNearestWorkers = async () => {
    try {
      if(!location) return;
      console.log("location", location)
      const response = await fetch(`${API}/get_nearest_workers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service: 'Carpentry',
          coords: [location.coords.latitude, location.coords.longitude],
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setWorkersData(data.workers);
      } else {
        console.error('Failed to fetch nearest workers:', data.error);
      }
    } catch (error) {
      console.error('Error fetching nearest workers:', error);
    }
  };


  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      if(location){
        fetchNearestWorkers();
      }

    })();
  }, []);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollOffset } } }],
    { useNativeDriver: false }
  );

  const maxMapHeight = Dimensions.get('window').height / 2;

  const mapHeight = scrollOffset.interpolate({
    inputRange: [0, maxMapHeight],
    outputRange: [maxMapHeight, 0],
    extrapolate: 'clamp',
  });

  const workers = [
    { id: '1', name: 'John Doe', rating: 4.2, profileImage: require('../assets/Profile.png') },
    { id: '2', name: 'Jane Smith', rating: 3.8, profileImage: require('../assets/Profile.png') },
    { id: '3', name: 'Bob Johnson', rating: 4.5, profileImage: require('../assets/Profile.png') },
    { id: '4', name: 'Alice Williams', rating: 3.9, profileImage: require('../assets/Profile.png') },
    { id: '5', name: 'Chris Brown', rating: 4.1, profileImage: require('../assets/Profile.png') },
    { id: '6', name: 'Emily Davis', rating: 4.3, profileImage: require('../assets/Profile.png') },
    { id: '7', name: 'Daniel Miller', rating: 4.0, profileImage: require('../assets/Profile.png') },
    { id: '8', name: 'Sophia Wilson', rating: 3.7, profileImage: require('../assets/Profile.png') },
    { id: '9', name: 'Matthew Jones', rating: 4.4, profileImage: require('../assets/Profile.png') },
    { id: '10', name: 'Olivia White', rating: 3.5, profileImage: require('../assets/Profile.png') },
  ];

  const filteredWorkers = selectedRating
    ? workers.filter(worker => worker.rating >= selectedRating)
    : workers;

    const renderWorkerCard = ({ item }) => (
      <TouchableOpacity onPress={() =>{ navigation.navigate("RequestPage")}}>
      <View style={styles.workerCard}>
        <Image source={item.profileImage} style={styles.profileImage} />
        <View style={styles.workerInfo}>
          <Text style={styles.workerName}>{item.name}</Text>
          <Text style={styles.ratingText}>Rating: </Text>
          <StarRating rating={item.rating} />
        </View>
      </View>
      </TouchableOpacity>
    );

  const renderDropdownButton = () => (
    <TouchableOpacity
      style={styles.filterDropdownButton}
      onPress={() => setDropdownOpen(!isDropdownOpen)}
    >
      <Text style={styles.dropdownButtonText}>
        {selectedRating ? `Rating >= ${selectedRating}` : 'Filter by Rating'}
      </Text>
      <MaterialCommunityIcons
        name={isDropdownOpen ? 'chevron-up' : 'chevron-down'}
        size={24}
        color="black"
      />
    </TouchableOpacity>
  );

  const renderDropdownOptions = () => (
    <View style={styles.dropdownOptions}>
      {['Clear Filter', 4.0, 3.5, 3.0, 2.5, 1.5 ].map((value) => (
        <TouchableOpacity
          key={value}
          style={styles.dropdownOption}
          onPress={() => handleDropdownSelect(value)}
        >
          <Text>{value}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );


  // Render function for markers
  const locationData = [
    { id: '1', first_name: 'John', last_name: 'Doe', liveLatitude: 20.1234, liveLongitude: 78.9639 },
    { id: '2', first_name: 'Jane', last_name: 'Smith', liveLatitude: 29.0588, liveLongitude: 76.0856 },
    { id: '3', first_name: 'Bob', last_name: 'Johnson', liveLatitude: 27.0238, liveLongitude: 74.2179 },
    { id: '4', first_name: 'Alice', last_name: 'Williams', liveLatitude: 12.9716, liveLongitude: 77.5946 },
    { id: '5', first_name: 'Chris', last_name: 'Brown', liveLatitude: 37.78825, liveLongitude: -122.4324 },
  ];

  useEffect(() => {
    setWorkersData(locationData);
  }, []);



  const renderMarkers = () => {
    return workersData.map((worker, index) => (
      <Marker
        key={index}
        coordinate={{
          latitude: worker.liveLatitude,
          longitude: worker.liveLongitude,
        }}
        title={`${worker.first_name} ${worker.last_name}`}
      />
    ));
  };

  const handleDropdownSelect = (value) => {
    if (value === 'Clear Filter') {
      setSelectedRating(null);
    } else {
      setSelectedRating(value);
    }
    setDropdownOpen(false);
  };

  return (
    <View style={styles.container}>
      <Animated.View style={{ height: mapHeight }}>
        {location && (
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
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="Current Location"
            />
            {renderMarkers()}
          </MapView>
        )}
      </Animated.View>
      <View style={styles.contentContainer}>
        <Text style={styles.serviceProvidersInfo}>Service Providers Info</Text>
        <TouchableOpacity style={styles.uploadButton} onPress={fetchNearestWorkers}>
                        <Text style={styles.uploadButtonText}>Reload Button for Fetching Map</Text>
                    </TouchableOpacity>

        {/* Filter Dropdown Button */}
        {renderDropdownButton()}

        {/* Dropdown Options */}
        {isDropdownOpen && renderDropdownOptions()}

        {/* FlatList of Worker Cards */}
    
        <FlatList
          data={filteredWorkers}
          keyExtractor={(item) => item.id}
          renderItem={renderWorkerCard}
          onScroll={handleScroll}
          contentContainerStyle={{ paddingBottom: 200 }} // Adjust this value as needed
          
        />
      </View>
    </View>
  );
};

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const decimalPart = rating - fullStars;

  const stars = [];
  for (let i = 0; i < fullStars; i++) {
    stars.push(<MaterialCommunityIcons key={i} name="star" size={20} color="gold" />);
  }

  if (decimalPart > 0) {
    stars.push(<MaterialCommunityIcons key={fullStars} name="star-half" size={20} color="gold" />);
  }

  return <View style={styles.starContainer}>{stars}</View>;
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  serviceProvidersInfo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  filterDropdownButton: {
    height: 50,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    paddingHorizontal: 10,
  },
  dropdownButtonText: {
    fontSize: 16,
  },
  dropdownOptions: {
    position: 'absolute',
    top: 60,
    right: 10,
    width: 120,
    backgroundColor: 'white',
    borderRadius: 5,
    elevation: 5,
    zIndex: 1,
  },
  dropdownOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  workerCard: {
    width: '100%',
    flexDirection: 'row',
    padding: 20,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  workerInfo: {
    flex: 1,
    marginLeft: 10,
  },
  workerName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  starContainer: {
    flexDirection: 'row',
  },
  ratingText: {
    fontSize: 16,
    color: '#333',
  },
});

export default WorkerInfo;
