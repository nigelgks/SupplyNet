import React, { useContext, useEffect, useState } from "react";
import { FlatList, Image, ImageBackground, View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { UserProfileContext } from "../../context/UserProfileContext";
import { UserLocationContext } from "../../context/UserLocationContext";
import { DistanceCalculator } from "../../components/DistanceCalculator";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { FIREBASE_AUTH } from "../../../firebaseConfig";
import { FIREBASE_DB } from "../../../firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";

const Home = ({ navigation }) => {
    const { user } = useContext(UserProfileContext);
    const { location } = useContext(UserLocationContext);

    const [ type, setType ] = useState('');
    const [ retails, setRetails ] = useState('');
    const [ pending, setPending ] = useState('');
    const [ currentUser, setCurrentUser ] = useState('');

    const userLat = location?.latitude
    const userLon = location?.longitude

    const handleLogout = () => {
        FIREBASE_AUTH.signOut();
    };

    const renderRetails = ({ item }) => {
        const coords = item.coords;
        const distance = DistanceCalculator(userLat, userLon, coords.latitude, coords.longitude).toFixed(0);
        
        return(
            <TouchableOpacity onPress={() => navigation.navigate('ShopDetail', { shop: item, distance, uid: user.uid })}>
                <View style={styles.productContainer}>
                    <Image source={{ uri: item.image }} style={styles.productImage}/>
                    <Text style={styles.productName}>{item.name}</Text>
                    <Text style={styles.productDistance}>{distance} km away</Text>
                </View>
            </TouchableOpacity>
        );
    };

    useEffect(() => {
        if (currentUser.length > 0) {
            setType(currentUser[0].type);
        } else {
            return;
        }
    }, [currentUser]);

    useEffect(() => {
        const shopRef = collection(FIREBASE_DB, 'profile');

        const subscriber = onSnapshot(shopRef, {
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
        if (currentUser.length > 0) {
            const shopRef = collection(FIREBASE_DB, 'profile');

            const subscriber = onSnapshot(shopRef, {
                next: (snapshot) => {
                    const items = [];
                    snapshot.docs.forEach((doc) => {
                        const data = doc.data();
                        if ((currentUser[0].type === 'retailer') && ((data.uid !== user.uid) || (data.type === 'supplier'))) {
                            items.push({
                                id: doc.id,
                                ...doc.data()
                            });
                        };
                    });
                    setRetails(items);
                }
            });
            
            return () => subscriber();
        } else {
            return;
        };
    }, [currentUser, user.uid]);

    useEffect(() => {
        if (currentUser.length > 0) {
            const orderRef = collection(FIREBASE_DB, 'order');

            const subscriber = onSnapshot(orderRef, {
                next: (snapshot) => {
                    const pendingArr = [];
    
                    snapshot.docs.forEach((doc) => {
                        const data = doc.data();
    
                        if ((data.retailer_uid === user.uid || data.supplier_uid === user.uid) && data.status === "Pending") {
                            pendingArr.push({
                                id: doc.id,
                                ...doc.data()
                            });
                        }
                    });
    
                    setPending(pendingArr);
                }
            });
            return () => subscriber();
        } else {
            return;
        };
    }, [currentUser, user.uid]);

    const renderOrder = ({ item }) => {
        return(
            <TouchableOpacity
                style={styles.orderContainer}
                onPress={() => navigation.navigate('OrderDetails', {
                    item,
                    user: currentUser
                })}
            >
                <Image source={{ uri: item.image }} style={styles.itemImage}/>
                <View style={styles.itemBox}>
                    <View style={styles.itemTopRow}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemCode}>(#{item.code})</Text>
                    </View>
                    <Text style={styles.itemDateTime}>Requested on {item.reqDate}</Text>
                    <Text style={styles.itemPrice}>RM {item.total} ({item.quantity} {item.uom})</Text>
                </View>
                <View style={[styles.verticalBar, {backgroundColor: 'orange'}]}></View>
            </TouchableOpacity>
        );
    };

    return(
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Home</Text>

                    <TouchableOpacity onPress={handleLogout}>
                        <AntDesign name="logout" size={25} color="black"/>
                    </TouchableOpacity>
                </View>

                <View style={styles.main}>
                    <Text style={styles.titleText}>Welcome home, {currentUser.length > 0 ? currentUser[0].username : ''}</Text>

                    <ScrollView style={styles.mainContainer} horizontal={true} showsHorizontalScrollIndicator={false}>
                        {type !== "" ? (
                            type === 'retailer' ? (
                                <TouchableOpacity style={styles.mainButton} onPress={() => navigation.navigate('Shopping', { retails, uid: user.uid })}>
                                    <Entypo name="shop" size={60} color="black" style={{verticalAlign: 'top'}}/>
                                    <Text style={styles.mainButtonText}>Shopping</Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity style={styles.mainButton} onPress={() => navigation.navigate('AddItem')}>
                                    <Ionicons name="add-circle-outline" size={60} color="black" style={{verticalAlign: 'top'}}/>
                                    <Text style={styles.mainButtonText}>Add Item</Text>
                                </TouchableOpacity>
                            )
                        ) : (
                            <></>
                        )}
                        <TouchableOpacity style={styles.mainButton} onPress={() => navigation.navigate('Promotion')}>
                            <Fontisto name="shopping-sale" size={60} color="black" />
                            <Text style={styles.mainButtonText}>Promotion</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.mainButton} onPress={() => navigation.navigate('Voucher')}>
                            <Fontisto name="shopping-package" size={60} color="black" />
                            <Text style={styles.mainButtonText}>Voucher</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.mainButton} onPress={() => navigation.navigate('News')}>
                            <Ionicons name="newspaper" size={60} color="black" />
                            <Text style={styles.mainButtonText}>News</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
                
                

                {type !== '' ? (
                    type === 'retailer' ? (
                        <>
                            <View style={styles.mapButton}>
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
                            </View>

                            <View style={styles.favContainer}>
                                <Text style={styles.titleText}>Your favourites</Text>

                                <FlatList
                                    horizontal
                                    data={retails}
                                    keyExtractor={(retails) => retails.id.toString()}
                                    renderItem={renderRetails}
                                    showsHorizontalScrollIndicator={false}
                                />
                            </View>

                            <View style={styles.orderAgainContainer}>
                                <Text style={styles.titleText}>Order again</Text>
                                
                                <FlatList
                                    horizontal
                                    data={retails}
                                    keyExtractor={(retails) => retails.id.toString()}
                                    renderItem={renderRetails}
                                    showsHorizontalScrollIndicator={false}
                                />
                            </View>
                        </>
                    ) : (
                        <>
                            <View style={styles.mapButton}>
                                <TouchableOpacity onPress={() => navigation.navigate('Analytics')}>
                                    <ImageBackground 
                                        source={require('../../../assets/biz_analytics.jpg')}
                                        style={styles.imageLayout}
                                        imageStyle={{borderRadius: 8}}
                                    >
                                        <View style={[styles.viewMapBox, {backgroundColor: "#a6fd29"}]}>
                                            <Text style={[styles.mapText, {color: 'black'}]}>View data</Text> 
                                        </View>
                                    </ImageBackground>         
                                </TouchableOpacity>
                            </View>
                            <View style={styles.pendingOrderContainer}>
                                <Text style={[styles.titleText, {fontWeight: '600'}]}>Pending Orders</Text>
                                
                                {pending.length > 0 ? (
                                    <FlatList
                                        data={pending}
                                        keyExtractor={(pending) => pending.id.toString()}
                                        renderItem={renderOrder}
                                        contentContainerStyle={styles.orderList}
                                        scrollEnabled={false}
                                        showsHorizontalScrollIndicator={false}
                                    />
                                ) : (
                                    <View style={styles.emptyContainer}>
                                        <MaterialCommunityIcons name={'order-bool-ascending'} size={40} color={'#ccc'}/>
                                        <Text style={styles.emptyText}>No pending order</Text>
                                    </View>
                                )}
                            </View>
                        </>
                    )
                ) : (
                    <></>
                )}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        paddingLeft: 20
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 35,
        paddingRight: 20
    },
    headerTitle: {
        fontSize: 30,
        fontWeight: 'bold'
    },
    main: {
        paddingBottom: 35
    },
    mainContainer: {
        flexDirection: 'row',
        alignContent: 'center',
        paddingBottom: 10
    },
    mainButton: {
        alignItems: 'center',
        paddingRight: 40,
        alignSelf: 'space-between',
        flex: 1
    },
    mainButtonText: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: '600',
        bottom: 0
    },
    titleText: {
        fontSize: 18,
        fontWeight: '500',
        paddingBottom: 10
    },
    imageLayout: {
        height: 100,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    mapButton: {
        paddingBottom: 35,
        paddingRight: 20
    },
    mapText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'white',
        padding: 8,
        paddingHorizontal: 15
    },
    viewMapBox: {
        width: 200,
        alignItems: 'center',
        backgroundColor: "black",
        borderRadius: 8
    },
    favContainer: {
        paddingBottom: 35
    },
    orderAgainContainer: {
        paddingBottom: 20
    },
    pendingOrderContainer: {
        paddingRight: 20
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
    orderList: {
        marginTop: 20,
        paddingBottom: 40
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
        paddingTop: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        padding: 20,
        color: 'gray'
    },
    productContainer: {
      paddingRight: 16
    },
    productImage: {
      width: 200,
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
    }
})

export default Home