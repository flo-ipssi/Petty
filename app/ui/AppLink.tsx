import { FC } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import colors from '@/utils/colors';

interface Props {
    title: string;
    onPress?(): void;
    active?:boolean;
}

const AppLink: FC<Props> = ({active = true, onPress,title}) => {
    return <Pressable onPress={active ? onPress: null} style={{opacity: active ? 1 : 0.4}} >
        <Text style={styles.title} onPress={onPress}>{title}</Text>
    </Pressable>
};

const styles = StyleSheet.create({
    title: {
        color: colors.SECONDARY
    }
});

export default AppLink;