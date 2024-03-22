import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { WebView } from 'react-native-webview';
import {
    Dropdown,
    GroupDropdown,
    MultiselectDropdown,
} from 'sharingan-rn-modal-dropdown';

export const data = [
    {
        value: '1',
        label: 'Salon',
        avatarSource: {
            uri: 'https://img.icons8.com/color/344/circled-user-male-skin-type-5.png',
        },
    },
    {
        value: '2',
        label: 'Barber',
        avatarSource: {
            uri: 'https://img.icons8.com/color/344/circled-user-male-skin-type-5.png',
        },
    },
    {
        value: '3',
        label: 'Painter',
        avatarSource: {
            uri: 'https://img.icons8.com/color/344/circled-user-male-skin-type-5.png',
        },
    },
    {
        value: '4',
        label: 'Home Clean',
        avatarSource: {
            uri: 'https://img.icons8.com/color/344/circled-user-male-skin-type-5.png',
        },
    },
];

const UserProfile = () => { 
    // Sample user data (replace with actual data)
    const user = {
        name: 'John Doe',
        age: 30,
        profession: 'Painter',
        avatarUri: 'https://randomuser.me/api/portraits/men/1.jpg', // Sample avatar image URL
    };

    return (
        <View style={styles.userProfileContainer}>
            <Image source={{ uri: user.avatarUri }} style={styles.avatar} />
            <View style={styles.userInfo}>
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.details}>{user.age} years old</Text>
                <Text style={styles.details}>{user.profession}</Text>
            </View>
        </View>
    );
};

const EditProffDetails = ({ navigation }) => {
    const [valueMS, setValueMS] = useState([]);
    const [pdfUri, setPdfUri] = useState(null);

    const selectPdf = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                copyToCacheDirectory : true,
                multiple: true,
                type: "*/*",
            });
            
            console.log("RESULT : ", result)

            if (result.canceled === false) {
                console.log('Document picked:', result.assets[0].uri)
                setPdfUri(result.assets[0].uri);
            } else {
                console.log('Document picking cancelled');
            }
        } catch (error) {
            console.log('Error picking document:', error);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                <UserProfile />
                <View style={styles.contentContainer}>
                    <Text style={styles.title}>Edit Professional Details</Text>
                    <MultiselectDropdown
                        label="Select Skills"
                        data={data}
                        enableAvatar
                        chipType="outlined"
                        value={valueMS}
                        onChange={setValueMS}
                    />
                    <TouchableOpacity style={styles.uploadButton} onPress={selectPdf}>
                        <Text style={styles.uploadButtonText}>Upload PDF</Text>
                    </TouchableOpacity>
                    {pdfUri && (
                        <View style={styles.pdfContainer}>
                            <Text style={styles.pdfTitle}>PDF Preview:</Text>
                            <WebView
                                source={{ uri: pdfUri }}
                                allowFileAccess
                                style={styles.pdf}
                            />
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

export default EditProffDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentContainer: {
        paddingVertical: 30,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'black',
    },
    uploadButton: {
        backgroundColor: '#2196F3',
        padding: 15,
        borderRadius: 8,
        marginTop: 20,
        alignItems: 'center',
    },
    uploadButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    pdfContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    pdfTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    pdf: {
        width: 300,
        height: 200,
    },
    userProfileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        paddingHorizontal: 20,
        paddingTop: 25
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 20,
    },
    userInfo: {
        flex: 1,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    details: {
        fontSize: 16,
        color: '#888',
    },
});
