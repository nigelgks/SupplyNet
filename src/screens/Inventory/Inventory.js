import React, { useContext, useEffect, useState } from "react";
import { View, 
         Text,
         TextInput,
         ImageBackground, 
         FlatList, 
         Image, 
         TouchableOpacity, 
         StyleSheet, 
         Dimensions
} from "react-native";
import { FIREBASE_DB } from "../../../firebaseConfig";
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { UserProfileContext } from "../../context/UserProfileContext";
import { collection, onSnapshot } from "firebase/firestore";
import placeholder from '../../../assets/default_image.jpg'

const {width} = Dimensions.get('window');
const numColumns = 3;
const itemWidth = (width/numColumns)-7;

const Inventory = ({ navigation }) => {
    const { user } = useContext(UserProfileContext);
    const [ items, setItems ] = useState([]);
    const [ searchText, setSearchText ] = useState('');
    
    useEffect(() => {
        const itemRef = collection(FIREBASE_DB, 'products');

        const subscriber = onSnapshot(itemRef, {
            next: (snapshot) => {
                const items = [];
                snapshot.docs.forEach((doc) => {
                    const data = doc.data();
                    if (data.uid === user.uid) {
                        items.push({
                            id: doc.id,
                            ...doc.data()
                        })
                    }
                });
                setItems(items);
            }
        });
        return () => subscriber();
    }, [user.uid]);

    const renderItem = ({ item }) => {
        const uri = item.image;

        return(
            <TouchableOpacity style={styles.itemContainer} onPress={() => navigation.navigate('ItemInventoryDetails', { details: item })}>
                <Image source={ uri ? {uri} : placeholder } style={styles.itemImage}/>
                <View style={styles.itemText}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemPrice}>({item.stock} left)</Text>
                </View>
            </TouchableOpacity>
        );
    };

    const filteredItem = items.filter((items) =>
        items.name.toLowerCase().includes(searchText.toLowerCase())
    );
    
    return(
        <View style={styles.container}>
            <Text style={styles.header}>
                Inventory
            </Text>
            
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('Analytics')}>
                    <ImageBackground
                        source={require('../../../assets/biz_analytics.jpg')}
                        style={styles.imageLayout}
                        imageStyle={{borderRadius: 8}}
                    >
                        <View style={styles.viewDataBox}>
                            <Text style={styles.dataText}>View data</Text>
                        </View>
                    </ImageBackground>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AddItem')}>
                    <Ionicons name="add-circle-outline" size={25} color="white"/>
                </TouchableOpacity>
            </View>

            <TextInput
                style={styles.searchInput}
                placeholder="Search here..."
                value={searchText}
                onChangeText={(text) => setSearchText(text)}
                editable={items.length > 0}
            />

            {items.length > 0 ? (
                <FlatList
                    data={filteredItem}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.itemList}
                    numColumns={numColumns}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <MaterialIcons name={'inventory'} size={70} color="#ccc" />
                    <Text style={styles.emptyText}>Your inventory is empty!</Text>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 50,
        flex: 1
    },
    buttonContainer: {
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'space-between',
        paddingTop: 20,
        paddingHorizontal: 20,
        paddingBottom: 20
    },
    imageLayout: {
      height: 50,
      width: 305,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    },
    buttonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold'
    },
    button: {
        width: '15%',
        height: 50,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    dataText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: 'black',
        alignContent: 'center',
        margin: 5,
        paddingHorizontal: 8,
    },
    viewDataBox: {
        backgroundColor: "#a6fd29",
        borderRadius: 8,
    },
    header: {
        fontSize: 30,
        fontWeight: 'bold',
        paddingHorizontal: 20,
        paddingBottom: 5
    },
    searchInput: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 20,
      paddingLeft: 8,
      borderRadius: 8,
      marginHorizontal: 20,
    },
    emptyContainer: {
        height: '60%',
        margin: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        fontSize: 20,
        fontWeight: '600',
        padding: 20,
        color: 'gray'
    },
    itemContainer: {
        width: itemWidth,
        height: 180,
    },
    itemText: {
        flex: 1,
        justifyContent: 'space-between'
    },
    itemImage: {
        width: 110,
        height: 110,
        resizeMode: 'cover',
        borderRadius: 8,
        marginBottom: 10
    },
    itemName: {
        width: 110,
        fontWeight: '500',
        fontSize: 13,
        paddingBottom: 5
    },
    itemPrice: {
        fontSize: 13
    },
    itemList: {
        alignItems: 'flex-start',
        marginLeft: 20,
    }
})

export default Inventory