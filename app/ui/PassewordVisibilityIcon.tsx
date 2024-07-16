import { FC } from 'react';
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import colors from '@/utils/colors';

interface Props {
    privateIcon: boolean,
    isWhite?: boolean,
    customSize?: number
}

const PassewordVisibilityIcon: FC<Props> =  ({privateIcon, isWhite, customSize}) => {
    const colorCustom =isWhite ? "#FFF" : colors.DARK
    const sizeCustom =customSize ? customSize : 15
    return (
        privateIcon ? 
        <Icon name="eye" color={colorCustom} size={sizeCustom} /> : 
        <Icon name="eye-with-line" color={colorCustom} size={sizeCustom} />
    );
};

const styles = StyleSheet.create({
   container:{}
});

export default PassewordVisibilityIcon;