import React , { FC } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Loader from './Loader';

interface Props {
    title: string,
    onPress?(): void,
    styleCustomContainer?: object,
    styleCustomTitle?: object, 
    busy?: boolean
}

const AppButton: FC<Props> = ({ title,busy, onPress, styleCustomContainer,styleCustomTitle  }) => {
    return <Pressable onPress={onPress} style={[styles.container, styleCustomContainer]}>
        {!busy ? <Text style={[styles.title, styleCustomTitle]}>{title}</Text> :
        <Loader />}
    </Pressable>
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
        marginHorizontal:"auto", 
    },
    title: {
    }
});

export default AppButton;