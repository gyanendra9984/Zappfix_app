import { Text,View,TextInput,searchText,TouchableOpacity,Keyboard,BackHandler } from "react-native";
import { useState,useEffect,useRef } from "react";
import * as Icon from 'react-native-feather';
import { useNavigation } from "@react-navigation/native";
export default  function Search (){
    const [showRecentSearches, setShowRecentSearches] = useState(false);
    const textInputRef = useRef(null);
    const [searchText, setSearchText] = useState('');

  const [recentSearches,setRecentSearches]= useState(['Search 1', 'Search 2', 'Search 3', 'Search 4', 'Search 5']);

  const navigation=useNavigation();

  const handleSearchBarClick = () => {
    setShowRecentSearches(true);
    navigation.navigate("Search");
  };

  const handleSearchTextChange = (text) => {
    setSearchText(text);
    navigation.navigate("Search");

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
      console.log("Back button pressed");
      textInputRef.current.blur();
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
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 4, paddingBottom: 2,marginLeft:30 }}>
  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, backgroundColor: '#edf2f7', padding: 10, borderRadius: 50, borderWidth: 1, borderColor: 'gray',height:40 }}>
    <Icon.Search height={25} width={25} stroke="gray" />
    <TextInput
      ref={textInputRef}
      placeholder="Search"
      style={{ marginLeft: 10, flex: 1 }}
      onFocus={handleSearchBarClick}
      onChangeText={handleSearchTextChange}
      value={searchText}
    />
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 0 }}> 
      <Icon.MapPin height={20} width={20} stroke="gray" />
      <TouchableOpacity onPress={() => navigation.navigate("Map")}>
        <Text style={{ color: 'gray' }}>IIT ROPAR</Text>
      </TouchableOpacity>
     </View>
  </View>
</View>

    );
};