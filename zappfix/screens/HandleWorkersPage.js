import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput } from 'react-native';

const HandleWorkersPage = ({ navigation }) => {
  const [workers, setWorkers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Dummy worker data for demonstration
  useEffect(() => {
    // Fetch or set up your worker data here
    const dummyWorkers = [
      { id: 1, name: 'John Doe', status: 'verified' },
      { id: 2, name: 'Jane Smith', status: 'action required' },
      { id: 3, name: 'Alice Johnson', status: 'verified' },
    ];
    setWorkers(dummyWorkers);
  }, []);

  const filteredWorkers = workers.filter(worker =>
    worker.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleWorkerClick = (worker) => {
    navigation.navigate('AdminWorkerDetail', { worker });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.workerItem}
      onPress={() => handleWorkerClick(item)}
    >
      <Text>{item.name}</Text>
      <Text style={item.status === 'verified' ? styles.verified : styles.actionRequired}>
        {item.status}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search workers..."
        onChangeText={text => setSearchQuery(text)}
        value={searchQuery}
      />
      <FlatList
        data={filteredWorkers}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  workerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  verified: {
    color: 'green',
  },
  actionRequired: {
    color: 'red',
  },
});

export default HandleWorkersPage;