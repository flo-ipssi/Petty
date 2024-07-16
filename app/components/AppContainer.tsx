import React, { FC, ReactNode } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { useSelector } from 'react-redux';
import { getAuthState } from '@/store/auth';
import AppNotification from './AppNotification';

interface Props {
   children: ReactNode;
}

const AppContainer: FC<Props> = ({ children }) => {
   const { loggedIn } = useSelector(getAuthState);

   return <SafeAreaView style={styles.container}>
      <AppNotification /> 
      {/* {loggedIn ?
         (null
         )
         : null} */}
      {children}
   </SafeAreaView>
};

const styles = StyleSheet.create({
   container: {
      flex: 1
   },
   buttonContainer: {
      height: 50,
      flexDirection: 'row',
      backgroundColor:'transparent'
   },
   leftContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
   },
   rightContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
   },
});

export default AppContainer;