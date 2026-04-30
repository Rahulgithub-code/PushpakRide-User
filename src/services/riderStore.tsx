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
  access_token: string | null;
  refresh_token: string | null;
  setUser: (user: any) => void;
  setLocation: (location: CustomLocation) => void;
  setOnDuty: (onDuty: boolean) => void;
  setAuth: (access: string, refresh: string) => void;
  clearRiderData: () => void;
}

export const useRiderStore = create<RiderStoreProps>()(
  persist(
    (set) => ({
      user: null,
      location: null,
      onDuty: false,
      access_token: null,
      refresh_token: null,

      setUser: (user: any) => set({ user }),
      setLocation: (location: CustomLocation) => set({ location }),
      setOnDuty: (onDuty: boolean) => set({ onDuty }),

      setAuth: (access_token, refresh_token) =>
        set({ access_token, refresh_token }),
      clearRiderData: () =>
        set({ user: null, location: null, onDuty: false, access_token: null,
          refresh_token: null}),
    }),
    {
      name: 'rider-store',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);