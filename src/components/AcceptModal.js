import { StyleSheet, Text, TouchableOpacity, View, Modal, Pressable, ActivityIndicator } from 'react-native'
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

const AcceptModal = ({
    modalVisible,
    onConfirmPress,
    onCancelPress,
    isLoading = false
}) => {
  return (
    <Modal animationType='fade' visible={modalVisible} transparent={true}>
        <Pressable style={styles.container} onPress={onCancelPress}>
            {isLoading && <ActivityIndicator size={70} color={'blue'}/>}

            {!isLoading && (
                <View style={[styles.modalView, { backgroundColor: 'white' }]}>
                    <Text style={styles.title}>Accept order?</Text>

                    <View style={styles.decisionRow}>
                        <TouchableOpacity style={styles.optionButton} onPress={onCancelPress}>
                            <MaterialIcons name="cancel" size={30} color="black" />
                            <Text>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.optionButton} onPress={onConfirmPress}>
                            <AntDesign name="checkcircle" size={30} color="green" />
                            <Text>Accept</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </Pressable>
    </Modal>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: '#808080aa',
        width: '100%'
    },
    modalView: {
        padding: 20,
        borderRadius: 10,
        alignSelf: 'center',
        alignItems: 'center',
        width: '70%'
    },
    title: {
        marginBottom: 15,
        fontSize: 18,
        fontWeight: 'bold'
    },
    decisionRow: {
        flexDirection: 'row'
    },
    optionButton: {
        padding: 15,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderColor: 'gray',
        borderWidth: 1,
        marginHorizontal: 5,
        borderRadius: 8,
        width: 100
    }
})

export default AcceptModal;