import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import React, { FC } from 'react';
import SwipeList from './meet/SwipeList';
import PetDetails from './meet/PetDetails';

interface PetDetailsScreenParams {
  title: string;
}

type RootStackParamList = {
  SwipeList: undefined;
  PetDetails: PetDetailsScreenParams;
};

const Stack = createStackNavigator<RootStackParamList>();

const Home: FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }}
        name="SwipeList"
        component={SwipeList} />
      <Stack.Screen
        options={({ route }) => ({
          headerShown: true,
          title: route.params?.title || '',
        })}
        name="PetDetails"
        component={PetDetails} />
    </Stack.Navigator>
  );
};

export default Home;
