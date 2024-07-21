import React, { useRef } from 'react';
import { StyleSheet, View, ScrollView, Dimensions } from 'react-native';
import colors from '@/utils/colors';
import SettingTab from './profile/SettingTab';
import FilterTab from './profile/FilterTab';

import { createStackNavigator } from '@react-navigation/stack';

const { width } = Dimensions.get('window');

const Profile = () => {
   const Stack = createStackNavigator();
   //   const scrollViewRef = useRef(null);

   return (
      //  <View style={styles.container}>

      //    <ScrollView
      //      ref={scrollViewRef}
      //      horizontal
      //      pagingEnabled
      //      showsHorizontalScrollIndicator={false}
      //      style={styles.scrollView}
      //    >
      //      <View style={[styles.page, { width }]}>
      //        <FilterTab />
      //         </View>
      //      </ScrollView>
      //      <View style={[styles.page, { width }]}>
      //        <SettingTab />
      //      </View>
      //  </View>

      <Stack.Navigator>
         <Stack.Screen name="FilterTab" component={FilterTab} options={{ headerShown: false }} />
         <Stack.Screen name="SettingTab" component={SettingTab} options={{ headerTitle: "Paramètres" }}  />
      </Stack.Navigator>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
   },
   scrollView: {
      flex: 1,
   },
   page: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
   },
   tabbarStyle: {
      backgroundColor: 'transparent',
      elevation: 0,
      shadowRadius: 0,
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
   },
   tabBarLabelStyle: {
      color: colors.DARK,
      fontSize: 12,
   },
});

export default Profile;
