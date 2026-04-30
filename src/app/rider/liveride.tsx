import { useRiderStore } from '@/services/riderStore';
import { useWS } from '@/services/WSProvider';
import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react'
import { Alert, View } from 'react-native';
import * as Location from 'expo-location';
import { resetAndNavigate } from '@/utils/Helpers';
import { rideStyles } from '@/styles/rideStyles';
import { StatusBar } from 'expo-status-bar';
import RiderLiveTracking from '@/components/rider/RiderLiveTracking';
import { updateRideStatus } from '@/services/rideService';
import RiderActionButton from '@/components/rider/RiderActionButton';
import OptInputModal from '@/components/rider/OptInputModal';
import { logout } from '@/services/authService';

const LiveRide = () => {
  const {emit, on, off} = useWS();
  const [isOtpModalVisible, setOtpModalVisible] = useState(false);
  const {setLocation, location, setOnDuty} = useRiderStore();
  const [rideData, setRideData] = useState<any>(null);
  const route = useRoute() as any;
  const params = route?.param || {};
  const id = params?.id;

  useEffect(()=>{
      let locationsSubscribe: any;
      const startLocationUpdates = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          locationsSubscribe = await Location.watchPositionAsync({
            accuracy: Location.Accuracy.High,
            timeInterval: 5000,
            distanceInterval: 2
          },
            (location) => {
              const { latitude, longitude, heading } = location.coords;
              setLocation({
                latitude: latitude,
                longitude: longitude,
                address: "Somewhere",
                heading: heading as number
              });

              setOnDuty(true);

              emit('goOnDuty',{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                address: "Somewhere",
                heading: heading as number
              })
  
              emit("updateLocation", {
                latitude, longitude, heading
              });
              console.log(
                `Location updated: Lat ${latitude}, Lon ${longitude}, Heading: ${heading}`
              );
            }
          )
        }else{
          console.log("Location permission denied");
        }
      }
      startLocationUpdates();

      return ()=>{
        if(locationsSubscribe){
          locationsSubscribe.remove();
        }
      }
    }, [id]);

    useEffect(()=>{
      console.log("liveride : id - " + id);      
        if(id){
          emit("subscribeRide", id);
          
          on("rideData", (data)=>{
            setRideData(data);
          })
    
          on("rideUpdate", (data)=>{
            setRideData(data);
          })
    
          on("rideCanceled", (error)=>{
            resetAndNavigate("/rider/home");
            Alert.alert("Ride Canceled");
          });
    
          on("error", (error)=>{
            resetAndNavigate("/rider/home");
            Alert.alert("Oh Dang ! No Riders Found");
          });
        }
    
        return ()=>{
          off('rideData',()=>{});
          off('error',()=>{});
        }
    
      },[id, on, off, emit]);
  return (
    <View style={rideStyles.container}>
      <StatusBar style='light' backgroundColor='orange' translucent={false} />
      {rideData && (
        <RiderLiveTracking
          status= {rideData?.status}
          drop={{
          latitude: parseFloat(rideData?.drop.latitude),
          longitude: parseFloat(rideData?.drop.longitude),
        }}
        pickup={{
          latitude: parseFloat(rideData?.pickup.latitude),
          longitude: parseFloat(rideData?.pickup.longitude),
        }}
        rider={{
            latitude: location?.latitude,
            longitude: location?.longitude,
            heading: location?.heading
          }}
        />
      )}

      <RiderActionButton
      ride = {rideData}
      title = {
        rideData?.status === "START" ? "ARRIVED" : rideData?.status ==="ARRIVED" ? "COMPLETED" : "SUCCESS"
      }
      onPress={async () =>{
        if(rideData?.status === "START"){
          setOtpModalVisible(true);
          return;
        }
        const isSuccess = await updateRideStatus(rideData?._id, "COMPLETED", 'rider');
        if(isSuccess){
          Alert.alert("Congratulation! you rock 🎉");
          resetAndNavigate("/rider/home");
        }else{
          Alert.alert("There was an error")
        }
      }}
      color="#228B22"
      />
      {isOtpModalVisible && (
        <OptInputModal
        visiable={isOtpModalVisible}
        onClose={() => setOtpModalVisible(false)}
        title="Enter OTP Below"
        onConfirm={async (otp) =>{
          if(otp === rideData?.otp){
            const isSuccess = await updateRideStatus(
              rideData?._id,
              "ARRIVED", 'rider'
            );
            if(isSuccess){
              setOtpModalVisible(false);
            }else{
              Alert.alert("Technical Error")
            }
          }else{
            Alert.alert("Wrong OTP")
          }
        }}
        />
      )}
    </View>
  )
}

export default LiveRide;
