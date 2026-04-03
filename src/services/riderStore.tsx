import {create} from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from './storage';
import { UserStoreProps } from './userStore';

type CustomLocation = {
    latitude: number;
    longitude: number;
    address: string;
    heading: number;
} | null;

export interface RiderStoreProps {
    user: any;
    location: CustomLocation;
    outOfRange: boolean;
    setUser: (user: any) => void;
    setLocation: (location: CustomLocation) => void;
    setOutOfRange: (outOfRange: boolean) => void;
    clearData: () => void;
}

export const useRiderStore = create<RiderStoreProps>()(
    persist(
        (set) => ({
            user: null,
            location: null,
            onDuty: false,
            setUser: (data: any) => set({ data }),
            setLocation: (location: CustomLocation) => set({ location }),
            setOnDuty: (data: boolean) => set({ data }),
            clearData: () => set({ user: null, location: null, onDuty: false }),
        }),
        {
            name: 'rider-store',
            partialize: (state: any) => ({ 
                user: state.user 
            }),
            storage: createJSONStorage(() => mmkvStorage),
        }
    )
);