import { commonStyles } from '@/styles/commonStyles';
import { rideStyles } from '@/styles/rideStyles';
import { Colors } from '@/utils/Constants';
import { Ionicons } from '@expo/vector-icons';
import React, { FC } from 'react'
import { View } from 'react-native';
import CustomText from '../shared/CustomText';
import { orderStyles } from '@/styles/riderStyles';
import SwipeButton from 'rn-swipe-button';
import { RFValue } from 'react-native-responsive-fontsize';

const RiderActionButton: FC<{
    ride: any;
    color?: string;
    title: string;
    onPress: () => void
}> = ({ ride, color = Colors.iosColor, title, onPress }) => {
    const CheckOutButton = () => {
        return (
            <Ionicons name='arrow-forward-sharp' style={{ bottom: 2 }} size={32} color="#fff" />
        );
        
    };
    return (
        <View style={rideStyles?.swipeableContaniner}>
            <View style={commonStyles.flexRowBetween}>
                <CustomText fontFamily='Medium' fontSize={11} numberOfLines={1} style={{ marginTop: 10, marginBottom: 3 }}>
                    Meet the Customer
                </CustomText>
                <CustomText fontFamily='Medium' fontSize={11} numberOfLines={1} style={{ marginTop: 10, marginBottom: 3 }}>
                    +91 {" "}
                    {ride?.customer?.phone &&
                        ride?.customer?.phone?.slice(0, 5) +
                        " " +
                        ride?.customer?.phone?.slice(5)}
                </CustomText>
            </View>
            <View style={orderStyles.locationsContainer}>
                <View style={orderStyles.flexRowBase}>
                    <View>
                        <View style={orderStyles?.pickupHollowCircle} />
                        <View style={orderStyles?.continuousLine} />
                    </View>
                    <View style={orderStyles?.infoText}>
                        <CustomText fontSize={11} fontFamily='SemiBold' numberOfLines={1}>
                            {ride?.pickup?.address?.slice(0.10)}
                        </CustomText>
                        <CustomText numberOfLines={2} fontSize={9.5} fontFamily='Medium' style={orderStyles.label}>
                            {ride?.pickup?.address}
                        </CustomText>
                    </View>
                </View>

                <View style={orderStyles?.flexRowBase}>
                    <View style={orderStyles?.dropHollowCircle} />
                    <View style={orderStyles?.infoText}>
                        <CustomText fontSize={11} numberOfLines={1} fontFamily='SemiBold'>
                            {ride?.drop?.address?.slice(0, 10)}
                        </CustomText>
                        <CustomText numberOfLines={2} fontSize={9.5} fontFamily='Medium' style={orderStyles.label}>
                            {ride?.drop?.address}
                        </CustomText>
                    </View>
                </View>
            </View>
            <SwipeButton
            containerStyles={rideStyles.swipeButtonContainer}
            height={30}
            shouldResetAfterSuccess={true}
            resetAfterSuccessAnimDelay={200}
            onSwipeSuccess={onPress}
            railBackgroundColor={color}
            railStyles={rideStyles.railStyles}
            railBorderColor='transparent'
            railFillBackgroundColor='rgba(255, 255, 255, 0.6)'
            railFillBorderColor='transparent'
            titleColor='#fff'
            titleFontSize={RFValue(13)}
            titleStyles={rideStyles.titleStyles}
            thumbIconComponent={CheckOutButton}
            thumbIconStyles={rideStyles.thumbIconStyles}
            title={title.toUpperCase()}
            thumbIconBackgroundColor='transparent'
            thumbIconBorderColor='transparent'
            thumbIconHeight={50}
            thumbIconWidth={60}
            />
        </View>
    )
}

export default RiderActionButton