import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

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
  const historyData = [
    {
      id: 1,
      workName: "Project A",
      user: "John Doe",
      date: "2024-03-17",
      amount: 100,
      rating: 4.5,
    },
    {
      id: 2,
      workName: "Project B",
      user: "Jane Smith",
      date: "2024-03-16",
      amount: 200,
      rating: 3.8,
    },
    {
      id: 3,
      workName: "Project C",
      user: "Alice Johnson",
      date: "2024-03-15",
      amount: 150,
      rating: 4.0,
    },
    {
      id: 4,
      workName: "Project D",
      user: "Bob Williams",
      date: "2024-03-14",
      amount: 300,
      rating: 4.2,
    },
    {
      id: 5,
      workName: "Project E",
      user: "Emily Brown",
      date: "2024-03-13",
      amount: 180,
      rating: 4.7,
    },
  ];
  const handlePress = (item) => {
    console.log("Item pressed");
  };
  return (
    <ScrollView style={styles.container}>
      {historyData.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.item}
          onPress={() => handlePress()}
        >
          <View style={styles.rowContainer}>
            <Text style={styles.workName}>{item.workName}</Text>
            <StarRating rating={item.rating} />
          </View>
          <Text style={styles.user}>{item.user}</Text>
          <View style={styles.rowContainer}>
            <Text style={styles.date}>{item.date}</Text>
            <Text style={styles.amount}>${item.amount}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
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
