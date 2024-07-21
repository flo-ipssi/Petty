import React,{ FC, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import Icon from '@expo/vector-icons/AntDesign';
import colors from '@/utils/colors';


interface Props {
    color?: string
}

const Loader: FC<Props> = ({ color = colors.CONTRAST }) => {
    const initialRotation = useSharedValue(0);

    const transform = useAnimatedStyle(() => {
        return {
            transform : [{rotate: `${initialRotation.value}deg`}]
        }
    })

    useEffect(() => {
        initialRotation.value = withRepeat(withTiming(360), -1)
    })

    return <Animated.View style={transform}>
        <Icon name='loading1' size={20} color={color}>
        </Icon>
    </Animated.View>
};

const styles = StyleSheet.create({
    container: {}
});

export default Loader;