import React, { useContext, useState } from 'react';
import { KeyboardAvoidingView,
         StyleSheet,
         ScrollView,
         Text,
         TextInput,
         TouchableOpacity,
         Platform
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import CurrencyInput from 'react-native-currency-input';
import * as ImagePicker from 'expo-image-picker';
import Avatar from '../../components/Avatar';
import UploadModal from '../../components/UploadModal';
import { UserProfileContext } from '../../context/UserProfileContext';
import { FIREBASE_DB } from '../../../firebaseConfig';
import { FIREBASE_STORAGE } from '../../../firebaseConfig';
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import uom from '../../utils/uom';

const halal = [
    {label: 'Halal certified', value: true},
    {label: 'Not Halal certified', value: false},
];

const AddItem = ({ navigation }) => {
    const { user, setUser } = useContext(UserProfileContext);
    
    const [openUOM, setOpenUOM] = useState(false);
    const [openHalal, setOpenHalal] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [items, setItems] = useState(uom);
    const [halalItem, setHalalItem] = useState(halal);

    const [productImage, setProductImage] = useState('');
    const [productName, setProductName] = useState('');
    const [productDesc, setProductDesc] = useState('');
    const [productUnitNum, setProductUnitNum] = useState('');
    const [productCategory, setProductCategory] = useState('');
    const [productCode, setProductCode] = useState('');
    const [productHalal, setProductHalal] = useState('');
    const [productUOM, setProductUOM] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productStock, setProductStock] = useState('');
    const [productLimit, setProductLimit] = useState('');

    const uploadImage = async (mode) => {
        try {
            let result = {};
            
            if (mode === 'gallery') {
                await ImagePicker.requestMediaLibraryPermissionsAsync();
                result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 1
                });
            } else {
                await ImagePicker.requestCameraPermissionsAsync();
                result = await ImagePicker.launchCameraAsync({
                    cameraType: ImagePicker.CameraType.back,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 1
                });
            };

            if (!result.canceled) {
                const uri = result.assets[0].uri;
                await saveImage(uri);
            };
        } catch (error) {
            alert("Error uploading image ; " + error.message);
            setModalVisible(false);
        };
    };

    const removeImage = async () => {
        try {
            saveImage(null);
        } catch ({ message }) {
            alert(message);
            setModalVisible(false);
        };
    };

    const saveImage = async (imageUri) => {
        try {
            setProductImage(imageUri);
            setModalVisible(false);
        } catch (error) {
            throw error;
        };
    };

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

    const addProduct = async () => {
        const imageURL = await addImage(productImage)
        await addDoc(collection(FIREBASE_DB, 'products'), { 
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
            limit: productLimit,
            uid: user.uid
        })
        navigation.navigate('Inventory')
    }

    function allEmpty(...variables) {
        return variables.some(variable => variable === '');
    }

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

            <TouchableOpacity style={styles.addButton} onPress={() => {addProduct()}}
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
                )}
            >
                <Text style={styles.buttonText}>Add Item</Text>
            </TouchableOpacity>
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
        marginHorizontal: 20,
        marginBottom: 20,
        marginTop: 10
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 10,
        marginBottom: 15
    },
    inputText: {
        fontSize: 15,
        fontWeight: '500',
        paddingBottom: 10,
    },
    infoText: {
        fontSize: 12,
        fontWeight: '300',
        paddingBottom: 10,
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
    }
})

export default AddItem