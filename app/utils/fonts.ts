import * as Font from 'expo-font';

export const loadFonts = async () => {
  await Font.loadAsync({
    Poppins_Regular: require('@/assets/fonts/Poppins-Regular.ttf'),
    Poppins_Medium: require('@/assets/fonts/Poppins-Medium.ttf'),
    Poppins_Thin: require('@/assets/fonts/Poppins-Thin.ttf'),
    Poppins_Light: require('@/assets/fonts/Poppins-Light.ttf'),
    Poppins_Bold: require('@/assets/fonts/Poppins-SemiBold.ttf')
  });
};

export const Fonts = {
  medium: 'Poppins_Medium',
  regular: 'Poppins_Regular',
  thin: 'Poppins_Thin',
  light: 'Poppins_Light',
  bold: 'Poppins_Bold',
};
