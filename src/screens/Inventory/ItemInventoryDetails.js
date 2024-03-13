import React, { useState } from 'react';
import { StyleSheet, 
         Text, 
         View,
         ScrollView, 
         KeyboardAvoidingView,
         TextInput,
         TouchableOpacity
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker'
import CurrencyInput from 'react-native-currency-input'
import * as ImagePicker from 'expo-image-picker'
import Avatar from '../../components/Avatar'
import { FIREBASE_DB } from '../../../firebaseConfig'
import { FIREBASE_STORAGE } from '../../../firebaseConfig'
import { ref, getDownloadURL, uploadBytes, deleteObject } from "firebase/storage"
import { deleteDoc, doc, updateDoc } from "firebase/firestore"
import UploadModal from '../../components/UploadModal'
import uom from '../../utils/uom'
import { Feather } from '@expo/vector-icons';

const halal = [
    {label: 'Halal certified', value: true},
    {label: 'Not Halal certified', value: false},
]

const ItemInventoryDetails = ({ route, navigation }) => {
    const {details} = route.params

    const [openUOM, setOpenUOM] = useState(false);
    const [openHalal, setOpenHalal] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [items, setItems] = useState(uom);
    const [halalItem, setHalalItem] = useState(halal);

    const [productImage, setProductImage] = useState(details.image);
    const [productName, setProductName] = useState(details.name);
    const [productDesc, setProductDesc] = useState(details.description);
    const [productUnitNum, setProductUnitNum] = useState(details.unit);
    const [productCategory, setProductCategory] = useState(details.category);
    const [productCode, setProductCode] = useState(details.code);
    const [productHalal, setProductHalal] = useState(details.halal);
    const [productUOM, setProductUOM] = useState(details.uom);
    const [productPrice, setProductPrice] = useState(details.price);
    const [productStock, setProductStock] = useState(details.stock);
    const [productLimit, setProductLimit] = useState(details.limit);

    const uploadImage = async (mode) => {
        try {
            let result = {}
            
            if (mode === 'gallery') {
                await ImagePicker.requestMediaLibraryPermissionsAsync()
                result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 1
                })
            } else {
                await ImagePicker.requestCameraPermissionsAsync()
                result = await ImagePicker.launchCameraAsync({
                    cameraType: ImagePicker.CameraType.back,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 1
                })
            }

            if (!result.canceled) {
                await saveImage(result.assets[0].uri)
            }
        } catch (error) {
            alert("Error uploading image ; " + error.message)
            setModalVisible(false)
        }
    }

    const removeImage = async () => {
        try {
            saveImage(null)
        } catch ({ message }) {
            alert(message)
            setModalVisible(false)
        }
    }

    const deleteImage = async (imageURL) => {
        if (!imageURL) return;

        const deleteRef = ref(FIREBASE_STORAGE, imageURL)
        deleteObject(deleteRef)
    }

    const saveImage = async (imageUri) => {
        try {
            setProductImage(imageUri)
            setModalVisible(false)
        } catch (error) {
            throw error
        }
    }

    const addImage = async (imageUri) => {
        const metadata = {
            contentType: 'image/jpeg'
        }

        const getBlobFromUri = async (uri) => {
            const blob = await new Promise((resolve, reject) => {
              const xhr = new XMLHttpRequest();
              xhr.onload = function () {
                resolve(xhr.response);
              };
              xhr.onerror = function (e) {
                reject(new TypeError("Network request failed"));
              };
              xhr.responseType = "blob";
              xhr.open("GET", uri, true);
              xhr.send(null);
            });
          
            return blob;
        };
        
        try {
            const blob = await getBlobFromUri(imageUri)
            
            const storageRef = ref(FIREBASE_STORAGE, 'images/item/' + new Date().toISOString() + productCode);

            await uploadBytes(storageRef, blob, metadata);
            const downloadURL = await getDownloadURL(storageRef);

            return downloadURL
        } catch (error) {
            throw error
        }
    }

    const updateProduct = async () => {
        const docRef = doc(FIREBASE_DB, `products/${details.id}`);

        if (productImage !== details.image) {
            imageURL = await addImage(productImage);
            deleteImage(details.image);
        } else {
            imageURL = details.image;
        };

        await updateDoc(docRef, {
            image: imageURL,
            name: productName,
            code: productCode,
            category: productCategory,
            description: productDesc,
            halal: productHalal,
            stock: productStock,
            unit: productUnitNum,
            uom: productUOM,
            price: productPrice,
            limit: productLimit
        })
        navigation.navigate('Inventory')
    }

    const deleteProduct = async () => {
        await deleteDoc(docRef)
        deleteImage(details.image)
        navigation.navigate('Inventory')
    }

    function allEmpty(...variables) {
        return variables.some(variable => variable === '');
    }

    function inputChanges(
        productImage,
        productName,
        productCode,
        productCategory,
        productDesc,
        productHalal,
        productStock,
        productUnitNum,
        productUOM,
        productPrice,
        productLimit
    ) {
        return !(
            (productImage === details.image)&&
            (productName === details.name)&&
            (productCode === details.code)&&
            (productCategory === details.category)&&
            (productDesc === details.description)&&
            (productHalal === details.halal)&&
            (productStock === details.stock)&&
            (productUnitNum === details.unit)&&
            (productUOM === details.uom)&&
            (productPrice === details.price)&&
            (productLimit === details.limit));
    };

    return (
        <KeyboardAvoidingView
            keyboardVerticalOffset={-500}
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            style={{flex: 1}}
        >
            <ScrollView 
                style={styles.container} 
                contentContainerStyle={{flexGrow: 1, paddingBottom: 20}}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
            >
                <Avatar 
                    onButtonPress={() => setModalVisible(true)}
                    uri={productImage}
                />

                <UploadModal
                    modalVisible={modalVisible}
                    onBackPress={() => {
                        setModalVisible(false)
                    }}
                    onCameraPress={() => uploadImage()}
                    onGalleryPress={() => uploadImage("gallery")}
                    onRemovePress={() => removeImage()}
                />
                
                <Text style={styles.inputText}>Product Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Product name"
                    onChangeText={(text) => setProductName(text)}
                    value={productName}
                />
                <Text style={styles.inputText}>Product Code</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Product code"
                    onChangeText={(text) => setProductCode(text)}
                    value={productCode}
                    inputMode='text'
                />
                <Text style={styles.inputText}>Product Category</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Product category"
                    onChangeText={(text) => setProductCategory(text)}
                    value={productCategory}
                />
                <Text style={styles.inputText}>Product Description</Text>
                <TextInput
                    style={styles.inputMultiline}
                    placeholder="Product description"
                    onChangeText={(text) => setProductDesc(text)}
                    value={productDesc}
                    multiline
                    numberOfLines={4}
                    maxLength={100}
                />
                <Text style={styles.inputText}>Halal Certification</Text>
                <DropDownPicker
                    style={styles.dropDown}
                    open={openHalal}
                    value={productHalal}
                    items={halalItem}
                    placeholder='Halal certified?'
                    setOpen={setOpenHalal}
                    setValue={setProductHalal}
                    setItems={setHalalItem}
                    listMode='SCROLLVIEW'
                />
                <Text style={styles.inputText}>Number of Packages</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Number of packages/stocks"
                    onChangeText={(numeric) => setProductStock(numeric)}
                    value={productStock}
                    inputMode='numeric'
                />
                <Text style={styles.inputText}>Number of Units</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Number of units per package"
                    onChangeText={(numeric) => setProductUnitNum(numeric)}
                    value={productUnitNum}
                    inputMode='numeric'
                />
                <Text style={styles.inputText}>Unit of Measurement (UOM)</Text>
                <DropDownPicker
                    style={styles.dropDown}
                    open={openUOM}
                    value={productUOM}
                    items={items}
                    placeholder='Unit of measurement'
                    setOpen={setOpenUOM}
                    setValue={setProductUOM}
                    setItems={setItems}
                    maxHeight={300}
                    categorySelectable={false}
                    searchable={true}
                    searchPlaceholder="Search..."
                    listMode='SCROLLVIEW'
                />
                <Text style={styles.inputText}>Price per Package (RM)</Text>
                <CurrencyInput
                    style={styles.input}
                    placeholder='Price per package'
                    onChangeValue={(numeric) => setProductPrice(numeric)}
                    value={productPrice}
                    inputMode='numeric'
                    prefix='RM'
                    delimiter=','
                    separator='.'
                    minValue={0}
                />
                <Text style={styles.inputText}>Minimum Stock Level</Text>
                <Text style={styles.infoText}>By setting this, you will receive alert when stock level reaches the minimum limit*</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Minimum number of packages/stocks"
                    onChangeText={(numeric) => setProductLimit(numeric)}
                    value={productLimit}
                    inputMode='numeric'
                />
                <Text style={styles.infoText}>Please fill in all fields to enable the button.</Text>
            </ScrollView>
            
            <View style={styles.bottomButton}>
                <TouchableOpacity style={styles.addButton} onPress={updateProduct}
                    disabled={allEmpty(
                        productImage,
                        productName,
                        productCode,
                        productCategory,
                        productDesc,
                        productHalal,
                        productStock,
                        productUnitNum,
                        productUOM,
                        productPrice,
                        productLimit
                    )||!inputChanges(
                        productImage,
                        productName,
                        productCode,
                        productCategory,
                        productDesc,
                        productHalal,
                        productStock,
                        productUnitNum,
                        productUOM,
                        productPrice,
                        productLimit
                    )}
                >
                    <Text style={styles.buttonText}>Save Changes</Text>
                </TouchableOpacity>
                
                <TouchableOpacity onPress={deleteProduct}>
                    <Feather name="trash-2" size={35} color="black" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingTop: 30
    },
    addButton: {
        backgroundColor: 'black',
        borderRadius: 8,
        paddingVertical: 15,
        alignItems: 'center',
        width: '87%'
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
    },
    inputText: {
        fontSize: 15,
        fontWeight: '500',
        paddingBottom: 10,
        paddingTop: 5
    },
    infoText: {
        fontSize: 12,
        fontWeight: '300',
        paddingBottom: 10,
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 10,
        marginBottom: 20
    },
    inputMultiline: {
        width: '100%',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 10,
        marginBottom: 20
    },
    dropDown: {
        marginBottom: 20,
        borderColor: '#ccc',
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderRadius: 8
    },
    bottomButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 20
    }
})

export default ItemInventoryDetails