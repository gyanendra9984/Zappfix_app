import { View, Text, TextInput, Image,StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import * as Icon from 'react-native-feather';
import { themeColors } from '../theme';
// import { ScrollView } from 'react-native-gesture-handler';
import Categories from '../components/categories';
import ProfileImage from '../assets/Profile.png'; // Adjust the path accordingly

// import FeaturedRow from '../components/featuredRow';
export default function Home() {
  return (
    <SafeAreaView className="bg-white">
      <StatusBar barStyle="dark-content" />
      {/* search bar*/}
      <View className="flex-row items-center space-x-2 px-4 pb-2">
        <View className="flex-row items-center flex-1 bg-gray-200 p-3 rounded-full border border-gray-300">
          <Icon.Search height="25" width="25" stroke="gray"/>
          <TextInput placeholder="Search" className="ml-2 flex-1" />
          <View className="flex-row items-center space-x-1 border-0">
            <Icon.MapPin height="20" widht="20" stroke="gray"/>
            <Text className="text-gray-700">Delhi</Text>
          </View>
        </View>
        <View style={{backgroundColor: themeColors.bgColor(1)}} className=" rounded-full">
          {/* <Icon.Sliders height="20" width="20" stroke="white" strokeWidth={2.5}/> */}
          <Image source={ProfileImage} style={{ width: 50, height: 50,borderRadius:50 }} strokeWidth={2.5} />
        </View>
      </View>

      {/*main*/ }
      <View 
        horizontal
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 15}}
      >
        {/* categories */}
        <Categories/>

        {/* Featured */}
        {/*<View className="mt-5">
          {
            [featured, featured, featured].map((item,index)=>
            return(
              <FeaturedRow
                key={index}
                title = {item.title}
                restaurants={item.restaurants}
                description={item.description}
              />
            ))
          }
        </View>*/}

      </View>

    </SafeAreaView>
  )
}

