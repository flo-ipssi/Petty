import AppContainer from "./components/AppContainer";
import AppNavigator from "./navigation";
import React, { useCallback } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import store from "./store";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();
export default function Index() {
  const queryClient = new QueryClient()
  const [isLoaded] = useFonts({
    Poppins_Regular: require('@/assets/fonts/Poppins-Regular.ttf'),
    Poppins_Medium: require('@/assets/fonts/Poppins-Medium.ttf'),
    Poppins_Thin: require('@/assets/fonts/Poppins-Thin.ttf'),
    Poppins_Light: require('@/assets/fonts/Poppins-Light.ttf'),
    Poppins_Bold: require('@/assets/fonts/Poppins-SemiBold.ttf')
  })
  const handleOnLayout = useCallback(async () => {
    if (isLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [isLoaded]);

  if (!isLoaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppContainer>
          <AppNavigator />
        </AppContainer>
      </QueryClientProvider>
    </Provider>
  );
}
