import React, { useContext } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewStyle from '../../utils/MapViewStyle.json';
import { Ionicons } from '@expo/vector-icons';

const ShopMapView = ({ route }) => {
  const { detail } = route.params;
  const coords = detail.coords;
  
  return(
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        customMapStyle={MapViewStyle}
        region={{
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.008,
          longitudeDelta: 0.0079
        }}
        showsUserLocation={true}
      >
        <Marker
          coordinate={{
            latitude: coords.latitude,
            longitude: coords.longitude
          }}
        >
          <Ionicons name="location-sharp" size={30} color="red" />
        </Marker>
      </MapView>

      <ScrollView contentContainerStyle={styles.bottomContainer}>
          <Text style={styles.titleText}>{detail.name}</Text>
          <Text style={styles.addressText}>{detail.address}, {detail.city}, {detail.postcode}, {detail.state}</Text>
          
          <View style={styles.contactContainer}>
            <Text style={[styles.contactText, {fontWeight: '500'}]}>Operating Hour: 08:00 — 18:00</Text>
            <Text style={styles.contactText}>Phone Number: {detail.phone}</Text>
            <Text style={styles.contactText}>Email: {detail.email}</Text>
          </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '70%',
  },
  bottomContainer: {
    padding: 20
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingBottom: 5
  },
  addressText: {
    fontSize: 16,
    fontWeight: '500',
    paddingBottom: 20,
  },
  contactContainer: {
    paddingTop: 5
  },
  contactText: {
    fontSize: 15,
    fontWeight: '400',
    paddingBottom: 5
  }
});

export default ShopMapView;