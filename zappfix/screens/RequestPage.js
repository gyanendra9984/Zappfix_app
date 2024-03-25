import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const RequestPage = () => {
  const [selectedTab, setSelectedTab] = useState('Contact Info');

  const handleTabPress = (tabName) => {
    setSelectedTab(tabName);
  };

  const handleRequestService = () => {
    Alert.alert(
      'Request Service',
      'Do you want to request service?',
      [
        {
          
          text: 'Request',
          onPress: () => {
            console.log('Service requested');
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
  
  const contactInfo = {
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    address: '123 Main Street, City, Country',
  };

  const renderReviewItem = ({ item }) => (
    <View style={styles.reviewItem}>
      <Text style={styles.reviewName}>{item.name}</Text>
      <Text style={styles.reviewText}>"{item.review}"</Text>
      <View style={styles.separator} />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.workerInfo}>
        <Image
          style={styles.workerPhoto}
          source={require('../assets/Profile.png')} // Placeholder image URL
        />
        <View style={styles.workerDetails}>
          <Text style={styles.workerName}>John Doe</Text>
          <Text style={styles.workerDescription}>
            Installation, repair, and maintenance of plumbing systems.
            Proficient in interpreting blueprints
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
    {/* Display contact information */}
    <View style={styles.contactInfo}>
      <Text style={styles.contactLabel}>Email: {contactInfo.email}</Text>
      <Text style={styles.contactLabel}>Phone: {contactInfo.phone}</Text>
      <Text style={styles.contactLabel}>Address: {contactInfo.address}</Text>
    </View>
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
  backgroundColor: 'green',
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
});

export default RequestPage;

