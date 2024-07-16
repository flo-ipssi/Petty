import React, { FC, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { getAuthState } from '@/store/auth';
import AppNotification from './AppNotification';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props {
   children: ReactNode;
}

const AppContainer: FC<Props> = ({ children }) => {
   const { loggedIn } = useSelector(getAuthState);

   return (
      <SafeAreaView style={styles.safeArea}>
            <AppNotification />
            {children}
      </SafeAreaView>
   );
};

const styles = StyleSheet.create({
   safeArea: {
      flex: 1,
   },
});

export default AppContainer;
