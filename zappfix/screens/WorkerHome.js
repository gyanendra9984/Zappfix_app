import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SvgXml } from 'react-native-svg'; // Import SvgXml for SVG support
import { Alert } from 'react-native';
import WorkerHistory from '../components/workerHistory';

const pinSvg = `
<svg xmlns="http://www.w3.org/2000/svg" fill="#FF0000" width="20" height="20" viewBox="0 0 24 24">
  <path d="M12 2c-3.313 0-6 2.687-6 6 0 2.232 1.223 4.18 3 5.226v8.774h6v-8.774c1.777-1.046 3-2.994 3-5.226 0-3.313-2.687-6-6-6zm0 2c2.206 0 4 1.794 4 4s-1.794 4-4 4-4-1.794-4-4 1.794-4 4-4z"/>
</svg>
`;


const WorkerHome = ({ navigation }) => {
    // Sample data for user requests
    const userRequests = [
        { id: 1, name: 'John Doe', problem: 'Fix leaking taps', distance:'2 miles away'},
        { id: 2, name: 'Jane Smith', problem: 'Broken flush of toilet', distance:'3 miles away'},
        { id: 3, name: 'Alice Johnson', problem: 'Replacement of wash basin pipe', distance:'4 miles away'},
        { id: 4, name: 'Chris Brown', problem: 'Fixing of water heater', distance:'1 miles away'},
        { id: 5, name: 'Emily Davis', problem: 'Replacement of shower head', distance:'3.5 miles away'},
        { id: 6, name: 'Daniel Miller', problem: 'Fixing of water heater', distance:'2.5 miles away'},
        // Add more requests as needed
    ];

    // Function to handle logout
    const handleLogout = () => {
        // Implement logout functionality here
        // For example, you can clear user token from AsyncStorage or perform any other necessary actions
        // Then navigate back to the authentication screen (e.g., AuthStack)
        navigation.navigate('AuthStack');
    };

    // Function to handle accept button press
    const handleAccept = (id) => {
        Alert.alert(
            'Confirm Acceptance',
            'Are you sure you want to accept this request?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Accept',
                    onPress: () => {
                        // Implement accept logic here
                        console.log('Accepted request with ID:', id);
                    }
                }
            ]
        );
    };

    // Function to handle reject button press
    const handleReject = (id) => {
        Alert.alert(
            'Confirm Rejection',
            'Are you sure you want to reject this request?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Reject',
                    onPress: () => {
                        // Implement reject logic here
                        console.log('Rejected request with ID:', id);
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Text className="mt-16 font-bold text-2xl">Worker Home Screen</Text>

            <Text className="text-gray-400 mb-2 -mt-2">______________________________________________________</Text>

            <Text className="my-1 font-bold text-xl">Pending User Requests</Text>
            <View style={styles.scrollContainer} className="border border-gray-400 rounded-lg p-3">
                <ScrollView style={styles.scrollView}>
                    {userRequests.map(request => (
                        <View key={request.id} style={styles.card} className="border border-gray-300">
                            <Text style={styles.name}>{request.name}</Text>
                            <Text style={styles.problem}>{request.problem}</Text>
                            <View style={styles.distanceContainer}>
                                <SvgXml xml={pinSvg} />
                                <Text style={styles.distance}>{request.distance}</Text>
                            </View>
                            <View style={styles.buttonsContainer}>
                                <TouchableOpacity style={[styles.button, styles.acceptButton]} onPress={() => handleAccept(request.id)}>
                                    <Text style={styles.buttonText}>Accept</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.button, styles.rejectButton]} onPress={() => handleReject(request.id)}>
                                    <Text style={styles.buttonText}>Reject</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </View>

            <Text className="mt-4 font-semibold text-xl">Worker History of Works</Text>
            <ScrollView style={styles.scrollContainer} className="border border-gray-400 -p-2 my-1 rounded-lg">
            <WorkerHistory/>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    scrollContainer: {
        flex: 1,
        width: '100%',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 20,
        marginBottom: 10,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    problem: {
        fontSize: 14,
        marginBottom: 5,
    },
    distanceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    distance: {
        fontSize: 12,
        color: '#666',
        marginLeft: 5,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    acceptButton: {
        backgroundColor: 'green',
    },
    rejectButton: {
        backgroundColor: 'red',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default WorkerHome;
