import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from './storage';

type CustomLocation = {
  latitude: number;
  longitude: number;
  address: string;
  heading: number;
} | null;

export interface RiderStoreProps {
  user: any;
  location: CustomLocation;
  onDuty: boolean;
  setUser: (user: any) => void;
  setLocation: (location: CustomLocation) => void;
  setOnDuty: (onDuty: boolean) => void;
  clearRiderData: () => void;
}

export const useRiderStore = create<RiderStoreProps>()(
  persist(
    (set) => ({
      user: null,
      location: null,
      onDuty: false,

      setUser: (user: any) => set({ user }),
      setLocation: (location: CustomLocation) => set({ location }),
      setOnDuty: (onDuty: boolean) => set({ onDuty }),

      clearRiderData: () =>
        set({ user: null, location: null, onDuty: false }),
    }),
    {
      name: 'rider-store',

      partialize: (state) => ({
        user: state.user,
      }),

      storage: createJSONStorage(() => zustandStorage),
    }
  )
);