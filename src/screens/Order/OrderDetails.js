import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import moment from 'moment';
import AcceptModal from '../../components/AcceptModal';
import CompletedModal from '../../components/CompletedModal';
import CancelModal from '../../components/CancelModal';
import RejectModal from '../../components/RejectModal';
import { Feather } from '@expo/vector-icons';
import { FIREBASE_DB } from '../../../firebaseConfig';
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";

const OrderDetails = ({ navigation, route }) => {
    const { item, user } = route.params;
    const currentDateTime = moment();

    const [ dateTime, setDateTime ] = useState('')
    const [ dateString, setDateString ] = useState('')
    const [ barColor, setBarColor ] = useState('black')
    const [ acceptModalVisible, setAcceptModalVisible ] = useState(false);
    const [ completeModalVisible, setCompleteModalVisible ] = useState(false);
    const [ cancelModalVisible, setCancelModalVisible ] = useState(false);
    const [ rejectModalVisible, setRejectModalVisible ] = useState(false);

    useEffect(() => {
        navigation.setOptions({ title: item.name });

        if (item.status === "Pending") {
          setDateTime(item.reqDate);
          setDateString("Requested on");
          setBarColor('orange');
        } else if (item.status === "Ongoing") {
          setDateTime(item.ongDate);
          setDateString("Accepted on");
          setBarColor('green');
        } else if (item.status === "Completed") {
          setDateTime(item.pastDate);
          setDateString("Completed on");
          setBarColor('dodgerblue');
        } else {
          setDateTime(item.pastDate);
          setDateString("Cancelled on");
          setBarColor('red');
        }

    }, [navigation, item.name, item.status]);

    const orderRef = doc(FIREBASE_DB, `order/${item.id}`);
    const itemRef = doc(FIREBASE_DB, `products/${item.pid}`);

    const addItem = async () => {
      await addDoc(collection(FIREBASE_DB, 'products'), { 
        image: '',
        name: item.name,
        code: item.code,
        category: '',
        description: '',
        halal: '',
        stock: item.quantity.toString(),
        unit: '',
        uom: item.uom,
        price: '',
        limit: '',
        uid: item.retailer_uid
      })
    };

    const updateItem = async () => {
      const docSnapshot = await getDoc(itemRef);
      const stock = docSnapshot.data().stock;
      const stockLeft = stock - item.quantity;

      await updateDoc(itemRef, {
        stock: stockLeft.toString()
      });
    };

    const updateOrder = async (msg) => {
      const dateTime = currentDateTime.format('DD MMM HH:mm');

      if (msg === "Ongoing") {
        await updateDoc(orderRef, {
          status: msg,
          ongDate: dateTime
        });
      } else if (msg === "Cancelled") {
        await updateDoc(orderRef, {
          status: msg,
          pastDate: dateTime
        });
      } else {
        await updateDoc(orderRef, {
          status: msg,
          pastDate: dateTime
        });
        updateItem();
        addItem();
      }

      navigation.navigate('Orders');
    };

    return (
        <View style={styles.container}>
            <Image source={{ uri: item.image }} style={styles.itemImage}/>
            <Text style={styles.itemID}>Order #{item.id}</Text>
            <Text style={styles.itemCode}>Product code: {item.code}</Text>
            <Text style={styles.itemDate}>{dateString} {dateTime}</Text>
            
            {user[0].type === "retailer" ? (
                <View style={styles.itemLocation}>
                    <View style={{width: '85%'}}>
                        <Text style={styles.itemOrigin}>Order from</Text>
                        <Text style={styles.itemName}>{item.supplier}</Text>
                        <Text style={styles.itemAddress}>{item.supplier_address}</Text>
                    </View>
                    <TouchableOpacity style={styles.mapButton} onPress={() => {}}>
                        <Feather name="map" size={20} color="black"/>
                    </TouchableOpacity>
                </View>
            ) : (   
                <View style={styles.itemLocation}>
                    <View style={{width: '85%'}}>
                        <Text style={styles.itemOrigin}>Order by</Text>
                        <Text style={styles.itemName}>{item.retailer}</Text>
                        <Text style={styles.itemAddress}>{item.retailer_address}</Text>
                    </View>
                    <TouchableOpacity style={styles.mapButton} onPress={() => {}}>
                        <Feather name="map" size={20} color="black"/>
                    </TouchableOpacity>
                </View>
            )}

            <Text style={[styles.itemStatusBox, {backgroundColor: barColor}]}>{item.status}</Text>
            
            <View style={styles.paymentDetails}>
                <View style={styles.detailRows}>
                    <Text style={{fontWeight: '500'}}>Subtotal ({item.quantity} {item.uom})</Text>
                    <Text>RM {item.subtotal}</Text>
                </View>
                <View style={[styles.detailRows, {paddingTop: 3}]}>
                    <Text style={{fontWeight: '500'}}>Commision Fee (0.15%)</Text>
                    <Text>RM {item.commission}</Text>
                </View>
                <View style={[styles.detailRows, {paddingTop: 3}]}>
                    <Text style={{fontWeight: '500'}}>Transaction Fee (2%)</Text>
                    <Text>RM {item.transaction}</Text>
                </View>
                <View style={[styles.detailRows, {paddingTop: 8}]}>
                    <Text style={{fontWeight: 'bold', fontSize: 17}}>Total Price</Text>
                    <Text style={{fontWeight: '600', fontSize: 17}}>RM {item.total}</Text>
                </View>
            </View>

            <CancelModal
              modalVisible={cancelModalVisible}
              onBackPress={() => {
                setCancelModalVisible(false)
              }}
              onConfirmPress={() => updateOrder("Cancelled")}
              onCancelPress={() => setCancelModalVisible(false)}
            />
            <CompletedModal
              modalVisible={completeModalVisible}
              onBackPress={() => {
                setCompleteModalVisible(false)
              }}
              onConfirmPress={() => updateOrder("Completed")}
              onCancelPress={() => setCompleteModalVisible(false)}
            />

            {user[0].type === "retailer" ? (
              (item.status !== "Cancelled" && item.status !== "Completed") ? (
                item.status === "Pending" ? (
                  <View style={styles.bottomContainer}>
                    <TouchableOpacity style={[styles.bottomButton, {backgroundColor: 'black', width: '100%'}]} onPress={() => {setCancelModalVisible(true)}}>
                      <Text style={styles.buttonText}>Cancel order</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.bottomContainer}>
                    <TouchableOpacity style={[styles.bottomButton, {backgroundColor: 'black', width: '49%'}]} onPress={() => {setCancelModalVisible(true)}}>
                      <Text style={styles.buttonText}>Cancel order</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.bottomButton, {backgroundColor: 'green', width: '49%'}]} onPress={() => {setCompleteModalVisible(true)}}>
                      <Text style={styles.buttonText}>Complete order</Text>
                    </TouchableOpacity>
                  </View>
                )
              ) : (
                <View style={styles.bottomContainer}>
                  <TouchableOpacity style={[styles.bottomButton, {backgroundColor: 'black', width: '100%'}]} onPress={() => {}}>
                    <Text style={styles.buttonText}>Order again</Text>
                  </TouchableOpacity>
                </View>
              )
            ) : (
              item.status === "Pending" ? (
                <View style={styles.bottomContainer}>
                  <RejectModal
                    modalVisible={rejectModalVisible}
                    onBackPress={() => {
                      setRejectModalVisible(false)
                    }}
                    onConfirmPress={() => updateOrder("Cancelled")}
                    onCancelPress={() => setRejectModalVisible(false)}
                  />
                  <AcceptModal
                    modalVisible={acceptModalVisible}
                    onBackPress={() => {
                      setAcceptModalVisible(false)
                    }}
                    onConfirmPress={() => updateOrder("Ongoing")}
                    onCancelPress={() => setAcceptModalVisible(false)}
                  />
                  <TouchableOpacity style={[styles.bottomButton, {backgroundColor: 'black', width: '49%',}]} onPress={() => {setRejectModalVisible(true)}}>
                    <Text style={styles.buttonText}>Reject order</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.bottomButton, {backgroundColor: 'green', width: '49%',}]} onPress={() => {setAcceptModalVisible(true)}}>
                    <Text style={styles.buttonText}>Accept order</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                item.status === "Ongoing" ? (
                  <View style={styles.bottomContainer}>
                    <TouchableOpacity style={[styles.bottomButton, {backgroundColor: 'black', width: '100%'}]} onPress={() => {setCancelModalVisible(true)}}>
                      <Text style={styles.buttonText}>Cancel order</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  null
                )
              )
            )}
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
        height: 150,
        resizeMode: 'cover',
        marginBottom: 20,
      },
      itemID: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingRight: 10
      },
      itemCode: {
        fontSize: 15,
        fontWeight: '500',
        paddingTop: 4
      },
      itemDate: {
        fontSize: 14,
        fontWeight: '300',
        paddingTop: 3
      },
      itemLocation: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 20,
        paddingBottom: 15
      },
      itemOrigin: {
        fontSize: 13,
        fontWeight: '400',
        paddingBottom: 4
      },
      itemName: {
        fontSize: 17,
        fontWeight: '600',
        paddingBottom: 2
      },
      itemAddress: {
        fontSize: 15,
        fontWeight: '500'
      },
      mapButton: {
        borderRadius: 8,
        borderColor: 'black',
        borderWidth: 1,
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
        width: 40
      },
      itemStatusBox: {
        marginTop: 15,
        fontSize: 15,
        fontWeight: '900',
        paddingVertical: 8,
        borderRadius: 8,
        width: '100%',
        textAlign: 'center'
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
      bottomButton: {
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

export default OrderDetails;