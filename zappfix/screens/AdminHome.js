import React from 'react';
import { View, Text, StyleSheet, Button, Image } from 'react-native';

// Import the icon.png file
import adminPhoto from '../assets/icon.png';

const AdminHome = ({ navigation }) => {
    const handleLogout = () => {
        // Implement logout functionality here
        // For example, you can clear user token from AsyncStorage or perform any other necessary actions
        // Then navigate back to the authentication screen (e.g., AuthStack)
        navigation.navigate('AuthStack');
    };

    // Dummy data for demonstration
    const adminDetails = {
        username: 'admin_user',
        email: 'admin@example.com',
        role: 'Admin',
        joinDate: '2024-03-19',
    };
    const workerStats = {
        activeWorkers: 25,
        pendingApproval: 5,
    };
    const userStats = {
        registeredUsers: 100,
        rejectedUsers: 10,
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Admin Home</Text>
            {/* Display admin photo */}
            <Image source={adminPhoto} style={styles.photo} />
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Admin Details</Text>
                <Text style={styles.detailText}>Username: {adminDetails.username}</Text>
                <Text style={styles.detailText}>Email: {adminDetails.email}</Text>
                <Text style={styles.detailText}>Role: {adminDetails.role}</Text>
                <Text style={styles.detailText}>Join Date: {adminDetails.joinDate}</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Worker Statistics</Text>
                <Text style={styles.detailText}>Active Workers: {workerStats.activeWorkers}</Text>
                <Text style={styles.detailText}>Pending Approval: {workerStats.pendingApproval}</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>User Registration Statistics</Text>
                <Text style={styles.detailText}>Registered Users: {userStats.registeredUsers}</Text>
                <Text style={styles.detailText}>Rejected Users: {userStats.rejectedUsers}</Text>
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
