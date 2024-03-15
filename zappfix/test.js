import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker for image selection
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; // Example icon library
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AuthContext } from '../context/AuthContext';

const EditProfilePage = ({ profile, onSave, onCancel }) => {
  const [editedProfile, setEditedProfile] = useState({ ...profile });
  const [image, setImage] = useState(null); // State to store the selected image

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to choose an image.');
        }
      }
    })();
  }, []);

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3], // Optional: Set aspect ratio for cropping
      quality: 1, // Optional: Adjust image quality (0-1)
    });

    if (!result.cancelled) {
      setImage(result.uri);
      setEditedProfile({ ...editedProfile, photo: result.uri }); // Update editedProfile with new image URI
    }
  };

  const handleSave = () => {
    // Perform any validation or API calls here, considering the updated photo in editedProfile
    onSave(editedProfile);
  };

  return (
    <View style={styles.editContainer}>
      <Text style={styles.editTitle}>Edit Profile</Text>

      <View style={styles.editImageContainer}>
        <TouchableOpacity onPress={handlePickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.profileImage} />
          ) : (
            profile.photo ? ( // Check if a profile photo exists
              <Image source={{ uri: profile.photo }} style={styles.profileImage} />
            ) : (
              <MaterialCommunityIcons name="account-image" size={80} color="gray" /> // Placeholder icon
            ))};
        </TouchableOpacity>
      </View>

      <View style={styles.editInfoContainer}>
        <Text style={styles.editLabel}>Name:</Text>
        <TextInput
          style={styles.editInput}
          value={editedProfile.name}
          onChangeText={(text) => setEditedProfile({ ...editedProfile, name: text })}
        />
      </View>

      {/* Add other editable fields similarly based on your profile structure */}

      <View style={styles.editButtons}>
        <TouchableOpacity style={styles.editButton} onPress={handleSave}>
          <Text style={styles.editButtonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.editButton} onPress={onCancel}>
          <Text style={styles.editButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Profile = () => {
  const [profile, setProfile] = useState({
    // ... your profile data
  });
  const { logout } = useContext(AuthContext);

  const handleSaveProfile = (editedProfile) => {
    // Handle saving the edited profile data, e.g., make API calls
    // Update the state with the edited profile
    setProfile(editedProfile);
  };

  const handleCancelEdit = () => {
    // ...
  };

  return (
    <View style={styles.container}>
      <EditProfilePage profile={profile} onSave={handleSaveProfile} onCancel={handleCancelEdit} />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
      },
      header: {
        alignItems: 'center',
        marginBottom: 20,
      },
      profileImage: {
            width: 80,
            height: 80,
            borderRadius: 40,
            marginRight: 16,
          },
      name: {
        fontSize: 20,
        fontWeight: 'bold',
      },
      card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
        elevation: 3,
      },
      cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      infoContainer: {
        flexDirection: 'column',
      },
      infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
      },
      bottomButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      button: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#3498db',
        borderRadius: 5,
        padding: 10,
        marginHorizontal: 5,
      },
      buttonText: {
        color: '#fff',
        marginLeft: 5,
      },
      editContainer: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
      },
      editTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
      },
      editInfoContainer: {
        marginBottom: 16,
      },
      editLabel: {
        fontSize: 16,
        marginBottom: 8,
      },
      editInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        padding: 8,
      },
      editButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
      },
      editButton: {
        flex: 1,
        backgroundColor: '#3498db',
        borderRadius: 5,
        padding: 10,
        marginHorizontal: 5,
      },
      editButtonText: {
        color: '#fff',
        textAlign: 'center',
      },
});