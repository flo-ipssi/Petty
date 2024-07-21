import React, { FC } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from '@expo/vector-icons/FontAwesome5';

interface Props {
    label?: string,
    icon?: string,
    isChecked?: boolean,
    onPress?(): void
}

const AnimalCheckbox: FC<Props> = ({ label, icon, isChecked, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.container}>
            <Icon name={icon} size={30} color={isChecked ? 'green' : 'black'} />
            {/* <Text style={styles.label}>{label}</Text> */}
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        marginHorizontal:20,
    },
    label: {
        fontSize: 15,
    },
});

export default AnimalCheckbox;