import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import moment from 'moment';
import InputSpinner from 'react-native-input-spinner';
import OrderModal from '../../components/OrderModal';
import { FIREBASE_DB } from '../../../firebaseConfig';
import { addDoc, collection, onSnapshot } from "firebase/firestore";

const ItemDetails = ({ navigation, route }) => {
  const { item, shop, uid } = route.params;
  const currentDateTime = moment();

  const [ modalVisible, setModalVisible ] = useState(false);
  const [ quantity, setQuantity ] = useState(item.unit ? 1 : '');
  const [ currentUser, setCurrentUser ] = useState('');
  
  const subtotal = (quantity*item.price).toFixed(2);
  const comFee = (subtotal*0.0015).toFixed(2);
  const tranFee = (subtotal*0.02).toFixed(2);
  const total = ((parseFloat(subtotal) + parseFloat(comFee) + parseFloat(tranFee)).toFixed(2));

  useEffect(() => {
    const shopName = shop.name;
    navigation.setOptions({ title: shopName });
  }, [navigation, shop.name]);

  const handleRequestQuotation = () => {
    console.log('Request quotation for item:', item.name);
  };

  useEffect(() => {
    const shopRef = collection(FIREBASE_DB, 'profile');

    const subscriber = onSnapshot(shopRef, {
        next: (snapshot) => {
            const cUser = [];
            snapshot.docs.forEach((doc) => {
                const data = doc.data();
                if (data.uid === uid) {
                    cUser.push({
                        id: doc.id,
                        ...doc.data()
                    });
                };
            });
            setCurrentUser(cUser);
        }
    });
    
    return () => subscriber();
  }, [uid]);

  const addOrder = async () => {
    const retailer_address = (`${currentUser[0].address}, ${currentUser[0].city}, ${currentUser[0].postcode}, ${currentUser[0].state}`);
    const supplier_address = (`${shop.address}, ${shop.city}, ${shop.postcode}, ${shop.state}`); 
    
    try {
        await addDoc(collection(FIREBASE_DB, 'order'), { 
            supplier_uid: shop.uid,
            retailer_uid: currentUser[0].uid,
            supplier: shop.name,
            retailer: currentUser[0].name,
            image: item.image,
            pid: item.id,
            code: item.code,
            name: item.name,
            supplier_email: shop.email,
            retailer_email: currentUser[0].email,
            supplier_address: supplier_address,
            retailer_address: retailer_address,
            supplier_coords: shop.coords,
            retailer_coords: currentUser[0].coords,
            supplier_phone: shop.phone,
            retailer_phone: currentUser[0].phone,
            quantity: (quantity*item.unit),
            uom: item.uom,
            subtotal: subtotal,
            commission: comFee,
            transaction: tranFee,
            total: total,
            status: 'Pending',
            reqDate: currentDateTime.format('DD MMM HH:mm'),
            ongDate: '',
            pastDate: ''
        });
        alert('Request for quotation (RFQ) has been sent.');
        navigation.navigate('Home');
    } catch (error) {
        console.log(error);
        alert('Sign up failed: ' + error.message);
    };
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: item.image }} style={styles.itemImage}/>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemDetails}>( {item.category}  |  { item.halal ? 'Halal' : 'Not Halal' } )</Text>
      <Text style={styles.itemDescription}>{item.description}</Text>
      <View style={styles.itemNum}>
        <Text style={styles.itemPrice}>RM {(item.price).toFixed(2)} per {item.unit} {item.uom}</Text>
        <Text style={styles.itemStock}>({item.stock} {item.uom} left)</Text>
      </View>
      
      <View style={styles.paymentDetails}>
        <View style={styles.detailRows}>
          <Text style={{fontWeight: '500'}}>Subtotal ({quantity*item.unit} {item.uom})</Text>
          <Text>RM {subtotal}</Text>
        </View>
        <View style={[styles.detailRows, {paddingTop: 3}]}>
          <Text style={{fontWeight: '500'}}>Commision Fee (0.15%)</Text>
          <Text>RM {comFee}</Text>
        </View>
        <View style={[styles.detailRows, {paddingTop: 3}]}>
          <Text style={{fontWeight: '500'}}>Transaction Fee (2%)</Text>
          <Text>RM {tranFee}</Text>
        </View>
        <View style={[styles.detailRows, {paddingTop: 8}]}>
          <Text style={{fontWeight: 'bold', fontSize: 17}}>Total Price</Text>
          <Text style={{fontWeight: '600', fontSize: 17}}>RM {total}</Text>
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <InputSpinner
          max={item.stock/item.unit}
          min={1}
          step={1}
          colorMax={"#f04048"}
          colorMin={"#ccc"}
          value={quantity}
          onChange={(num) => {
            setQuantity(num);
          }}
          style={styles.inputSpinner}
          fontSize={18}
          skin='clean'
        />
        <TouchableOpacity style={styles.requestButton} onPress={() => {handleRequestQuotation, setModalVisible(true)}}>
          <Text style={styles.buttonText}>RFQ</Text>
        </TouchableOpacity>

        <OrderModal
          modalVisible={modalVisible}
          onBackPress={() => {
              setModalVisible(false)
          }}
          onConfirmPress={() => addOrder()}
          onCancelPress={() => setModalVisible(false)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  itemImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 20,
  },
  itemNum: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  itemName: {
    fontSize: 23,
    fontWeight: 'bold'
  },
  itemStock: {
    fontSize: 14,
    fontWeight: '500',
    paddingTop: 10
  },
  itemDetails: {
    paddingTop: 5,
    fontSize: 14
  },
  itemDescription: {
    fontSize: 15,
    paddingTop: 15
  },
  itemPrice: {
    fontSize: 17,
    fontWeight: '500',
    color: 'green',
    paddingTop: 10
  },
  paymentDetails: {
    padding: 10, 
    marginTop: 20, 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 8, 
    alignContent: 'center'
  },
  detailRows: {
    flexDirection: 'row', 
    justifyContent: 'space-between'
  },
  bottomContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    marginBottom: 25,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  inputSpinner: {
    width: '60%',
    fontSize: 15
  },
  requestButton: {
    width: '30%',
    backgroundColor: 'black',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
  },
});

export default ItemDetails;