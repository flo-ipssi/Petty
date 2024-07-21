import React from 'react';
import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import colors from '@/utils/colors';

const ProfileLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
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
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="Profile"
        options={{
          tabBarIcon: (props) => {
            return <FontAwesome name="user" size={props.size} color={props.color} />;
          },
          tabBarLabel: '',
        }}
      />
      <Tabs.Screen
        name="Filters"
        options={{
          tabBarIcon: (props) => {
            return <FontAwesome name="filter" size={props.size} color={props.color} />;
          },
          tabBarLabel: 'Filters',
        }}
      />
      <Tabs.Screen
        name="Setting"
        options={{
          tabBarIcon: (props) => {
            return <FontAwesome name="cog" size={props.size} color={props.color} />;
          },
          tabBarLabel: 'Setting',
        }}
      />
    </Tabs>
  );
};

export default ProfileLayout;
