import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const EditProffDetails = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [profession, setProfession] = useState('');

    const handleSave = () => {
        // Implement save functionality here
        // For example, you can update user's profile details in the database
        // After saving, navigate back to the previous screen
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Name:</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
            />
            <Text style={styles.label}>Email:</Text>
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
            />
            <Text style={styles.label}>Profession:</Text>
            <TextInput
                style={styles.input}
                value={profession}
                onChangeText={setProfession}
                placeholder="Enter your profession"
            />
            <Button title="Save" onPress={handleSave} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
    },
});

export default EditProffDetails;
