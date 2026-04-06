import { useWS } from '@/services/WSProvider';
import { commonStyles } from '@/styles/commonStyles';
import { rideStyles } from '@/styles/rideStyles';
import React, { FC, memo } from 'react'
import { Image, TouchableOpacity, View } from 'react-native';
import CustomText from '../shared/CustomText';
import { vehicleIcons } from '@/utils/mapUtils';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { resetAndNavigate } from '@/utils/Helpers';

type VehicleType = 'bike' | 'auto' | 'cabEconomy' | 'cabPremium';

interface RideItem {
    vehicle?: VehicleType;
    _id: string;
    pickup?: { address: string };
    drop?: { address: string };
    fare?: number;
    otp?: string;
    rider: any;
    status: string
}

const LiveTracingSheet: FC<{ item: RideItem }> = ({ item }) => {
    const { emit } = useWS();
    return (
        <View>
            <View style={rideStyles?.headerContainer}>
                <View style={commonStyles.flexRowBetween}>
                    {item?.vehicle && (
                        <Image source={vehicleIcons[item.vehicle]?.icon} style={rideStyles?.rideIcon} />
                    )}
                    <View style={{ marginLeft: 10 }}>
                        <CustomText fontSize={10}>{item?.status === "START" ? "Rider near you" : item?.status === "ARRIVED" ? "HAPPY JOURNEY" : "WOHOO 🎉"}</CustomText>
                        <CustomText>
                            {item?.status === "START" ? `OTP - ${item?.otp}` : "🕶️"}
                        </CustomText>
                    </View>
                </View>
                {item?.rider?.phone && (
                    <CustomText fontSize={11} numberOfLines={1} fontFamily='Medium'>
                        +91 {" "}
                        {item?.rider?.phone && item?.rider?.phone?.slice(0,5) +
                        " "+ item?.rider?.phone?.slice(5)}
                    </CustomText>
                )}
            </View>
            <View style={{padding: 10}}>
                <CustomText fontFamily='SemiBold' fontSize={12}>
                    Location Details
                </CustomText>
                <View style={[
                    commonStyles.flexRowGap,
                    {marginVertical: 15, width: '90%'}
                ]}>
                    <Image source={require("@/assets/icons/marker.png")} style={rideStyles.pinIcon}/>
                    <CustomText fontSize={10} numberOfLines={2}>
                        {item?.pickup?.address}
                    </CustomText>
                </View>
                <View style={{marginVertical: 20}}>
                    <View style={[commonStyles.flexRowBetween]}>
                        <View style={commonStyles.flexRow}>
                            <MaterialCommunityIcons name='credit-card' size={24} color="black" />
                            <CustomText style={{marginLeft: 10}} fontFamily='SemiBold' fontSize={12}>
                                Payment
                            </CustomText>
                        </View>
                        <CustomText fontFamily='SemiBold' fontSize={14}>
                            ₹{item.fare?.toFixed(2)}
                        </CustomText>
                    </View>
                    <CustomText fontSize={10}>Payment via cash</CustomText>
                </View>
            </View>
            <View style={rideStyles.bottomButtonContainer}>
                <TouchableOpacity style={rideStyles.cancelButton} onPress={()=>{emit("cancleRide", item?._id)}}>
                    <CustomText style={rideStyles.cancelButtonText}>Cancel</CustomText>
                </TouchableOpacity>
                <TouchableOpacity
                style={rideStyles.backButton2}
                onPress={()=>{
                    if(item?.status === "COMPLETED"){
                        resetAndNavigate("/customer/home");
                    }
                }}
                >Back</TouchableOpacity>
            </View>
        </View>
    )
}

export default memo(LiveTracingSheet)