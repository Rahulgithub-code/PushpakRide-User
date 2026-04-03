import { logout } from '@/services/authService';
import { useUserStore } from '@/services/userStore';
import { useWS } from '@/services/WSProvider';
import { uiStyles } from '@/styles/uiStyles';
import { Colors } from '@/utils/Constants';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react'
import { TouchableOpacity, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomText from '../shared/CustomText';

const LocationBar = () => {
    const { location } = useUserStore();
    const { disconnect } = useWS();

    return (
        <View style={uiStyles.absoluteTop}>
            <SafeAreaView />
            <View style={uiStyles.container}>
                <TouchableOpacity style={uiStyles.btn} onPress={() => logout(disconnect)}>
                    <AntDesign name='poweroff' size={RFValue(12)} color={Colors.text} />
                </TouchableOpacity>

                <TouchableOpacity style={uiStyles.locationBar}
                onPress={()=>router.navigate('/customer/selectlocations')}>
                    <View style={uiStyles.dot}></View>
                    <CustomText numberOfLines={1} style={uiStyles.locationText}>
                        {location?.address || "Getting address..."}
                    </CustomText>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default LocationBar