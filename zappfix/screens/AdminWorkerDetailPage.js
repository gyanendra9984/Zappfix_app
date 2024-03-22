import React from 'react';
import { View, Text } from 'react-native';

const AdminWorkerDetailPage = ({ route }) => {
  const { worker } = route.params;

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Worker Name: {worker.name}</Text>
      <Text>Status: {worker.status}</Text>
      {/* Add more details as needed */}
    </View>
  );
};

export default AdminWorkerDetailPage;
