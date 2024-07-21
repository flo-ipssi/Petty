import { FC } from 'react';
import { FlexStyle, StyleSheet } from 'react-native';
import { Image } from 'expo-image';


interface Props {
    size: number,
    rotate: { [key: string]: string },
    position: "left-bottom" | "bottom-right"
}

const PawUi: FC<Props> = ({ size,rotate, position }) => {
    let viewPosition: FlexStyle = {};

    switch (position) {
        case "left-bottom":
            viewPosition = {
                left: -95,
                bottom: 40
            }
            break;
        case "bottom-right":
            viewPosition = {
                right: -45,
                bottom: -100
            }
            break;
    }

    return (
        <Image style={{
            width: size,
            height: size,
            position: 'absolute',
            // transform: rotate,
            // ...viewPosition
        }}
            source={require('../assets/logos/no-label.png')} />
    )
};

const styles = StyleSheet.create({
    container: {}
});

export default PawUi;