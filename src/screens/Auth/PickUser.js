import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

const PickUser = ({ navigation }) => {
    return(
        <View style={styles.container}>
            <Text style={styles.title}>Choose your user type</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('RegisterUser', {userType: 'supplier', title: 'Supplier Registration'})}>
                    <ImageBackground 
                        source={require('../../../assets/supplier.jpg')}
                        style={styles.button}
                        imageStyle={styles.image}
                    >
                        <View style={[styles.viewText, {backgroundColor: "#a6fd29"}]}>
                            <Text style={[styles.buttonText, {color: 'black'}]}>Supplier</Text> 
                        </View>
                    </ImageBackground>         
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('RegisterUser', {userType: 'retailer', title: 'Retailer Registration'})}>
                    <ImageBackground 
                        source={require('../../../assets/retailer.jpg')}
                        style={styles.button}
                        imageStyle={styles.image}
                    >
                        <View style={styles.viewText}>
                            <Text style={[styles.buttonText, {color: 'black'}]}>Retailer</Text> 
                        </View>
                    </ImageBackground>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 30
    },
    buttonContainer: {
        alignContent: 'center',
        width: '100%'
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        paddingVertical: 20,
        paddingHorizontal: 30,
        marginBottom: 20,
        height: 120
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
        padding: 5
    },
    viewText: {
        width: 150,
        alignItems: 'center',
        backgroundColor: "#a6fd29",
        borderRadius: 8
    },
    image: {
        borderRadius: 8,
        resizeMode: 'cover'
    }
})

export default PickUser