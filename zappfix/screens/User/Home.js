import { View, Text, TextInput, StyleSheet, Image, ScrollView, Button, TouchableOpacity, TouchableWithoutFeedback, Keyboard, BackHandler } from 'react-native'
import React, { useContext, useState, useEffect, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native';

import Categories from '../../components/categories';
import { AuthContext } from '../../context/AuthContext';


export default function Home() {
  const { logout } = useContext(AuthContext);
  const navigation = useNavigation();

  const handleCardClick = (workerType) => {
    navigation.navigate('WorkerInfo', { workerType });
  };


  return (
    // <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <SafeAreaView className="bg-white">
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
            <Text className='text-2xl mt-8 mx-5'>Featured</Text>
            <View className='flex flex-row justify-around mt-2'>
              <TouchableOpacity onPress={handleCardClick}>
                <View className='flex flex-col justify-center items-left ml-1'>
                  <Image style={{ width: 120, height: 120 }} source={require('../../assets/icon1.jpg')} />
                  <Text className="ml-1">Salon</Text>
                </View>
              </TouchableOpacity>
              <View className='flex flex-col justify-center items-center'>
                <Image style={{ width: 120, height: 120 }} source={require('../../assets/icon2.jpg')} />
                <Text>Barber</Text>
              </View>
              <View className='flex flex-col justify-center items-center mr-1'>
                <Image style={{ width: 120, height: 120 }} source={require('../../assets/icon3.jpg')} />
                <Text>AC Service</Text>
              </View>
            </View>
            <View className='flex flex-row justify-around mt-2'>
              <TouchableOpacity onPress={handleCardClick}>
                <View className='flex flex-col justify-center items-center ml-1'>
                  <Image style={{ width: 120, height: 120 }} source={require('../../assets/icon4.jpg')} />
                  <Text>Home Clean</Text>
                </View>
              </TouchableOpacity>
              <View className='flex flex-col justify-center items-center'>
                <Image style={{ width: 120, height: 120 }} source={require('../../assets/icon5.jpg')} />
                <Text>Carpenter</Text>
              </View>
              <View className='flex flex-col justify-center items-center mr-1'>
                <Image style={{ width: 120, height: 120 }} source={require('../../assets/icon6.jpg')} />
                <Text>Painter</Text>
              </View>
            </View>
          </View>


          {/* ------------------------------------- */}

          <Text className='text-2xl mt-10 mx-5'>Top Problems</Text>

          <View className='flex flex-row justify-around mt-2'>
            <View className='flex flex-col justify-center items-center'>
              <Image style={{ width: 90, height: 90 }} source={require('../../assets/icon5.jpg')} />
              <Text>Salon</Text>
            </View>
            <View className='flex flex-col justify-center items-center'>
              <Image style={{ width: 90, height: 90 }} source={require('../../assets/icon6.jpg')} />
              <Text>Bulb Fix</Text>
            </View>
            <View className='flex flex-col justify-center items-center'>
              <Image style={{ width: 90, height: 90 }} source={require('../../assets/icon1.jpg')} />
              <Text>Salon</Text>
            </View>
            <View className='flex flex-col justify-center items-center'>
              <Image style={{ width: 90, height: 90 }} source={require('../../assets/icon2.jpg')} />
              <Text>Bulb Fix</Text>
            </View>
          </View>
          <View className='flex flex-row justify-around mt-2'>
            <View className='flex flex-col justify-center items-center'>
              <Image style={{ width: 90, height: 90 }} source={require('../../assets/icon1.jpg')} />
              <Text>Salon</Text>
            </View>
            <View className='flex flex-col justify-center items-center'>
              <Image style={{ width: 90, height: 90 }} source={require('../../assets/icon2.jpg')} />
              <Text>Barber</Text>
            </View>
            <View className='flex flex-col justify-center items-center'>
              <Image style={{ width: 90, height: 90 }} source={require('../../assets/icon3.jpg')} />
              <Text>Salon</Text>
            </View>
            <View className='flex flex-col justify-center items-center'>
              <Image style={{ width: 90, height: 90 }} source={require('../../assets/icon4.jpg')} />
              <Text>Barber</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
  )
}