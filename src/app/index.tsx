import CustomText from '@/components/shared/CustomText';
import { zustandStorage } from '@/services/storage';
import { useUserStore } from '@/services/userStore';
import { commonStyles } from '@/styles/commonStyles';
import { splashStyles } from '@/styles/splashStyles';
import { useFonts } from 'expo-font';
import React, { useEffect, useState } from 'react';
import { Alert, Image, View } from 'react-native';
import {jwtDecode} from 'jwt-decode';
import { resetAndNavigate } from '@/utils/Helpers';
import { refreshAccessToken } from '@/services/apiInterceptors';
import { logout } from '@/services/authService';

interface DecodedToken {
  exp: number;
}

const Main = () => {
  const [loaded] = useFonts({
    Bold: require('../assets/fonts/NotoSans-Bold.ttf'),
    Regular: require('../assets/fonts/NotoSans-Regular.ttf'),
    Medium: require('../assets/fonts/NotoSans-Medium.ttf'),
    Light: require('../assets/fonts/NotoSans-Light.ttf'),
    SemiBold: require('../assets/fonts/NotoSans-SemiBold.ttf'),
  });
  const {user} = useUserStore();
  const [hasNavigated, setHasNavigated] = useState(false);

  const tokenCheck = async () => {
    const accessToken = await zustandStorage.getItem('access_token') as string;
    const refreshToken = await zustandStorage.getItem('refresh_token') as string;
    if (accessToken) {
      const decodedAccessToken = jwtDecode<DecodedToken>(accessToken);
      const decodedRefreshToken = jwtDecode<DecodedToken>(refreshToken);

      const currentTime = Date.now() / 1000; // in seconds

      if (decodedRefreshToken?.exp > currentTime) {
        logout();
        Alert.alert('Your session has expired. Please log in again.');
      }
      if (decodedAccessToken?.exp < currentTime) {
        try {
          refreshAccessToken();
        } catch (error) {
          console.error('Error refreshing token:', error);
          Alert.alert('Refresh Token Error');
        }
      }
      if(user){
        resetAndNavigate('/customer/home');
      }else{
        resetAndNavigate('/rider/home');
      }
      return;
    }
    resetAndNavigate('/role');
  }

  useEffect(() => {
    if (loaded && !hasNavigated) {
      const timeoutId = setTimeout(() => {
        tokenCheck();
        setHasNavigated(true);
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [loaded, hasNavigated]);

  
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