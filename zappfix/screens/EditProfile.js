import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlexLayout, TextInput } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; // Example icon library
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AuthContext } from '../context/AuthContext';

const EditProfilePage = ({ profile, onSave, onCancel }) => {
  const [editedProfile, setEditedProfile] = useState({ ...profile });

  const handleSave = () => {
    // Perform any validation or API calls here
    onSave(editedProfile);
  };

  return (
    <View style={styles.editContainer}>
      <Text style={styles.editTitle}>Edit Profile</Text>

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


const styles1 = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  starContainer: {
    flexDirection: 'row', // Arrange stars horizontally
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Align profile details vertically
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileDetails: {
    justifyContent: 'space-between', // Align name and ID vertically
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    writingDirection: 'rtl', // Rotate text sideways (assuming right-to-left language)
  },
  profileId: {
    fontSize: 16,
    color: '#666',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f2f2f2', // Light background for tabs
    borderRadius: 4, // Rounded corners for tabs
  },
  tabText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8, // Adjust spacing between icon and text
  },
  tabContent: {
    flexDirection: 'row',
  },
  tabContentItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
  },
  tabContentText: {
    fontSize: 16,
    color: '#333',
  },});

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

export default EditProfilePage;
