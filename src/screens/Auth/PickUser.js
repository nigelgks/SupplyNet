import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

const PickUser = ({ navigation }) => {
    return(
        <View style={styles.container}>
            <Text style={styles.title}>Choose your user type</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('RegisterUser', {userType: 'supplier', title: 'Supplier Registration'})}
                >
                    <Ionicons name="ios-people" size={40} color="white" />
                    <Text style={styles.buttonText}>Supplier</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                    style={[styles.button, styles.retailerButton]}
                    onPress={() => navigation.navigate('RegisterUser', {userType: 'retailer', title: 'Retailer Registration'})}
                >
                    <FontAwesome name="shopping-bag" size={40} color="white" />
                    <Text style={styles.buttonText}>Retailer</Text>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#007bff',
        borderRadius: 10,
        paddingVertical: 20,
        paddingHorizontal: 30,
        width: '45%'
    },
    retailerButton: {
        backgroundColor: '#28a745'
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        marginTop: 10
    }
})

export default PickUser