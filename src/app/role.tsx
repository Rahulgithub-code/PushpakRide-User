import CustomText from '@/components/shared/CustomText'
import { roleStyles } from '@/styles/roleStyles'
import { router } from 'expo-router'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'

const Role = () => {
  const handleCustomerPress = () => {
    router.navigate('/customer/auth');
  }
  const handleRiderPress = () => {
    router.navigate('/rider/auth');
  }
  return (
    <View style={roleStyles.container}>
     <Image 
     source={require("@/assets/images/logo_t.png")}
     style={roleStyles.logo}
     />
     <CustomText variant="h6" fontFamily='Medium'>
      Choose your user type
      </CustomText>
      <TouchableOpacity style={roleStyles.card} onPress={handleCustomerPress}>
        <Image 
        source={require("@/assets/images/customer.jpg")}
        style={roleStyles.image}
        />

        <View style={roleStyles.cardContent}>
          <CustomText style={roleStyles.title}>Customer</CustomText>
           <CustomText style={roleStyles.description}>
            Are you a customer? Book your ride with Pushpak
           </CustomText>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={roleStyles.card} onPress={handleRiderPress}>
        <Image 
        source={require("@/assets/images/rider.jpg")}
        style={roleStyles.image}
        />

        <View style={roleStyles.cardContent}>
          <CustomText style={roleStyles.title}>Rider</CustomText>
           <CustomText style={roleStyles.description}>
            Are you a rider? Join Pushpak and start delivering rides
           </CustomText>
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default Role