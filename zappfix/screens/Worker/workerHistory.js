import React,{useState,useEffect, useContext} from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

import { AuthContext } from "../../context/AuthContext";

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const decimalPart = rating - fullStars;

  const stars = [];
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <MaterialCommunityIcons key={i} name="star" size={20} color="gold" />
    );
  }

  if (decimalPart > 0) {
    stars.push(
      <MaterialCommunityIcons
        key={fullStars}
        name="star-half"
        size={20}
        color="gold"
      />
    );
  }

  return <View style={styles.starContainer}>{stars}</View>;
};

const HistoryList = () => {
  // Dummy JSON dataset
  const [historyData,setHistoryData]=React.useState([]);
  const [progress,setProgress]=React.useState(false);
  const {API}= useContext(AuthContext);
  const navigation =useNavigation();
  const handlePress = (item) => {
    console.log("Item pressed",item.email);
    console.log("here is the email",item.email);
    navigation.navigate("Interaction Page",{email:item.email,service:item.service});
  };

  const fetchRequestsHistory = async () => {
    const email= await AsyncStorage.getItem("email");
    console.log("email=",email);
    try {
        // setProgress
        setProgress(true);
        const response = await fetch(`${API}/get_progress_works`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email:email,
              }),
        });
        console.log(1)
        console.log(response)
        const data = await response.json();
        console.log(2)
        if (response.ok) {
            console.log("Requests=",data.worker_histories);
            setHistoryData(data.progress_works);
        } else {
            console.error('Failed to fetch worker hsitory:', data.error);
        }
    } catch (error) {
      console.log("here");
        console.error('Error fetching worker hsitory:', error);
    }
    setProgress(false);
};

useEffect(() => {
    fetchRequestsHistory();
}, []);
  return (
    <View style={styles.container}>
    <ScrollView style={styles.container}>
    {historyData ? (historyData.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.item}
          onPress={() => handlePress(item)}
        >
          <View style={styles.rowContainer}>
            <Text style={styles.workName}>{item.first_name}</Text>
            <StarRating rating={item.rating} />
          </View>
          <Text style={styles.user}>{item.email}</Text>
          <View style={styles.rowContainer}>
            <Text style={styles.date}>{item.service}</Text>
            <Text style={styles.amount}>{item.status}</Text>
          </View>
        </TouchableOpacity>
      ))):(<View style={styles.centered}>
      <Text>No current  History of requests</Text>
    </View>)}
    </ScrollView>
    <View style={styles.reloadButtonContainer}>
              <TouchableOpacity style={styles.reloadButton} onPress={fetchRequestsHistory}>
                <Icon name="refresh" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  starContainer: {
    flexDirection: "row",
  },
  item: {
    marginBottom: 16,
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ccc",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  workName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  user: {
    fontSize: 16,
    color: "#555",
  },
  date: {
    fontSize: 16,
    color: "#555",
    marginTop: 4,
  },
  rating: {
    fontSize: 16,
    color: "#555",
  },
  amount: {
    fontSize: 16,
    color: "#555",
    marginTop: 8,
    textAlign: "right",
  },
  centered: {
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
});

const WorkerHistory = () => {
  return (
    <View style={{ flex: 1 }}>
      <HistoryList />
    </View>
  );
};

export default WorkerHistory;
// export default HistoryList;
