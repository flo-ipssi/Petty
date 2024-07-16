import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '@/views/Home';
import Profile from '@/views/Profile';
import Apartment from '@/views/Apartment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Messages from '@/views/Messages';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    // const navigation = useNavigation<NavigationProp<LoggedInStackParamList>>();

    return <Tab.Navigator screenOptions={{
        tabBarStyle: {
            backgroundColor: '#FFF',
            position: 'relative'
        },
        headerShown: false,
    }}>
        <Tab.Screen name='Home' component={Home} options={{
            headerShown: false,
            tabBarIcon: (props) => {
                return <MaterialCommunityIcons name="cards" size={props.size} color={props.color} />;
            },
            tabBarLabel: ''
        }} />
        <Tab.Screen name='Profile' component={Profile} options={{
            headerShown: false,
            tabBarIcon: (props) => {
                return <AntDesign name="user" size={props.size} color={props.color} />;
            },
            tabBarLabel: '',
        }} />
        <Tab.Screen name='Apartment'
            component={Apartment} options={{
                title: 'Editer le profil',
                tabBarIcon: (props) => {
                    return <AntDesign name="home" size={props.size} color={props.color} />;
                },
                tabBarLabel: '',

            }} />
        <Tab.Screen name='Message' component={Messages} options={{
            headerShown: false,
            tabBarIcon: (props) => {
                return <MaterialCommunityIcons name="message-processing" size={props.size} color={props.color} />;
            },
            tabBarLabel: ''
        }} />
    </Tab.Navigator>
}

export default TabNavigator