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
        <Icon style={styles.container} name="eye" color={colorCustom} size={sizeCustom} /> : 
        <Icon style={styles.container} name="eye-with-line" color={colorCustom} size={sizeCustom} />
    );
};

const styles = StyleSheet.create({
   container:{
    top: -5,
    right:20
   }
});

export default PassewordVisibilityIcon;