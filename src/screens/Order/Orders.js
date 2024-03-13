import React, { useContext, useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FIREBASE_DB } from '../../../firebaseConfig';
import { collection, onSnapshot } from "firebase/firestore";
import { UserProfileContext } from '../../context/UserProfileContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Orders = ({ navigation }) => {
    const { user } = useContext(UserProfileContext);

    const [ activeTab, setActiveTab ] = useState('Ongoing');
    const [ currentUser, setCurrentUser ] = useState('');
    const [ pending, setPending ] = useState('');
    const [ ongoing, setOngoing ] = useState('');
    const [ past, setPast ] = useState('');

    const handleTabPress = (tab) => {
        setActiveTab(tab);
    };

    useEffect(() => {
        const userRef = collection(FIREBASE_DB, 'profile');

        const subscriber = onSnapshot(userRef, {
            next: (snapshot) => {
                const cUser = [];

                snapshot.docs.forEach((doc) => {
                    const data = doc.data();
                    if (data.uid === user.uid) {
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
    }, [user.uid]);

    useEffect(() => {
        if (!currentUser) return;

        const orderRef = collection(FIREBASE_DB, 'order');

        const subscriber = onSnapshot(orderRef, {
            next: (snapshot) => {
                const pendingArr = [];
                const ongoingArr = [];
                const pastArr = [];

                snapshot.docs.forEach((doc) => {
                    const data = doc.data();

                    if ((data.retailer_uid === user.uid || data.supplier_uid === user.uid)) {
                        if (data.status === "Pending") {
                            pendingArr.push({
                                id: doc.id,
                                ...doc.data()
                            });
                        } else if (data.status === "Ongoing") {
                            ongoingArr.push({
                                id: doc.id,
                                ...doc.data()
                            });
                        } else {
                            pastArr.push({
                                id: doc.id,
                                ...doc.data()
                            })
                            
                        }
                    }
                });

                setPending(pendingArr);
                setOngoing(ongoingArr);
                setPast(pastArr);
            }
        });
        return () => subscriber();
    }, [currentUser, user.uid]);

    const renderOrder = ({ item }) => {
        if (item.status === "Pending") {
            dateTime = item.reqDate;
            dateString = "Requested on";
            barColor = 'orange';
        } else if (item.status === "Ongoing") {
            dateTime = item.ongDate;
            dateString = "Accepted on";
            barColor = 'green';
        } else if (item.status === "Completed") {
            dateTime = item.pastDate;
            dateString = "Completed on";
            barColor = 'dodgerblue';
        } else {
            dateTime = item.pastDate;
            dateString = "Cancelled on";
            barColor = 'red';
        }

        return(
            <TouchableOpacity 
                style={styles.orderContainer}
                onPress={() => navigation.navigate('OrderDetails', { 
                    item, 
                    user: currentUser
                })}
            >
                <Image source={{ uri: item.image }} style={styles.itemImage} />
                <View style={styles.itemBox}>
                    <View style={styles.itemTopRow}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemCode}>(#{item.code})</Text>
                    </View>
                    <Text style={styles.itemDateTime}>{dateString} {dateTime}</Text>
                    <Text style={styles.itemPrice}>RM {item.total} ({item.quantity} {item.uom})</Text>
                </View>
                <View style={[styles.verticalBar, {backgroundColor: barColor}]}></View>
            </TouchableOpacity>
        );
    };
    
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Orders</Text>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                    style={[styles.button, activeTab === 'Pending' && styles.activeButton]}
                    onPress={() => handleTabPress('Pending')}>
                    <Text style={styles.buttonText}>Pending</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.button, activeTab === 'Ongoing' && styles.activeButton]}
                    onPress={() => handleTabPress('Ongoing')}>
                    <Text style={styles.buttonText}>Ongoing</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.button, activeTab === 'Past' && styles.activeButton]}
                    onPress={() => handleTabPress('Past')}>
                    <Text style={styles.buttonText}>Past</Text>
                </TouchableOpacity>
            </View>

            {activeTab === 'Pending' && (
                pending.length > 0 ? (
                    <FlatList
                        data={pending}
                        keyExtractor={(pending) => pending.id.toString()}
                        renderItem={renderOrder}
                        contentContainerStyle={styles.orderList}
                        showsVerticalScrollIndicator={false}
                    />
                ) : (
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons name={'order-bool-ascending'} size={40} color={'#ccc'}/>
                        <Text style={styles.emptyText}>No pending order</Text>
                    </View>
                )
            )}
            {activeTab === 'Ongoing' && (
                ongoing.length > 0 ? (
                    <FlatList
                        data={ongoing}
                        keyExtractor={(ongoing) => ongoing.id.toString()}
                        renderItem={renderOrder}
                        contentContainerStyle={styles.orderList}
                        showsVerticalScrollIndicator={false}
                    />
                ) : (
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons name={'order-bool-ascending'} size={40} color={'#ccc'}/>
                        <Text style={styles.emptyText}>No ongoing order</Text>
                    </View>
                )
            )}
            {activeTab === 'Past' && (
                past.length > 0 ? (
                    <FlatList
                        data={past}
                        keyExtractor={(past) => past.id.toString()}
                        renderItem={renderOrder}
                        contentContainerStyle={styles.orderList}
                        showsVerticalScrollIndicator={false}
                    />
                ) : (
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons name={'order-bool-ascending'} size={40} color={'#ccc'}/>
                        <Text style={styles.emptyText}>No past order</Text>
                    </View>
                )
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        paddingHorizontal: 20
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 10
    },
    headerTitle: {
        fontSize: 30,
        fontWeight: 'bold'
    },
    buttonContainer: {
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'space-between',
        paddingTop: 20,
        paddingBottom: 15
    },
    buttonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold'
    },
    activeButton: {
        backgroundColor: 'black'
    },
    button: {
        width: '32%',
        height: 30,
        backgroundColor: 'gray',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8
    },
    tabContent: {
        marginTop: 30,
        fontSize: 16,
        textAlign: 'center'
    },
    orderList: {
        marginTop: 20,
        paddingBottom: 40
    },
    orderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
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
    itemTopRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    itemImage: {
        width: 100,
        height: 100,
        resizeMode: 'cover',
    },
    itemName: {
        fontSize: 16,
    },
    itemCode: {
        paddingLeft: 6,
        fontSize: 11,
        color: 'gray'
    },
    itemDateTime: {
        paddingTop: 5,
        fontSize: 13,
        color: '#555',
        paddingBottom: 5
    },
    itemPrice: {
        fontSize: 15,
        color: 'green',
    },
    verticalBar: {
        width: 5,
        height: '100%'
    },
    emptyContainer: {
        height: '60%',
        margin: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        padding: 20,
        color: 'gray'
    },
});

export default Orders;