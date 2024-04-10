import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Alert, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/AuthContext';
import LoadingScreen from './LoadingScreen';
import Icon from 'react-native-vector-icons/MaterialIcons';

const RequestPage = (props) => {
  const [selectedTab, setSelectedTab] = useState('Contact Info');
  const { email } = props.route.params;
  const {API}= useContext(AuthContext);
  const [progress,setProgress]=useState(false);
  const [workerProfile, setWorkerProfile] = useState(null);
  
  const handleTabPress = (tabName) => {
    setSelectedTab(tabName);
  };

  const handleRequestService =   async () => {
    await  Alert.alert(
      'Request Service',
      'Do you want to request service?',
      [
        {
          
          text: 'Request',
          onPress: async () => {
            console.log('Service requested');
            setProgress(true);
            const UserEmail=await  AsyncStorage.getItem("email");
            const response = await fetch(`${API}/create_request`, {
              method: 'POST', 
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                user_email:UserEmail,
                worker_email:email,
                service:"Hello Im Requesting Service"
              }),
            });
            const data = await response.json();
            console.log("Here is the data",data);
            if(data.status=="success"){
               alert("Request Sent SuccessFully!!");
            }
            else{
              alert(data.message);
            }
            setProgress(false);
          },
        },
        {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => {
                console.log('Service cancel');
              },
        }
        
      ],
      { cancelable: true }
    );

  };

  const fetchWorkerProfile = async () => {
    try {
      setProgress(true);
      const user_email=await AsyncStorage.getItem("email");
      const response = await fetch(`${API}/get_worker_profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user_email,worker_email:email, }),
      });
      const data = await response.json();
      console.log(data,"jhhhhhhh")
      if (response.ok) {
        setWorkerProfile(data); // Set worker profile data to state
      } else {
        console.error('Failed to fetch worker profile:', data.message);
      }
    } catch (error) {
      console.error('Error fetching worker profile:', error);
    }
    setProgress(false);
  };
  useEffect(() => {
    fetchWorkerProfile();
  }, [API, email]);

  // Dummy data for reviews
  const reviews = [
    { name: 'Alice', review: 'Great service! Highly recommended.' },
    { name: 'Bob', review: 'Very professional and efficient work.' },
    { name: 'Charlie', review: 'Good communication and timely service.' },
    { name: 'David', review: 'Exceeded expectations. Will hire again.' },
    { name: 'Eve', review: 'Friendly and knowledgeable. Satisfied with the work.' },
    { name: 'Frank', review: 'Poor quality work. Disappointed with the service.' },
    { name: 'Grace', review: 'Unreliable. Failed to complete the job as promised.' },
    { name: 'Harry', review: 'Unprofessional behavior. Avoid at all costs.' },
    { name: 'Ivy', review: 'Terrible experience. Do not recommend.' },
    { name: 'Jack', review: 'Waste of money. The job was done poorly.' },
  ];
  

  const renderReviewItem = ({ item }) => (
    <View style={styles.reviewItem}>
      <Text style={styles.reviewName}>{item.name}</Text>
      <Text style={styles.reviewText}>"{item.review}"</Text>
      <View style={styles.separator} />
    </View>
  );

  return (
    <View style={styles.container}>
    {progress || workerProfile===null ? (
        <LoadingScreen />
      ) : (
      <View style={styles.workerInfo}>
        <Image
          style={styles.workerPhoto}
          source={require('../assets/Profile.png')} // Placeholder image URL
        />
        <View style={styles.workerDetails}>
          <Text style={styles.workerName} className="text-lg">{workerProfile.first_name} {workerProfile.last_name}</Text>
          <Text style={styles.workerDescription}>
            {workerProfile.services && workerProfile.services.join(', ')}

          </Text>
          <View style={styles.rating}>
            <Text style={styles.ratingText}>Rating: </Text>
            <FontAwesome name="star" size={20} color="gold" />
            <FontAwesome name="star" size={20} color="gold" />
            <FontAwesome name="star" size={20} color="gold" />
            <FontAwesome name="star-half-full" size={20} color="gold" />
          </View>
        </View>
      </View>
      )}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === 'Contact Info' && { backgroundColor: '#0096FF', borderTopWidth: 0,},
          ]}
          onPress={() => handleTabPress('Contact Info')}
        >
          <Text style={[styles.tabText, selectedTab === 'Contact Info' && { color: '#fff' }]}>Contact Info</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === 'Reviews' && { backgroundColor: '#0096FF', borderTopWidth: 0 },
          ]}
          onPress={() => handleTabPress('Reviews')}
        >
          <Text style={[styles.tabText, selectedTab === 'Reviews' && { color: '#fff' }]}>Reviews</Text>
        </TouchableOpacity>
      </View>
      {/* Render contact info or reviews based on selected tab */}
      {selectedTab === 'Contact Info' ? (
  <View style={styles.tabContent}>
  {progress || workerProfile===null ? (
        <LoadingScreen />
      ) : (
    <View style={styles.contactInfo}>
      <Text style={styles.contactLabel}>Email: {workerProfile.email}</Text>
      <Text style={styles.contactLabel}>Phone: {workerProfile.phone_number}</Text>
      <Text style={styles.contactLabel}>Address: {workerProfile.address},{workerProfile.state}</Text>
    </View>
      )}
  </View>
      ) : (
        <View style={styles.tabContent}>
          {/* Render reviews */}
          <FlatList
            data={reviews}
            renderItem={renderReviewItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      )}
      <View style={styles.separatorLine}></View>
      {/* Button at the bottom */}
      <View style={styles.reloadButtonContainer}>
              <TouchableOpacity style={styles.reloadButton} onPress={fetchWorkerProfile}>
                <Icon name="refresh" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
      <TouchableOpacity style={styles.fullWidthButton} onPress={handleRequestService}>
        <Text style={styles.fullWidthButtonText}>Request Service</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
    paddingTop: 20, // Align items in the upper half of the screen
  },
  workerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  workerPhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderColor: 'black',
    borderWidth: 1,
    marginRight: 20,
  },
  workerDetails: {
    flex: 1,
  },
  workerName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  workerDescription: {
    fontSize: 14,
    marginBottom: 5,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 5,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
  },
  tabButton: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: 'black',
  },
  tabText: {
    color: 'black',
    fontSize: 16,
  },
  tabContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: 15,
  },
  reviewItem: {
    marginBottom: 10,
},
reviewName: {
  fontSize: 16,
  fontWeight: 'bold',
},
reviewText: {
  fontSize: 14,
},
separator: {
  height: 1,
  backgroundColor: 'lightgray',
  width: '100%',
  marginVertical: 5,
},
fullWidthButton: {
  backgroundColor: '#0096FF',
  width: '80%', // Adjust width as needed
  borderRadius: 10,
  paddingVertical: 15,
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 20, // Add margin at the bottom
},
fullWidthButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
},
separatorLine: {
  width: '90%', // Adjust width as needed
  borderBottomColor: 'lightgray',
  borderBottomWidth: 1,
  marginVertical: 20, // Adjust vertical margin as needed
},
contactInfo: {
  alignItems: 'flex-start',
  marginTop: -250,
},
contactLabel: {
  fontSize: 16,
  marginBottom: 5,
},
reloadButtonContainer: {
  position: 'absolute',
  bottom: 100,
  right: 0,
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

export default RequestPage;