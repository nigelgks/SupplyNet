import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";

const Messages = () => {
    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Messages</Text>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Notifications</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Chats</Text>
                </TouchableOpacity>
            </View>

            <View>
                <ImageBackground
                    source={require('../../../assets/construction.jpg')}
                    style={styles.imageLayout}
                    imageStyle={{borderRadius: 40}}
                />
                <Text style={styles.text1}>Don't blink!</Text>
                <Text style={styles.text2}>Messages page is brewing up.</Text>
            </View>
        </View>
    )
}

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
        paddingTop: 20
    },
    buttonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold'
    },
    button: {
        width: '48%',
        height: 30,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8
    },
    imageLayout: {
      width: 200,
      height: 200,
      alignSelf: 'center',
      marginTop: 100
    },
    text1: {
      paddingTop: 25,
      alignSelf: 'center',
      fontSize: 22,
      fontWeight: '600'
    },
    text2: {
      paddingTop: 10,
      alignSelf: 'center',
      fontSize: 19,
      fontWeight: '300'
    }
})

export default Messages