import React from 'react'
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native'
import { Feather } from '@expo/vector-icons'
import placeholder from '../../assets/default_image.jpg'

const Avatar = ({
    uri,
    style,
    imgStyle,
    onPress,
    onButtonPress,
    aviOnly = false,
    ...props
}) => {
    return (
        <View
            style={[styles.container, { marginBottom:
            aviOnly ? 0 : 30 }, style]}
            {...props}
        >
            <TouchableOpacity>
                <Image
                    source={ uri ? { uri } : placeholder }
                    style={[
                        styles.itemImage,
                        aviOnly && { height: 35, width: 35, borderWidth: 0 },
                        imgStyle
                    ]}
                />

                {!aviOnly && (
                    <TouchableOpacity style={styles.editButton} onPress={onButtonPress}>
                        <Feather name="camera" size={24} color="white" />
                    </TouchableOpacity>
                )}
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        position: 'relative'
    },
    itemImage: {
        borderRadius: 75,
        width: 150,
        height: 150,
        borderColor: '#ccc',
        borderWidth: 2,
        alignSelf: 'center'
    },
    editButton: {
        backgroundColor: 'gray',
        borderRadius: 24,
        padding: 8,
        position: 'absolute',
        right: 5,
        bottom: 5
    }
})

export default Avatar