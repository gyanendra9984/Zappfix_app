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

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    //photo: require('./assets/dummy-profile.png'), // Replace with your dummy image path
    photo: require('../assets/icon6.jpg'),
    name: 'Gopal Bansal',
    id: '123456',
    rating: 4, // Dummy rating
  });
  const {logout}=useContext(AuthContext);



  const handleEditProfile = () => {
    // Implement your logic for handling "Edit Profile" button press
    console.log('Edit Profile button pressed');
    setIsEditing(true);
  };

  const handleSaveProfile = (editedProfile) => {
    // Handle saving the edited profile data, e.g., make API calls
    // Update the state with the edited profile
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleLogout = () => {
    // Implement your logic for handling "Logout" button press
    console.log('Logout button pressed');
  };

  const user = {
    firstName: 'Gopal',
    lastName: 'Bansal',
    phoneNumber: '9914089948',
    email: '2021csb1089@iitrpr.ac.in',
    age: 21,
    gender: 'Male',
    address: '19 Gurdarshan Nagar',
    city: 'Patiala',
    state: 'Punjab',
    zipCode: '147001',
    profilePhoto: 'https://example.com/profile-photo.jpg', // Replace with the actual URL of the profile photo
  };

  return (
    // <View style={styles.container}>
    //   <View style={styles.profileInfo} className='mt-[50px] flex items-center'>
    //     <Image source={profile.photo} style={styles.profileImage} />
    //     <View style={styles.profileDetails} className='flex flex-col justify-center items-center mt-4'>
    //       <Text style={styles.profileName}>{profile.name}</Text>
    //       <Text style={styles.profileId}>ID: {profile.id}</Text>
    //     </View>
    //   </View>
    //   <View style={styles.tabsContainer}>        
    //     <TouchableOpacity style={styles.tab}>
    //       <MaterialCommunityIcons name="account-edit" size={24} color="black" />
    //       <Text style={styles.tabText}>Edit Profile</Text>
    //     </TouchableOpacity>
    //   </View>
    //   <View style={styles.tabContent}>
    //     <View style={styles.tabContentItem}>
    //       <MaterialCommunityIcons name="clock-history" size={24} color="black" />
    //       <Text style={styles.tabContentText}>Previous History</Text>
    //     </View>
    //     <View style={styles.tabContentItem}>
    //       {displayRatingStars(profile.rating)}
    //       <Text style={styles.tabContentText}>Rating: {profile.rating}</Text>
    //     </View>
    //   </View>
    // </View>
    <View style={styles.container}>
    {isEditing ? (
      <EditProfilePage profile={profile} onSave={handleSaveProfile} onCancel={handleCancelEdit} />
    ) : (
      <View>
    {/* <View style={styles.header}> */}
      {/* <Image source={profile.photo} style={styles.profileImage} />
      <Text style={styles.name}>{`${user.firstName} ${user.lastName}`}</Text> */}
      <View style={styles1.profileInfo} className='mt-[-15px] flex items-center'>
        <Image source={require('../assets/Profile.png')} style={styles1.profileImage} />
         <View style={styles1.profileDetails} className='flex flex-col justify-center items-center mt-4'>
           <Text style={styles1.profileName}>{profile.name}</Text>
           <Text style={styles.profileId}>ID: {profile.id}</Text>
         </View>
       </View>

    {/* </View> */}

    <View style={styles.card}>
      <Text style={styles.cardTitle}>Contact Information</Text>
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Icon name="phone" size={20} color="#555" />
          <Text>{` ${user.phoneNumber}`}</Text>
        </View>
        <View style={styles.infoItem}>
          <Icon name="email" size={20} color="#555" />
          <Text>{` ${user.email}`}</Text>
        </View>
      </View>
    </View>

    <View style={styles.card}>
      <Text style={styles.cardTitle}>Personal Information</Text>
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Icon name="person" size={20} color="#555" />
          <Text>{` ${user.age} years old`}</Text>
        </View>
        <View style={styles.infoItem}>
          <Icon name="wc" size={20} color="#555" />
          <Text>{` ${user.gender}`}</Text>
        </View>
      </View>
    </View>

    <View style={styles.card}>
      <Text style={styles.cardTitle}>Address</Text>
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Icon name="location-on" size={20} color="#555" />
          <Text>{` ${user.address}, ${user.city}, ${user.state} ${user.zipCode}`}</Text>
        </View>
      </View>
    </View>

    <View style={styles.card}>
      <Text style={styles.cardTitle}>Rating</Text>
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
        <View style={styles1.tabContent}>          
        <View style={styles1.tabContentItem}>
          {displayRatingStars(profile.rating)}
          <Text style={styles1.tabContentText}>Rating: {profile.rating}</Text>
        </View>
      </View>
        </View>
      </View>
    </View>

    <View style={styles.bottomButtons}>
      <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
        <Icon name="edit" size={20} color="#fff" />
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, { backgroundColor: '#FF5733' }]} onPress={logout}>
        <Icon name="exit-to-app" size={20} color="#fff" />
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>  
      </View>
    )}
  </View>
  );
};

const displayRatingStars = (rating) => {
  const fullStars = Math.floor(rating);
  const decimalPart = rating - fullStars;

  const stars = [];
  for (let i = 0; i < fullStars; i++) {
    stars.push(<MaterialCommunityIcons key={i} name="star" size={24} color="gold" />);
  }

  // if (decimalPart > 0) {
  //   const starWidth = 24; // Adjust based on your star icon size
  //   const starHeight = 24; // Adjust based on your star icon size
  //   const partialStarWidth = Math.round(decimalPart * starWidth);

  //   stars.push(
  //     <View key={fullStars} style={{ width: starWidth, height: starHeight, overflow: 'hidden' }}>
  //       <MaterialCommunityIcons name="star" size={starWidth} color="gold" />
  //       <View style={{ width: partialStarWidth, backgroundColor: '#ccc' }} /> // Gray out the remaining portion
  //     </View>
  //   );
  // }

  if (decimalPart > 0) {
    stars.push(<MaterialCommunityIcons key={fullStars} name="star-half" size={24} color="gold" />);
  }

  return (
    <View style={styles1.starContainer}>
      {stars}
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

export default Profile;
