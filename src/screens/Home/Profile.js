import React, { useContext, useEffect, useState } from "react";
import { KeyboardAvoidingView, ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import Avatar from "../../components/Avatar";
import UploadModal from "../../components/UploadModal";
import { FIREBASE_AUTH } from '../../../firebaseConfig';
import { FIREBASE_DB } from '../../../firebaseConfig';
import { FIREBASE_STORAGE } from '../../../firebaseConfig';
import { ref, getDownloadURL, uploadBytes, deleteObject } from "firebase/storage";
import { collection, doc, updateDoc, onSnapshot } from "firebase/firestore";
import { UserLocationContext } from "../../context/UserLocationContext";
import { UserProfileContext } from "../../context/UserProfileContext";
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

const Profile = () => {
    const { user } = useContext(UserProfileContext);
    const { location } = useContext(UserLocationContext);

    const [modalVisible, setModalVisible] = useState(false);

    const [currentUser, setCurrentUser] = useState('');
    const [userAvatar, setUserAvatar] = useState('');
    const [username, setUsername] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [companyAddress, setCompanyAddress] = useState('');
    const [companyCity, setCompanyCity] = useState('');
    const [ companyState, setCompanyState ] = useState('');
    const [companyPostcode, setCompanyPostcode] = useState('');
    const [companyCoords, setCompanyCoords] = useState('');
    const [companyEmail, setCompanyEmail] = useState('');
    const [companyPhone, setCompanyPhone] = useState('');
    const [ssmNo, setSSMNo] = useState('');

    const userLat = location?.latitude;
    const userLon = location?.longitude;
    const userCoords = `${userLat}, ${userLon}`;

    const handleLogout = () => {
        FIREBASE_AUTH.signOut();
    };

    useEffect(() => {
        if (!currentUser) {
          return;
        } else {
            setUserAvatar(currentUser[0].image);
            setUsername(currentUser[0].username);
            setCompanyName(currentUser[0].name);
            setCompanyAddress(currentUser[0].address);
            setCompanyCity(currentUser[0].city);
            setCompanyState(currentUser[0].state);
            setCompanyPostcode(currentUser[0].postcode);
            setCompanyCoords(currentUser[0].coords);
            setCompanyEmail(currentUser[0].email);
            setCompanyPhone(currentUser[0].phone);
            setSSMNo(currentUser[0].ssm);
        }
    }, [currentUser]);

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
                });w
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

    const deleteImage = async (imageURL) => {
        if (!imageURL) return;

        const deleteRef = ref(FIREBASE_STORAGE, imageURL)
        deleteObject(deleteRef)
    }

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

    const updateProfile = async () => {
        const docRef = doc(FIREBASE_DB, `profile/${currentUser[0].id}`);
        
        if (userAvatar !== currentUser[0].image) {
            imageURL = await addImage(userAvatar);
            deleteImage(currentUser[0].image);
        } else {
            imageURL = currentUser[0].image;
        };
        
        await updateDoc(docRef, { 
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
        });
    };

    function allEmpty(...variables) {
        return variables.some(variable => variable === '');
    };

    function inputChanges(
        userAvatar,
        username,
        companyName,
        ssmNo,
        companyPhone,
        companyAddress,
        companyCity,
        companyState,
        companyPostcode,
        companyCoords
    ) {
        return !(
            (userAvatar === currentUser[0].image)&&
            (username === currentUser[0].username)&&
            (companyName === currentUser[0].name)&&
            (ssmNo === currentUser[0].ssm)&&
            (companyPhone === currentUser[0].phone)&&
            (companyAddress === currentUser[0].address)&&
            (companyCity === currentUser[0].city)&&
            (companyState === currentUser[0].state)&&
            (companyPostcode === currentUser[0].postcode)&&
            (companyCoords.coords === currentUser[0].coords.coords));
    };

    return(
        <KeyboardAvoidingView
            keyboardVerticalOffset={-500}
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            style={{flex: 1, paddingHorizontal: 20}}
        >
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Profile</Text>

                <TouchableOpacity onPress={handleLogout}>
                    <AntDesign name="logout" size={25} color="black"/>
                </TouchableOpacity>
            </View>
            
            <ScrollView
                style={styles.container}
                contentContainerStyle={{flexGrow: 1, paddingBottom: 10}}
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
            
                <TouchableOpacity style={styles.button} onPress={updateProfile}
                    disabled={allEmpty(
                        userAvatar,
                        username,
                        companyName,
                        ssmNo,
                        companyPhone,
                        companyAddress,
                        companyCity,
                        companyState,
                        companyPostcode,
                        companyCoords
                    )||!inputChanges(
                        userAvatar,
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
                    <Text style={styles.buttonText}>Save Changes</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 35,
        paddingTop: 30
    },
    headerTitle: {
        fontSize: 30,
        fontWeight: 'bold'
    },
    titleText: {
        fontSize: 20,
        fontWeight: '700',
        paddingBottom: 15,
        paddingTop: 15
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
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 10
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

export default Profile;