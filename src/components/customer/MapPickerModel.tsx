import { View, Text, Modal, TouchableOpacity, TextInput } from 'react-native'
import React, { FC, memo, useEffect, useRef, useState } from 'react'
import { modalStyles } from '@/styles/modalStyles';
import MapView, { Region } from 'react-native-maps';
import { useUserStore } from '@/services/userStore';
import { getLatLong, getPlacesSuggestions, reverseGeocode } from '@/utils/mapUtils';
import LocationItem from './LocationItem';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';

interface MapPickerModelProps {
    visible: boolean;
    onClose: () => void;
    title: string;
    selectedLocation: {
        latitude: number;
        longitude: number;
        address: string
    },
    onSelectLocation: (location: any) => void;
}

const MapPickerModel: FC<MapPickerModelProps> = ({
    visible, selectedLocation, onClose, title, onSelectLocation
}) => {
    const mapRef = useRef<MapView>(null);
    const [text, setText] = useState('');
    const { location } = useUserStore();
    const [address, setAddress] = useState('');
    const [region, setRegion] = useState<Region | null>(null)
    const [locations, setLocations] = useState([]);
    const textInputRef = useRef<TextInput>(null);

    useEffect(() => {
        if (selectedLocation?.latitude) {
            setAddress(selectedLocation?.address);
            setRegion({
                latitude: selectedLocation?.latitude,
                longitude: selectedLocation?.longitude,
                latitudeDelta: 0.5,
                longitudeDelta: 0.5
            });

            mapRef?.current?.fitToCoordinates(
                [{
                    latitude: selectedLocation?.latitude,
                    longitude: selectedLocation?.longitude
                }],
                {
                    edgePadding: { top: 50, left: 50, bottom: 50, right: 50 },
                    animated: true
                }
            )
        }
    }, [selectedLocation, mapRef])

    const addLocation = async (id: string) => {
        const data = await getLatLong(id);
        if (data) {
            setRegion({
                latitude: data.latitude,
                longitude: data.longitude,
                latitudeDelta: 0.5,
                longitudeDelta: 0.5
            });
            setAddress(data.address);
        }
        textInputRef.current?.blur();
        setText("");
    }

    const renderLocation = ({ item }: any) => {
        return (
            <LocationItem item={item} onPress={() => addLocation(item?.place_id)} />
        )
    }

    const handleRegionChangeComplete = async (newRegion: Region) => {
        try {
            const address = await reverseGeocode(
                newRegion.latitude,
                newRegion.longitude
            );
            setRegion(newRegion);
            setAddress(address)
        } catch (error) {
            console.error("handleRegionChangeComplete : error - ", error)
        }
    };

    const handleGpsButtonPress = async () => {
        try {
            const location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;
            mapRef.current?.fitToCoordinates([{ latitude, longitude }], {
                edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                animated: true
            });
            const address = await reverseGeocode(latitude, longitude);
            setAddress(address);
            setRegion({
                latitude: latitude,
                longitude: longitude,
                latitudeDelta: 0.5,
                longitudeDelta: 0.5
            });
        } catch (error) {
            console.error('Error fetching location on gps button press:', error);
        }
    }

    const fetchLocation = async (query: string) => {
        if (query?.length > 4) {
            const data = await getPlacesSuggestions(query);
        } else {
            setLocations([])
        }
    }

    return (
        <Modal
            animationType='slide'
            visible={visible}
            presentationStyle='formSheet'
            onRequestClose={onClose}>
            <View style={modalStyles.modalContainer}>
                <Text style={modalStyles.centerText}>Select {title}</Text>
                <TouchableOpacity onPress={onClose}>
                    <Text style={modalStyles.cancelButton}>Cancel</Text>
                </TouchableOpacity>
                <View style={modalStyles.searchContainer}>
                    <Ionicons name='search-outline' size={RFValue(16)} color="#777" />
                    <TextInput 
                    ref={textInputRef}
                    style={modalStyles.input}
                    placeholder='Search address'
                    placeholderTextColor="#aaa"
                    value={text}
                    onChangeText={(e)=>{
                        setText(e);
                        fetchLocation(e);
                    }}
                    />

                </View>
            </View>

        </Modal>
    )
}

export default memo(MapPickerModel)