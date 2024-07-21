import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useEffect } from "react";
import "react-native-reanimated";
import AppContainer from "@/components/AppContainer";
import AppNavigator from "./navigation";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import store from "@/store";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Button } from "react-native";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  const [loaded, error] = useFonts({
    Poppins_Regular: require('@/assets/fonts/Poppins-Regular.ttf'),
    Poppins_Medium: require('@/assets/fonts/Poppins-Medium.ttf'),
    Poppins_Thin: require('@/assets/fonts/Poppins-Thin.ttf'),
    Poppins_Light: require('@/assets/fonts/Poppins-Light.ttf'),
    Poppins_Bold: require('@/assets/fonts/Poppins-SemiBold.ttf'),
    Poppins: require("../assets/fonts/Poppins-Medium.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const queryClient = new QueryClient()
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppContainer>
          {/* <Button
            title="Press me"
            onPress={() => {
              throw new Error("Hello, again, Sentry!");
            }}
          /> */}
          <AppNavigator />
        </AppContainer>
      </QueryClientProvider>
    </Provider>
  );
}
