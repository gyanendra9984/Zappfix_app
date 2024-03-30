import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AuthContext } from '../context/AuthContext';
import LoadingScreen from './LoadingScreen';

const Profile = () => {
  const [user, setUser] = useState(null);
  const { logout, isWorker, setIsLoading, API,email ,userToken} = useContext(AuthContext);
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
        setUser(data.worker_details);
      } else {
        console.error('Failed to fetch user data:', data.error);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      
    }
    SetProgress(false);
  };

  const handleEditProfile = () => {
    console.log('Reload Profile button pressed');
    fetchUserData();
  };

  const handleLogout = () => {
    console.log('Logout button pressed');
  };

  return (
    <View style={styles.container}>
      {progress ? (
        <LoadingScreen />
      ) : (
        user && (
          <View>
            <View style={styles.profileInfo}>
              <Image source={require('../assets/Profile.png')} style={styles.profileImage} />
              <View style={styles.profileDetails}>
                <Text style={styles.profileName}>{user.first_name}</Text>
                <Text style={styles.profileId}> {user.last_name}</Text>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Contact Information</Text>
              <View style={styles.infoContainer}>
                <View style={styles.infoItem}>
                  <Icon name="phone" size={20} color="#555" />
                  <Text>{` ${user.phone_number}`}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Icon name="email" size={20} color="#555" />
                  <Text>{` ${user.email}`}</Text>
                </View>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Personal Information</Text>
              <View style={styles.infoContainer}>
                <View style={styles.infoItem}>
                  <Icon name="person" size={20} color="#555" />
                  <Text>{` ${user.age} years old`}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Icon name="wc" size={20} color="#555" />
                  <Text>{` ${user.gender}`}</Text>
                </View>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Address</Text>
              <View style={styles.infoContainer}>
                <View style={styles.infoItem}>
                  <Icon name="location-on" size={20} color="#555" />
                  <Text>{` ${user.address}, ${user.city}, ${user.state} ${user.zipCode}`}</Text>
                </View>
              </View>
            </View>

            {isWorker == "True" && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Rating</Text>
                <View style={styles.infoContainer}>
                  <View style={styles.infoItem}>{/* Display rating stars */}
                    {/* Include displayRatingStars function here */}
                    {/* You can use user.rating instead of profile.rating */}
                  </View>
                </View>
              </View>
            )}

            <View style={styles.bottomButtons}>
              <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
                <Icon name="edit" size={20} color="#fff" />
                <Text style={styles.buttonText}>Reload Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, { backgroundColor: '#FF5733' }]} onPress={logout}>
                <Icon name="exit-to-app" size={20} color="#fff" />
                <Text style={styles.buttonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileDetails: {
    justifyContent: 'space-between',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    writingDirection: 'rtl',
  },
  profileId: {
    fontSize: 16,
    color: '#666',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoContainer: {
    flexDirection: 'column',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3498db',
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 5,
  },
});

export default Profile;
