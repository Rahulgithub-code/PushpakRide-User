import {create} from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from './storage';

type CustomLocation = {
    latitude: number;
    longitude: number;
    address: string;
} | null;

export interface UserStoreProps {
    user: any;
    location: CustomLocation;
    outOfRange: boolean;
    setUser: (user: any) => void;
    setLocation: (location: CustomLocation) => void;
    setOutOfRange: (outOfRange: boolean) => void;
    clearData: () => void;
}

export const useUserStore = create<UserStoreProps>()(
    persist(
        (set) => ({
            user: null,
            location: null,
            outOfRange: false,
            setUser: (data: any) => set({ data }),
            setLocation: (location: CustomLocation) => set({ location }),
            setOutOfRange: (outOfRange: boolean) => set({ outOfRange }),
            clearData: () => set({ user: null, location: null, outOfRange: false }),
        }),
        {
            name: 'user-store',
            partialize: (state: any) => ({ 
                user: state.user 
            }),
            storage: createJSONStorage(() => mmkvStorage),
        }
    )
);