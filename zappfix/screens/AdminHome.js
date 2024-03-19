import React from 'react'
import { View, Text, StyleSheet, Button } from 'react-native';

const AdminHome = ({ navigation })  => {
    const handleLogout = () => {
        // Implement logout functionality here
        // For example, you can clear user token from AsyncStorage or perform any other necessary actions
        // Then navigate back to the authentication screen (e.g., AuthStack)
        navigation.navigate('AuthStack');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Admin Home</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});

export default AdminHome