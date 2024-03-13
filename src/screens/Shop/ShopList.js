import React, { useContext, useState } from 'react';
import { View, Text, FlatList, Image, ImageBackground, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { UserLocationContext } from '../../context/UserLocationContext';
import DistanceCalculator from '../../components/DistanceCalculator';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

const ShopList = ({ route, navigation }) => {
  const { retails, uid } = route.params;
  const { location } = useContext(UserLocationContext);
  const [ searchText, setSearchText ] = useState('');
  const userLat = location?.latitude
  const userLon = location?.longitude

  const renderRetails = ({ item }) => {
    const coords = item.coords;
    const distance = DistanceCalculator(userLat, userLon, coords.latitude, coords.longitude).toFixed(0)
    
    return(
      <TouchableOpacity onPress={() => navigation.navigate('ShopDetail', { shop: item, distance, uid })}>
        <View style={styles.productContainer}>
          <Image source={{ uri: item.image }} style={styles.productImage}/>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productDistance}>{distance} km away</Text>
        </View>
      </TouchableOpacity>
    )
  }

  const filteredProducts = retails.filter((retails) =>
    retails.name.toLowerCase().includes(searchText.toLowerCase())
  )

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity style={{paddingRight: 20, paddingTop: 8}} onPress={() => navigation.navigate('Home')}>
              <Ionicons name="arrow-back" size={25} color="black" />
            </TouchableOpacity>
            <Text  style={styles.title}>
              Shopping
            </Text>
          </View>

          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity style={{paddingRight: 20, paddingBottom: 7}}>
                <MaterialIcons name="favorite-border" size={30} color="black"/>
            </TouchableOpacity>
            <TouchableOpacity>
                <AntDesign name="shoppingcart" size={30} color="black"/>
            </TouchableOpacity>
          </View>
        </View>

        <TextInput
          style={styles.searchInput}
          placeholder="Search here..."
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
        />
      </View>
      
      <View style={styles.userButton}>
          <TouchableOpacity onPress={() => navigation.navigate('NearbyMap', { retails })}>
              <ImageBackground
                  source={require('../../../assets/map.jpg')}
                  style={styles.imageLayout}
                  imageStyle={{borderRadius: 8}}
              >
                  <View style={styles.viewMapBox}>
                      <Text style={styles.mapText}>View on map</Text> 
                  </View>
              </ImageBackground>
          </TouchableOpacity>

          <TouchableOpacity>
            <AntDesign name="filter" size={30} color="black" />
          </TouchableOpacity>
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(retails) => retails.id.toString()}
        renderItem={renderRetails}
        contentContainerStyle={styles.productList}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    flex: 1
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10
  },
  headerContainer: {
    paddingHorizontal: 20
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 8,
    paddingLeft: 8,
    borderRadius: 8
  },
  imageLayout: {
    height: 50,
    width: 325,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  userButton: {
      paddingHorizontal: 20,
      paddingTop: 10,
      paddingBottom: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
  },
  mapText: {
      fontSize: 12,
      fontWeight: '700',
      color: 'white',
      alignContent: 'center',
      margin: 5,
      paddingHorizontal: 8
  },
  viewMapBox: {
      backgroundColor: 'black',
      borderRadius: 8
  },
  productList: {
    paddingHorizontal: 20,
    marginTop: 15,
    paddingBottom: 15
  },
  productContainer: {
    marginBottom: 15
  },
  productImage: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
    borderRadius: 8
  },
  productName: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: 'bold'
  },
  productDistance: {
    marginTop: 4,
    fontSize: 13,
    color: 'grey'
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    alignSelf: 'auto',
    paddingBottom: 15,
    color: 'black'
  }
})

export default ShopList
