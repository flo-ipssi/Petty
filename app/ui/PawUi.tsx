import { FC } from 'react';
import { FlexStyle, Image, StyleSheet } from 'react-native';

interface Props {
    size: number,
    rotate: string,
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
            position: 'fixed',
            transform: [{ rotate: rotate }],
            ...viewPosition
        }}
            source={require('../assets/logos/no-label.png')} />
    )
};

const styles = StyleSheet.create({
    container: {}
});

export default PawUi;