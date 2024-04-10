import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Button, Image } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { useNavigation, useIsFocused } from "@react-navigation/native"; // Import useIsFocused hook
// Import the icon.png file
import adminPhoto from '../assets/icon.png';

const AdminHome = ({ route }) => {
    const { adminDetails } = route.params;
    const { API, email, logout } = React.useContext(AuthContext);
    const navigation = useNavigation();
    const isFocused = useIsFocused(); // Use useIsFocused hook

    const handleLogout = () => {
        // Implement logout functionality here
        // For example, you can clear user token from AsyncStorage or perform any other necessary actions
        // Then navigate back to the authentication screen (e.g., AuthStack)
        logout();
        navigation.navigate('AuthStack');
    };

    const fetchSearchResults = async () => { // Remove the query parameter as it is not used
        try {
            if (!isFocused) return; // Return if the screen is not focused
            // navigation.navigate("Loading")
            const response = await fetch(`${API}/dashboard_view`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                throw new Error('Error fetching Admin details');
            }
            const data = await response.json();
            // Handle API response data
            navigation.navigate("Admin DashBoard", { adminDetails: data });
            console.log(data);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    useEffect(() => {
        fetchSearchResults();
    }, [isFocused]); // Add isFocused to the dependency array

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Admin Home</Text>
            {/* Display admin photo */}
            <Image source={adminPhoto} style={styles.photo} />
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Admin Details</Text>
                <Text style={styles.detailText}>Username: user_admin</Text>
                <Text style={styles.detailText}>Email: {email}</Text>
                <Text style={styles.detailText}>Role: Admin</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Worker Statistics</Text>
                <Text style={styles.detailText}>Active Workers: {adminDetails.num_workers}</Text>
                <Text style={styles.detailText}>Pending Approval: {adminDetails.num_workers-adminDetails.num_verified_workers}</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>User Registration Statistics</Text>
                <Text style={styles.detailText}>Registered Users: {adminDetails.num_users}</Text>
                <Text style={styles.detailText}>Services Successfully Delivered: {adminDetails.num_completed_tasks}</Text>
            </View>
            <Button title="Logout" onPress={handleLogout} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    photo: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
    },
    section: {
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 5,
        width: '100%',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    detailText: {
        marginBottom: 5,
    },
});

export default AdminHome;
