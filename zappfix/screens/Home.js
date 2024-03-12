import { View, Text, TextInput, StyleSheet, Image , ScrollView, Button, TouchableOpacity} from 'react-native'
import React, { useContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import * as Icon from 'react-native-feather';
import { useNavigation } from '@react-navigation/native';

import { themeColors } from '../theme';
import Categories from '../components/categories';
import { Divider } from '@rneui/themed';
import { AuthContext } from '../context/AuthContext';


export default function Home() {
  const {logout}=useContext(AuthContext);
  const navigation = useNavigation();

  const handleCardClick = (workerType) => {
    navigation.navigate('WorkerInfo', { workerType });
  };

  return (
    <SafeAreaView className="bg-white">
      <StatusBar barStyle="dark-content" />
      {/* Top  Component Photo and Search Bar*/}
      <View className="flex-row items-center space-x-2 px-4 pb-2">
        <View className="flex-row items-center flex-1 bg-gray-200 p-3 rounded-full border border-gray-300">
          <Icon.Search height="25" width="25" stroke="gray" />
          <TextInput placeholder="Search" className="ml-2 flex-1" />
          <View className="flex-row items-center space-x-1 border-0">
            <Icon.MapPin height="20" widht="20" stroke="gray" />
            <TouchableOpacity onPress={() => navigation.navigate("Map")}>
            <Text className="text-gray-700">IIT ROPAR</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ backgroundColor: themeColors.bgColor(1) }} className="rounded-full" >
          <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Image style={{ width: 50, height: 50 , borderRadius:50}} source={require('../assets/Profile.png')}/>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 70 }}>
      {/*main*/}
      
      <View
        horizontal
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 15 }}
      >
        {/* categories */}
        <Categories />

        {/* <Divider width={2} insetType="left"/> */}
        <Text className='text-2xl mt-5 mx-5'>Featured</Text>
        <View className='flex flex-row justify-around mt-2'>
          {/* <View className='flex flex-col justify-center items-center'>
          <Image className='h-' source={require('../assets/icon.png')} />
          <Text>Hi</Text>
          </View> */}
          <TouchableOpacity onPress={handleCardClick}>
          <View className='flex flex-col justify-center items-center'>
            <Image style={{ width: 100, height: 100 }} source={require('../assets/icon1.jpg')} />
            <Text>Salon</Text>
          </View>
          </TouchableOpacity>
          <View className='flex flex-col justify-center items-center'>
            <Image style={{ width: 100, height: 100 }} source={require('../assets/icon2.jpg')} />
            <Text>Barber</Text>
          </View>
          <View className='flex flex-col justify-center items-center'>
            <Image style={{ width: 100, height: 100 }} source={require('../assets/icon3.jpg')} />
            <Text>AC Service</Text>
          </View>
          {/* <View className='flex flex-col justify-center items-center'>
          <Image style={{ width: 50, height: 50 }} source={require('../assets/icon.png')} />
          <Text>Hi</Text>
          </View> */}
        </View>
        <View className='flex flex-row justify-around mt-2'>
          <TouchableOpacity onPress={handleCardClick}>
          <View className='flex flex-col justify-center items-center'>
            <Image style={{ width: 100, height: 100 }} source={require('../assets/icon4.jpg')} />
            <Text>Home Clean</Text>
          </View>
          </TouchableOpacity>
          <View className='flex flex-col justify-center items-center'>
            <Image style={{ width: 100, height: 100 }} source={require('../assets/icon5.jpg')} />
            <Text>Carpenter</Text>
          </View>
          <View className='flex flex-col justify-center items-center'>
            <Image style={{ width: 100, height: 100 }} source={require('../assets/icon6.jpg')} />
            <Text>Painter</Text>
          </View>
          {/* <View className='flex flex-col justify-center items-center'>
          <Image style={{ width: 50, height: 50 }} source={require('../assets/icon.png')} />
          <Text>Hi</Text>
          </View> */}
        </View>
      </View>


      {/* ------------------------------------- */}

      <Text className='text-2xl mt-5 mx-5'>Top Problems</Text>

      <View className='flex flex-row justify-around mt-2'>
          {/* <View className='flex flex-col justify-center items-center'>
          <Image className='h-' source={require('../assets/icon.png')} />
          <Text>Hi</Text>
          </View> */}
          <View className='flex flex-col justify-center items-center'>
            <Image style={{ width: 100, height: 100 }} source={require('../assets/icon1.jpg')} />
            <Text>Salon</Text>
          </View>
          <View className='flex flex-col justify-center items-center'>
            <Image style={{ width: 100, height: 100 }} source={require('../assets/icon2.jpg')} />
            <Text>Barber</Text>
          </View>
        </View>
        <View className='flex flex-row justify-around mt-2'>
          {/* <View className='flex flex-col justify-center items-center'>
          <Image className='h-' source={require('../assets/icon.png')} />
          <Text>Hi</Text>
          </View> */}
          <View className='flex flex-col justify-center items-center'>
            <Image style={{ width: 100, height: 100 }} source={require('../assets/icon1.jpg')} />
            <Text>Salon</Text>
          </View>
          <View className='flex flex-col justify-center items-center'>
            <Image style={{ width: 100, height: 100 }} source={require('../assets/icon2.jpg')} />
            <Text>Bulb Fix</Text>
          </View>
        </View>
        <View className='flex flex-row justify-around mt-2'>
          {/* <View className='flex flex-col justify-center items-center'>
          <Image className='h-' source={require('../assets/icon.png')} />
          <Text>Hi</Text>
          </View> */}
          <View className='flex flex-col justify-center items-center'>
            <Image style={{ width: 100, height: 100 }} source={require('../assets/icon1.jpg')} />
            <Text>Salon</Text>
          </View>
          <View className='flex flex-col justify-center items-center'>
            <Image style={{ width: 100, height: 100 }} source={require('../assets/icon2.jpg')} />
            <Text>Barber</Text>
          </View>
        </View>
        </ScrollView>
    </SafeAreaView>
  )
}