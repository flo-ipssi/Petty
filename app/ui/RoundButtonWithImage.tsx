import { FC } from 'react';
import { Image, ImageSourcePropType, StyleSheet, TouchableOpacity } from 'react-native';

interface Props {
    onPress?(): void,
    imageSource?: ImageSourcePropType,
    stylesCustom?: object,
    size?:number
}

const RoundButtonWithImage: FC<Props> = ({ onPress, imageSource, stylesCustom,size }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.button, stylesCustom]}>
            <Image source={imageSource} style={ size ? {
        width: size, height: size, resizeMode: 'contain'}:styles.image} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        width: 70,
        height: 70,
        borderRadius: 50, // pour un bouton rond
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