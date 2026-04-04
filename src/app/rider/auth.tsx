import CustomText from '@/components/shared/CustomText'
import { authStyles } from '@/styles/authStyles'
import { commonStyles } from '@/styles/commonStyles'
import React, { useState } from 'react'
import { Alert, Image, TouchableOpacity, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MaterialIcons } from '@expo/vector-icons';
import { useWS } from '@/services/WSProvider'
import PhoneInput from '@/components/shared/PhoneInput'
import CustomButton from '@/components/shared/CustomButton'
import { signin } from '@/services/authService'

function Auth() {
  const { updateAccessToken } = useWS();
  const [phone, setPhone] = useState('');

  const handleNext = async () => {
    if (!phone && phone.length !== 10) {
      Alert.alert('Please enter a valid phone number');
      return;
    }

    signin({
      role: 'rider',
      phone
    }, updateAccessToken);
  };
  return (
    <SafeAreaView style={authStyles.container}>
      <ScrollView contentContainerStyle={authStyles.container}>
        <View style={commonStyles.flexRowBetween}>
          <Image
            source={require("@/assets/images/rider_logo.png")}
            style={authStyles.logo}
          />
          <TouchableOpacity style={authStyles.flexRowGap}>
            <MaterialIcons name="help" size={18} color="grey" />
            <CustomText variant='h7' fontFamily='Medium'>Help</CustomText>
          </TouchableOpacity>
        </View>

        <CustomText fontFamily='Medium' variant='h6'>
          Good to see you, Rider!
        </CustomText>

        <CustomText fontFamily='Regular' variant='h7' style={commonStyles.lightText}>
          Enter your phone number to proceed
        </CustomText>

        <PhoneInput
          value={phone}
          onChangeText={setPhone}
        />
      </ScrollView>

      <View style={authStyles.footerContainer}>
        <CustomText fontFamily='Regular' variant='h8' style={[commonStyles.lightText, { textAlign: 'center', marginHorizontal: 20 }]}>
          By continuing, you agree to the terms and privacy policy of Pushpak Ride
        </CustomText>
        <CustomButton
          title='Next'
          onPress={handleNext}
          loading={false}
          disabled={false}
        />
      </View>

    </SafeAreaView>
  )
}

export default Auth