import { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface Props {
    active?: boolean,
    onPress?(): void,
    style?:object
}

const Dot: FC<Props> = ({ active, onPress, style }) => {
    return <TouchableOpacity onPress={onPress} style={style}>
        <View style={[styles.dot, active ? styles.activeDot : styles.inactiveDot]} />
    </TouchableOpacity>
};

const styles = StyleSheet.create({
    dot: {
        width: 10,
        height: 10,
        borderRadius: 10,
        marginHorizontal: 5,
    },
    activeDot: {
        backgroundColor: 'blue',
    },
    inactiveDot: {
        backgroundColor: 'lightgray',
    },
});

export default Dot;