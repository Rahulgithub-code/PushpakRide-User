import { WSProvider } from '@/services/WSProvider'
import { Stack } from 'expo-router'
import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <WSProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="role" />
          <Stack.Screen name="customer/selectlocations" />
          <Stack.Screen name="customer/ridebooking" />
          <Stack.Screen name="customer/home" />
          <Stack.Screen name="customer/auth" />
          <Stack.Screen name="rider/home" />
          <Stack.Screen name="rider/auth" />
        </Stack>
      </WSProvider>
    </GestureHandlerRootView>
  )
}