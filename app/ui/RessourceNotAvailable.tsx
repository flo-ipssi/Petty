import React, { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import colors from '@/utils/colors';

interface Props {
  title:string,
  message:string,
  icon?:any
}

const RessourceNotAvailable: FC<Props> = ({title, message, icon}) => {
    return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        {icon ? icon : <Text style={styles.errorCode}>{title}</Text>}
        <Text style={styles.errorMessage}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
      },
      innerContainer: {
        // backgroundColor: '#FFFFFF', 
        // borderColor: '#E5E7EB', 
        // borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16, 
        paddingVertical: 32, 
        // borderRadius: 8,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.25, 
        // shadowRadius: 3.84, 
        elevation: 5,
      },
      errorCode: {
        fontSize: 40,
        fontWeight: 'bold',
        color: colors.GRAY,
      },
      errorMessage: {
        width:'80%',
        textAlign:'center',
        fontSize: 16,
        fontWeight: 'bold',
        color: '#6B7280', 
        marginTop: 16, 
      }
});

export default RessourceNotAvailable;