import { StyleSheet, Text, TouchableOpacity, View, Modal, Pressable, ActivityIndicator } from 'react-native'
import React from 'react'
import { Feather } from '@expo/vector-icons';

const UploadModal = ({
    modalVisible,
    onBackPress,
    onCameraPress,
    onGalleryPress,
    onRemovePress,
    isLoading = false
}) => {
  return (
    <Modal animationType='fade' visible={modalVisible} transparent={true}>
        <Pressable style={styles.container} onPress={onBackPress}>
            {isLoading && <ActivityIndicator size={70} color={'blue'}/>}

            {!isLoading && (
                <View style={[styles.modalView, { backgroundColor: 'white' }]}>
                    <Text style={styles.title}>Product Image</Text>

                    <View style={styles.decisionRow}>
                        <TouchableOpacity style={styles.optionButton} onPress={onCameraPress}>
                            <Feather name="camera" size={30} color="black" />
                            <Text>Camera</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.optionButton} onPress={onGalleryPress}>
                            <Feather name="image" size={30} color="black" />
                            <Text>Gallery</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.optionButton} onPress={onRemovePress}>
                            <Feather name="trash-2" size={30} color="black" />
                            <Text>Remove</Text>
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
        width: '90%'
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

export default UploadModal