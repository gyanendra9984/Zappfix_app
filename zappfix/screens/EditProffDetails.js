import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
// import { WebView } from 'react-native-webview';
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

const EditProffDetails = ({ navigation }) => {
    const [valueMS, setValueMS] = useState([]);
    const [pdfUri, setPdfUri] = useState(null);

    const selectPdf = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                copyToCacheDirectory : true,
            });

            if (result.type === 'success') {
                console.log('Document picked:', result.uri)
                setPdfUri(result.uri);
            } else {
                console.log('Document picking cancelled');
            }
        } catch (error) {
            console.log('Error picking document:', error);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <ScrollView>
                <View style={styles.container}>
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
                            {/* <WebView
                                source={{ uri: pdfUri }}
                                style={styles.pdf}
                            /> */}
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
        paddingTop: 30,
        marginLeft: 20,
        marginRight: 20,
        flex: 1,
    },
    uploadButton: {
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
    },
    uploadButtonText: {
        color: 'white',
        textAlign: 'center',
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
});
