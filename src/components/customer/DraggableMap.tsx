import { useUserStore } from '@/services/userStore';
import { useWS } from '@/services/WSProvider';
import { customMapStyle, indiaIntialRegion } from '@/utils/CustomMap';
import { reverseGeocode } from '@/utils/mapUtils';
import { useIsFocused } from '@react-navigation/native';
import React, { FC, memo, useRef, useState } from 'react'
import { View } from 'react-native';
import MapView, { Region } from 'react-native-maps';
import haversine from 'haversine-distance';

const DraggableMap: FC<{ height: number }> = ({ height }) => {
    const isFocused = useIsFocused();
    const [marker, setMarker] = useState<any>([]);
    const mapRef = useRef<MapView>(null);
    const { setLocation, location, outOfRange, setOutOfRange } = useUserStore();
    const { emit, on, off } = useWS();
    const MAX_DISTANCE_THRESHOLD = 10000; // in meters

    const handleRegionChangeComplete = async (newRegion: Region) => {
        const address = await reverseGeocode(
            newRegion.latitude,
            newRegion.longitude
        );
        setLocation({
            latitude: newRegion.latitude,
            longitude: newRegion.longitude,
            address: address,
        });

        const userLocation = {
            latitude: location?.latitude,
            longitude: location?.longitude,
        } as any;

        if (userLocation) {
            const newLocation = {
                latitude: newRegion.latitude,
                longitude: newRegion.longitude,
            };
            const distance = haversine(userLocation, newLocation);
            setOutOfRange(distance > MAX_DISTANCE_THRESHOLD);
        }
    };

    return (
        <View style={{ height: height, width: '100%' }}>
            <MapView
                ref={mapRef}
                maxZoomLevel={16}
                minZoomLevel={12}
                pitchEnabled={false}
                onRegionChangeComplete={handleRegionChangeComplete}
                style={{ flex: 1 }}
                initialRegion={indiaIntialRegion}
                provider='google'
                showsMyLocationButton={false}
                showsCompass={false}
                showsIndoors={false}
                showsIndoorLevelPicker={false}
                showsTraffic={false}
                showsScale={false}
                showsBuildings={false}
                showsPointsOfInterest={false}
                customMapStyle={customMapStyle}
                showsUserLocation={true}
            ></MapView>
        </View>
    )
}

export default memo(DraggableMap);