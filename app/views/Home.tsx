import { createStackNavigator } from '@react-navigation/stack';
import React, { FC } from 'react';
import SwipeList from './meet/SwipeList';
import PetDetails from './meet/PetDetails';

interface Props { }

const Stack = createStackNavigator();
const Home: FC<Props> = props => {

  return (
    <Stack.Navigator
    >
      <Stack.Screen
        options={{ headerShown: false, }}
        name="SwipeList"
        component={SwipeList} />
      <Stack.Screen
        options={({ route }) => ({
          headerShown: true,
          title: route.params?.title || '',
        })}
        name="PetDetails"
        component={PetDetails} />
    </Stack.Navigator>)
};


export default Home;