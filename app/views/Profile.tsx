import React from 'react';
import { StyleSheet, View } from 'react-native';
import colors from '@/utils/colors';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import SettingTab from './profile/SettingTab';
import FilterTab from './profile/FilterTab';

interface Props { }

const Tab = createMaterialTopTabNavigator();

const Profile = () => {

   const Stack = createStackNavigator();

   return (
      <View style={styles.container}>
         <Tab.Navigator
            screenOptions={{
               tabBarStyle: styles.tabbarStyle,
               tabBarLabelStyle: styles.tabBarLabelStyle,
            }}>
            <Tab.Screen name="Filters" component={FilterTab} />
            <Tab.Screen name="Setting" component={SettingTab} />
         </Tab.Navigator>
      </View>
   )
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
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
   }
});

export default Profile;