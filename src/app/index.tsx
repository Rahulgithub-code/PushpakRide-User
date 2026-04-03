import CustomText from '@/components/shared/CustomText';
import { commonStyles } from '@/styles/commonStyles';
import { splashStyles } from '@/styles/splashStyles';
import { useFonts } from 'expo-font';
import React from 'react';
import { Image, View } from 'react-native';

const Main = () => {
  const [loaded] = useFonts({
    Bold: require('../assets/fonts/NotoSans-Bold.ttf'),
    Regular: require('../assets/fonts/NotoSans-Regular.ttf'),
    Medium: require('../assets/fonts/NotoSans-Medium.ttf'),
    Light: require('../assets/fonts/NotoSans-Light.ttf'),
    SemiBold: require('../assets/fonts/NotoSans-SemiBold.ttf'),
  });
  
  return (
    <View style = {commonStyles.container}>
      <Image 
      source={require('../assets/images/logo_t.png')}
      style={splashStyles.img}
      />
      <CustomText variant="h5" fontFamily='Medium' style={splashStyles.text}>
        Made in 🇮🇳
      </CustomText>
    </View>
  )
}

export default Main