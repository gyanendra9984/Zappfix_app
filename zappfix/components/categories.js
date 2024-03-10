import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { categories } from '../constants'
import { useState } from 'react'
import { useNavigation } from "@react-navigation/native";

// Helper function to dynamically resolve image names
const resolveImage = (imageName) => {
    switch (imageName) {
        case 'image1': return require('../assets/tp1.jpg');
        case 'image2': return require('../assets/tp2.jpg');
        // Add more cases for other image names
        default: return require('../assets/tp1.jpg');
    }
};

export default function Categories() {
    const [activeCategory, setActiveCategory] = useState(null);
    const navigation = useNavigation();

    return (
        <View style={{ marginTop: 4 }}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 15 }}
            >
                {categories.map((category, index) => {
                    let isActive = category.id === activeCategory;
                    let btnStyle = isActive ? { backgroundColor: 'gray' } : { backgroundColor: 'lightgray' };
                    let textStyle = isActive ? { fontWeight: 'bold', color: 'darkgray' } : { color: 'gray' };

                    // Resolve image source using the helper function
                    const categoryImage = resolveImage(category.image);

                    return (
                        <TouchableOpacity
                            key={index}
                            onPress={() => { navigation.navigate('WorkerInfo') }}
                            style={{ marginRight: 18, alignItems: 'center' }}
                        >
                            <View style={{ ...btnStyle, padding: 0, borderRadius: 30, shadowColor: 'black', shadowOpacity: 0.2, elevation: 2 }}>
                                <Image style={{ width: 75, height: 75 }} source={categoryImage} />
                            </View>
                            <Text style={{ ...textStyle, marginTop: 3 }}>{category.name}</Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
}
