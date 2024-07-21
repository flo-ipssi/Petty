import { FC } from 'react';
import { ImageSourcePropType, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';


interface Props {
    onPress?(): void,
    imageSource?: ImageSourcePropType,
    stylesCustom?: object,
    size?: number
}

const RoundButtonWithImage: FC<Props> = ({ onPress, imageSource, stylesCustom, size }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.button, stylesCustom]}>
            <Image source={imageSource} style={size ? {
                width: size, height: size, resizeMode: 'cover'
            } : styles.image} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        width: 70,
        height: 70,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 40,
        height: 40,
        resizeMode: 'contain'
    },
});

export default RoundButtonWithImage;