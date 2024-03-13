import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewStyle from '../../utils/MapViewStyle.json';
import { UserLocationContext } from '../../context/UserLocationContext';
import { UserProfileContext } from '../../context/UserProfileContext';
import { Ionicons } from '@expo/vector-icons';

const ShopMapView = ({ route }) => {
  const { detail } = route.params;
  const {user} = useContext(UserProfileContext);
  const {location} = useContext(UserLocationContext);
  const coords = detail.coords;
  
  return location?.latitude&&(
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

      <View style={styles.bottomContainer}>
          <Text style={styles.titleText}>{detail.name}</Text>
          <Text style={styles.addressText}>{detail.address}, {detail.city}, {detail.postcode}, {detail.state}</Text>
          
          <View style={styles.contactContainer}>
            <Text style={[styles.contactText, {fontWeight: '500'}]}>Operating Hour: 08:00 — 18:00</Text>
            <Text style={styles.contactText}>Phone Number: {detail.phone}</Text>
            <Text style={styles.contactText}>Email: {detail.email}</Text>
          </View>
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
    height: 400,
  },
  bottomContainer: {
    padding: 20,
    flex: 1
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingBottom: 5
  },
  addressText: {
    fontSize: 16,
    fontWeight: '500',
    paddingBottom: 30,
  },
  contactContainer: {
    position: 'absolute',
    bottom: 0,
    padding: 20
  },
  contactText: {
    fontSize: 15,
    fontWeight: '400',
    paddingBottom: 5
  }
});

export default ShopMapView;