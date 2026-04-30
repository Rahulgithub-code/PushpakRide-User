import { router } from "expo-router";
import { appAxio } from "./apiInterceptors";
import { Alert } from "react-native";
import { resetAndNavigate } from "@/utils/Helpers";

interface coords {
    address: string,
    latitude: number,
    longitude: number
}

export const createRide = async (payload: {
    vehicle: "bike" | "auto" | "cabEconamy" | "cabPremium";
    pickup: coords;
    drop: coords;
}, role: string) => {
    try {
        const res = await appAxio.post(`/ride/create`, payload, {headers:{role : role}});
        router?.navigate({
            pathname: "/customer/liveride",
            params: {
                id: res?.data?.ride?._id
            }
        });
    } catch (error) {
        Alert.alert("Oh! Dang there was an error");
        console.log("Error createRide", error || "Error createRide");
    }
}

export const getMyRides = async (isCustomer: boolean = true, role: string) =>{
    try {
        const res = await appAxio.get('/ride/rides',{headers:{role : role}});
        const filterRides = res.data.rides?.filter(
            (ride: any) => ride?.status != "COMPLETED"
        );
         
        if(filterRides?.length > 0){
            router?.navigate({
                pathname: isCustomer ? "/customer/liveride" : "/rider/liveride",
                params: {
                    id: filterRides![0]?._id
                }
            })

        }
    } catch (error) {
        Alert.alert("Oh! Dang there was an error");
        console.log("Error getMyRides", error || "Error getMyRides");
    }
}

export const acceptRideOffer = async (rideId: any, role: string) => {
    try {
        console.log("rideService : acceptRideOffer called");
        console.log("rideService :: acceptRideOffer : role - " + role);
        console.log("rideService :: acceptRideOffer : rideId - " + rideId);
        
        const res = await appAxio.patch(`/ride/accept/${rideId}`, {headers:{role : role}});
        console.log("rideService : res - " + JSON.stringify(res.data))
        resetAndNavigate({
            pathname: "/rider/liveride",
            params: {id: rideId}
        })
    } catch (error) {
        Alert.alert("Oh! Dang there was an error");
        console.log("Error acceptRideOffer", error || "Error acceptRideOffer");
    }
}

export const updateRideStatus = async (rideId: String, status: string, role: string) =>{
    try {
        const res = await appAxio.patch(`/ride/update/${rideId}`, {status}, {headers:{role : role}});
        return true;
    } catch (error) {
        Alert.alert("Oh! Dang there was an error");
        console.log("Error updateRideStatus", error || "Error updateRideStatus");
        return false;
    }
}