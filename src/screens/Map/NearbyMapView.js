import React, { useRef, useContext, useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewStyle from '../../utils/MapViewStyle.json';
import { UserLocationContext } from '../../context/UserLocationContext';
import { DistanceCalculator } from "../../components/DistanceCalculator";
import { Ionicons } from '@expo/vector-icons';

const NearbyMapView = ({ route, navigation }) => {
  const { retails } = route.params;

  const flatListRef = useRef(null);
  const { location } = useContext(UserLocationContext);
  const [ index, setIndex ] = useState(0);

  const userLat = location?.latitude;
  const userLon = location?.longitude;

  const mapMarkers = () => {
    return retails.map((item, index) => 
    <Marker
      key={item.id}
      index={index}
      coordinate={{ latitude: item.coords.latitude, longitude: item.coords.longitude }}
      onPress={() => {setIndex(index), console.log(index)}}
    >
      <Ionicons name="location-sharp" size={30} color="red" />
    </Marker>
    );
  };

  const renderShop = ({ item }) => {
    const coords = item.coords;
    const distance = DistanceCalculator(userLat, userLon, coords.latitude, coords.longitude).toFixed(0);
    
    return(
        <TouchableOpacity onPress={() => navigation.navigate('ShopDetail', { shop: item, distance: distance })}>
            <View style={styles.productContainer}>
                <Image source={{ uri: item.image }} style={styles.productImage}/>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.shopType}>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</Text>
                <Text style={styles.productDistance}>{distance} km away</Text>
            </View>
        </TouchableOpacity>
    );
  };

  useEffect(()=>{
    scrollToIndex(index);
  },[index]);

  const scrollToIndex=(index)=>{
    flatListRef.current?.scrollToIndex({animated: true, index});
  };

  const getItemLayout=(_, index)=>({
    length: Dimensions.get('window').width,
    offset: Dimensions.get('window').width*index,
    index
  });

  return location?.latitude&&(
      <View style={styles.container}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          customMapStyle={MapViewStyle}
          region={{
            latitude: location?.latitude,
            longitude: location?.longitude,
            latitudeDelta: 0.03,
            longitudeDelta: 0.03
          }}
          showsUserLocation={true}
        > 
          {mapMarkers()}
        </MapView>
        
        <View style={styles.shopContainer}>
          <FlatList
            horizontal
            data={retails}
            keyExtractor={(retails) => retails.id.toString()}
            renderItem={renderShop}
            ref={flatListRef}
            getItemLayout={getItemLayout}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productList}
            pagingEnabled
          />
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  shopContainer: {
    paddingBottom: 35,
    position: 'absolute',
    bottom: 0
  },
  productContainer: {
    margin: 10,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    height: 200
  },
  productList: {
    marginRight: 10
  },
  productImage: {
    width: 370,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 8
  },
  productName: {
    marginTop: 8,
    fontSize: 15,
    fontWeight: 'bold'
  },
  shopType: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '400'
  },
  productDistance: {
    marginTop: 4,
    fontSize: 12,
    color: 'grey'
  }
});

export default NearbyMapView;