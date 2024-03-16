import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBxyTjKZsxOhBDuCPNHQ5VaQal_n0owCHg",
    authDomain: "supplynet-30b64.firebaseapp.com",
    projectId: "supplynet-30b64",
    storageBucket: "supplynet-30b64.appspot.com",
    messagingSenderId: "19204518626",
    appId: "1:19204518626:web:289b23b6ce3aac9e5ea4bb",
    measurementId: "G-Y1EBGS0E28"
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_ASYNC = initializeAuth(FIREBASE_APP, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);