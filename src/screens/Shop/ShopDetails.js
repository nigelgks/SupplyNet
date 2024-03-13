import React, {useEffect, useState} from 'react';
import { View, Text, Image, StyleSheet, ScrollView, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { FIREBASE_DB } from "../../../firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";
import { FontAwesome } from '@expo/vector-icons';

const ShopDetails = ({ route, navigation }) => {
  const { distance, shop, uid } = route.params;
  const [ items, setItems ] = useState([]);
  const [ searchText, setSearchText ] = useState('');

  useEffect(() => {
    const itemRef = collection(FIREBASE_DB, 'products');

    const subscriber = onSnapshot(itemRef, {
        next: (snapshot) => {
            const item = [];
            snapshot.docs.forEach((doc) => {
                const data = doc.data();
                if ((data.uid === shop.uid)) {
                    item.push({
                        id: doc.id,
                        ...doc.data()
                    });
                };
            });

            setItems(item);
        }
    });
    return () => subscriber();
  }, [uid]);

  const renderItem = ({ item }) => {
    return(
      <TouchableOpacity style={styles.itemContainer} onPress={() => navigation.navigate('ItemDetail', { item, shop, uid })}>
        <Image source={{ uri: item.image }} style={styles.itemImage} />
        <View style={styles.itemBox}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemDescription}>{item.category}  |  { item.halal ? 'Halal' : 'Not Halal' }</Text>
          <Text style={styles.itemPrice}>RM {(item.price).toFixed(2)} per {item.unit} {item.uom}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const filteredItems = items.filter((items) =>
    items.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: shop.image }} style={styles.shopImage} />
      <View style={styles.shopNameContainer}>
        <Text style={styles.shopName}>{shop.name}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ShopMap', { detail: shop })}>
          <Text style={styles.locationText}>View location</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}>{distance} km away  |  {shop.city}  |  {shop.type.charAt(0).toUpperCase() + shop.type.slice(1)}</Text>
      </View>
      <TextInput
        style={styles.searchBar}
        placeholder="Search Items"
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
      />
      {filteredItems.length > 0 ? (
        <FlatList
          data={filteredItems}
          renderItem={renderItem}
          keyExtractor={(items) => items.code.toString()}
          contentContainerStyle={styles.itemList}
          scrollEnabled={ false }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <FontAwesome name="shopping-basket" size={60} color="#ccc" />
          <Text style={styles.emptyText}>Nothing to see here...</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  shopImage: {
    width: '100%',
    height: 100,
    borderRadius: 8
  },
  shopNameContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  shopName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  locationText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#00a2ed'
  },
  detailsContainer: {
    marginBottom: 10,
  },
  detailText: {
    fontSize: 14,
    marginBottom: 5,
  },
  searchBar: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    height: 270,
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyText: {
    fontSize: 17,
    fontWeight: '500',
    padding: 20,
    color: 'gray'
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    overflow: 'hidden',
  },
  itemBox: {
    flex: 1,
    paddingHorizontal: 15,
  },
  itemList: {
    flexGrow: 1,
    marginBottom: 20
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  itemName: {
    fontSize: 16,
  },
  itemDescription: {
    fontSize: 14,
    color: '#555',
    paddingBottom: 5
  },
  itemPrice: {
    fontSize: 15,
    color: 'green',
  },
});

export default ShopDetails;
