import { Text,View,TextInput,searchText,TouchableOpacity,Keyboard,BackHandler,ScrollView } from "react-native";
import { useState,useEffect,useRef } from "react";
import * as Icon from 'react-native-feather';
import { useNavigation } from "@react-navigation/native";

export default function RecentSearches(){
    const [showRecentSearches, setShowRecentSearches] = useState(false);

  const [recentSearches,setRecentSearches]= useState(['Search 1', 'Search 2', 'Search 3', 'Search 4', 'Search 5']);

  const handleSearchBarClick = () => {
    setShowRecentSearches(true);
  };

  const handleSearchTextChange = (text) => {
    setSearchText(text);
  };

  const handleRecentSearchClick = (search) => {
    setSearchText(search);
    setShowRecentSearches(false);
  };

  const handleOutsidePress = () => {
    setShowRecentSearches(false);
  };

  const handleBlur = () => {
    setShowRecentSearches(false);
  };

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setShowRecentSearches(false);
    });

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (showRecentSearches) {
        setShowRecentSearches(false);
        return true;
      }
      return false;
    });

    return () => {
      keyboardDidHideListener.remove();
      backHandler.remove();
    };
  }, [showRecentSearches]);
    return(
    <ScrollView style={{ paddingHorizontal: 20 }}>
            {recentSearches.map((search, index) => (
              <TouchableOpacity key={index} onPress={() => handleRecentSearchClick(search)}>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'lightgray' }}>
                  <Icon.Clock height={20} width={20} stroke="gray" style={{ marginRight: 10 }} />
                  <Text style={{ fontSize: 16, color: 'gray' }}>{search}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
    );
};