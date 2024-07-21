import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthStackParamList } from "@/@types/navigation";
import LostPassword from "@/app/views/auth/LostPassword";
import SignIn from "@/app/views/auth/SignIn";
import SignUp from "@/app/views/auth/SignUp";
import Verification from "@/app/views/auth/Verification";

const Stack = createNativeStackNavigator<AuthStackParamList>()
 
const AuthNavigator = () => {
   return <Stack.Navigator screenOptions={{
      headerShown: false
   }}>
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="LostPassword" component={LostPassword} />
      <Stack.Screen name="Verification" component={Verification} />
   </Stack.Navigator>
};


export default AuthNavigator;