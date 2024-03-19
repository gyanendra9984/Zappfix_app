import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const WorkerHome = ({ navigation }) => {
    // Function to handle logout
    const handleLogout = () => {
        // Implement logout functionality here
        // For example, you can clear user token from AsyncStorage or perform any other necessary actions
        // Then navigate back to the authentication screen (e.g., AuthStack)
        navigation.navigate('AuthStack');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>/* AjayBeer has to make Profile Progress Here on top  And Akankshy has to make suerRequest list here */</Text>
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

export default WorkerHome;
