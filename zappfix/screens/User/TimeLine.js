import React, { useContext, useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Timeline from 'react-native-timeline-flatlist';
import { AuthContext } from '../../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

const TimeLine = (props) => {
  const { API, logout } = useContext(AuthContext);
  const { email, service } = props.route.params;
  const [timelineData, setTimelineData] = useState([]);

  useEffect(() => {
    fetchTimeline();
  }, []); // Fetch timeline on component mount

  const fetchTimeline = async () => {
    try {
      const user_email = await AsyncStorage.getItem('email');
      const response = await fetch(`${API}/fetch_timeline_details`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          user_email: user_email,
          worker_email: email,
          service: service,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setTimelineData(data.timeline_details);
      } else {
        console.error('Failed to fetch user data:', data.error);
        if (data.error === 'Token expired') {
          alert(data.error);
          logout();
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Timeline data={timelineData} />
      
      {/* Render timeline items */}
      <View style={styles.timelineItemsContainer}>
        {timelineData.map((item, index) => (
          <View key={index} style={styles.timelineItem}>
            <Text>{item.title}</Text>
            <Text>{item.time}</Text>
            <Text>{item.description}</Text>
          </View>
        ))}
      </View>
      <View style={styles.reloadButtonContainer}>
        <TouchableOpacity style={styles.reloadButton} onPress={fetchTimeline}>
          <Icon name="refresh" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reloadButtonContainer: {
    position: 'absolute',
    bottom: 20,
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
  timelineItemsContainer: {
    marginTop: 20,
    width: '100%',
    paddingHorizontal: 20,
  },
  timelineItem: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
  },
});

export default TimeLine;
