import React, { useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Linking, TouchableOpacity, Button } from 'react-native';
import { WebView } from 'react-native-webview';

const AdminWorkerDetailPage = ({ route }) => {
  const { worker } = route.params;

  // State to track whether the worker is approved
  const [isApproved, setIsApproved] = useState(worker.status === 'verified');

  // Dummy data for demonstration
  const workerImage = require('../assets/icon.png');
  const workerRating = 4.5; // Example rating
  const workerHistory = [
    { id: 1, task: 'Task 1', date: '2024-03-18' },
    { id: 2, task: 'Task 2', date: '2024-03-17' },
    // Add more history as needed
  ];

  // Dummy PDF URL
  const pdfUrl = 'http://www.pdf995.com/samples/pdf.pdf';

  const openPdfUrl = () => {
    Linking.openURL(pdfUrl);
  };

  // Function to handle worker approval
  const approveWorker = () => {
    // Set worker status to 'Approved'
    // Update the worker's status in the database or API
    setIsApproved(true);
  };

  // Function to handle worker disapproval
  const disapproveWorker = () => {
    // Set worker status to 'Action Required'
    // Update the worker's status in the database or API
    setIsApproved(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image source={workerImage} style={styles.workerImage} />
        <Text style={styles.workerName}>{worker.name}</Text>
        <Text>Status: {isApproved ? 'Approved' : 'Action Required'}</Text>
        {/* Add more worker details */}
        <Text>Rating: {workerRating}</Text>
      </View>
      <View style={styles.history}>
        <Text style={styles.sectionTitle}>Task History</Text>
        {workerHistory.map((item) => (
          <View key={item.id} style={styles.historyItem}>
            <Text>{item.task}</Text>
            <Text>{item.date}</Text>
          </View>
        ))}
      </View>
      {/* PDF Section */}
      <View style={styles.pdfSection}>
        <Text style={styles.sectionTitle}>Certificates</Text>
        <TouchableOpacity onPress={openPdfUrl}>
          <Text style={styles.downloadLink}>Download Certificate</Text>
        </TouchableOpacity>
        <View style={styles.pdfViewer}>
          <WebView
            source={{ uri: pdfUrl }}
            allowFileAccess
            style={styles.pdf}
          />
        </View>
      </View>
      {/* Approve/Disapprove Button */}
      <View style={styles.buttonContainer}>
        {!isApproved && <Button title="Approve" onPress={approveWorker} />}
        {isApproved && <Button title="Disapprove" onPress={disapproveWorker} />}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  workerImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
  workerName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  history: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  pdfSection: {
    marginBottom: 20,
  },
  downloadLink: {
    color: 'blue',
    textDecorationLine: 'underline',
    marginBottom: 10,
  },
  pdfViewer: {
    flex: 1,
    aspectRatio: 1.5, // Adjust this aspect ratio as needed
    borderWidth: 1,
    borderColor: '#000',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});

export default AdminWorkerDetailPage;
