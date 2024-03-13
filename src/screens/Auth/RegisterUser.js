import React, { useContext, useEffect, useState } from "react";
import { KeyboardAvoidingView, ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import Avatar from "../../components/Avatar";
import UploadModal from "../../components/UploadModal";
import { FIREBASE_AUTH } from '../../../firebaseConfig';
import { FIREBASE_DB } from '../../../firebaseConfig';
import { FIREBASE_STORAGE } from '../../../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { UserLocationContext } from "../../context/UserLocationContext";
import { MaterialIcons } from '@expo/vector-icons';

const RegisterUser = ({ navigation, route }) => {
    const { userType, title } = route.params;

    const { location } = useContext(UserLocationContext);

    const [ modalVisible, setModalVisible ] = useState(false);
    const [ loading, setLoading ] = useState(false);

    const [ userAvatar, setUserAvatar ] = useState('');
    const [ username, setUsername ] = useState('');
    const [ companyName, setCompanyName ] = useState('');
    const [ companyAddress, setCompanyAddress ] = useState('');
    const [ companyCity, setCompanyCity ] = useState('');
    const [ companyState, setCompanyState ] = useState('');
    const [ companyPostcode, setCompanyPostcode ] = useState('');
    const [ companyCoords, setCompanyCoords ] = useState('');
    const [ companyEmail, setCompanyEmail ] = useState('');
    const [ companyPhone, setCompanyPhone ] = useState('');
    const [ ssmNo, setSSMNo ] = useState('');
    const [ password, setPassword ] = useState('');

    useEffect(() => {
        const userType = title;
        navigation.setOptions({ title: userType || 'New User' });
    }, [navigation, title]);

    const userLat = location?.latitude;
    const userLon = location?.longitude;
    const userCoords = `${userLat}, ${userLon}`;

    const auth = FIREBASE_AUTH;

    const uploadImage = async (mode) => {
        try {
            let result = {}
            
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
            setUserAvatar(imageUri);
            setModalVisible(false);
        } catch (error) {
            throw error;
        };
    };

    const addImage = async (imageUri) => {
        const metadata = {
            contentType: 'image/jpeg'
        };

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
            const blob = await getBlobFromUri(imageUri);
            
            const storageRef = ref(FIREBASE_STORAGE, 'images/profile/' + new Date().toISOString());

            await uploadBytes(storageRef, blob, metadata);
            const downloadURL = await getDownloadURL(storageRef);

            return downloadURL;
        } catch (error) {
            throw error;
        };
    };

    const addProfile = async () => {
        try {
            const userCredentials = await createUserWithEmailAndPassword(auth, companyEmail, password);
            const user = userCredentials.user;
            console.log(user.uid);
            alert('Check your emails!');

            const imageURL = await addImage(userAvatar);

            await addDoc(collection(FIREBASE_DB, 'profile'), { 
                uid: user.uid,
                image: imageURL,
                name: companyName,
                username: username,
                email: companyEmail,
                address: companyAddress,
                city: companyCity,
                state: companyState,
                postcode: companyPostcode,
                coords: companyCoords,
                phone: companyPhone,
                ssm: ssmNo,
                type: userType
            });
        } catch (error) {
            console.log(error);
            alert('Sign up failed: ' + error.message);
        };
    };

    function allEmpty(...variables) {
        return variables.some(variable => variable === '');
    };

    return(
        <KeyboardAvoidingView
            keyboardVerticalOffset={-500}
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            style={{flex: 1}}
        >
            <ScrollView
                style={styles.container}
                contentContainerStyle={{flexGrow: 1, paddingBottom: 30}}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
            >
                <Avatar
                    onButtonPress={() => setModalVisible(true)}
                    uri={userAvatar}
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

                <Text style={styles.titleText}>Credentials</Text>
                <Text style={styles.inputText}>Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Company Email"
                    onChangeText={setCompanyEmail}
                    value={companyEmail}
                    keyboardType="email-address"
                />
                <Text style={styles.inputText}>Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Password (minimum 6 characters)"
                    onChangeText={setPassword}
                    value={password}
                    secureTextEntry
                />
                <Text style={styles.titleText}>Profile Details</Text>
                <Text style={styles.inputText}>Username</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    onChangeText={setUsername}
                    value={username}
                    autoCapitalize="none"
                />
                <Text style={styles.inputText}>Company Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Company Name"
                    onChangeText={setCompanyName}
                    value={companyName}
                />
                <Text style={styles.inputText}>Company SSM</Text>
                <TextInput
                    style={styles.input}
                    placeholder="SSM Registration Number"
                    onChangeText={setSSMNo}
                    value={ssmNo}
                    keyboardType="numeric"
                />
                <Text style={styles.titleText}>Billing Address and Location</Text>
                <Text style={styles.inputText}>Phone Number</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Company Phone Number"
                    onChangeText={setCompanyPhone}
                    value={companyPhone}
                    keyboardType="numeric"
                />
                <Text style={styles.inputText}>Company Address</Text>
                <TextInput
                    style={styles.inputMultiline}
                    placeholder="Company Address Line"
                    onChangeText={setCompanyAddress}
                    value={companyAddress}
                    multiline
                    numberOfLines={4}
                    maxLength={100}
                />
                <Text style={styles.inputText}>City</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Company Address City"
                    onChangeText={setCompanyCity}
                    value={companyCity}
                />
                <Text style={styles.inputText}>State</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Company Address State"
                    onChangeText={setCompanyState}
                    value={companyState}
                />
                <Text style={styles.inputText}>Postcode</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Company Address Postcode"
                    onChangeText={setCompanyPostcode}
                    value={companyPostcode}
                    keyboardType="numeric"
                    maxLength={5}
                />
                <Text style={styles.inputText}>Coordinates</Text>
                <Text style={styles.infoText}>Be in your premise before pressing the button*</Text>
                <View style={styles.locationInput}>
                    <TextInput
                        style={[styles.input , {width: '86%'}]}
                        placeholder="Company Coordinates"
                        value={companyCoords.coords}
                        editable={false}
                    />
                    <TouchableOpacity style={styles.locationButton} onPress={() => {setCompanyCoords({coords: userCoords, latitude: userLat, longitude: userLon})}}>
                        <MaterialIcons name="my-location" size={24} color="white"/>
                    </TouchableOpacity>
                </View>
                <Text style={[styles.infoText, {paddingTop: 15}]}>Please fill in all fields to enable the button.</Text>
            </ScrollView>

            <TouchableOpacity style={styles.button} onPress={addProfile}
                disabled={allEmpty(
                    userAvatar,
                    companyEmail,
                    password,
                    username,
                    companyName,
                    ssmNo,
                    companyPhone,
                    companyAddress,
                    companyCity,
                    companyState,
                    companyPostcode,
                    companyCoords
                )}
            >
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingTop: 30
    },
    titleText: {
        fontSize: 20,
        fontWeight: '700',
        paddingBottom: 15,
        paddingTop: 15
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 10
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
    inputMultiline: {
        width: '100%',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 10,
        marginBottom: 10
    },
    button: {
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
        fontWeight: 'bold'
    },
    locationInput: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    locationButton: {
        backgroundColor: 'gray',
        borderRadius: 8,
        padding: 10,
        paddingHorizontal: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'gray'
    }
});

export default RegisterUser;