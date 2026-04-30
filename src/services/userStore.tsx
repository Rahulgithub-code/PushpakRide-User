import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from './storage';

type CustomLocation = {
  latitude: number;
  longitude: number;
  address: string;
} | null;

export interface UserStoreProps {
  user: any;
  location: CustomLocation;
  outOfRange: boolean;
  access_token: string | null;
  refresh_token: string | null;
  setUser: (user: any) => void;
  setLocation: (location: CustomLocation) => void;
  setOutOfRange: (data: boolean) => void;
  setAuth: (access: string, refresh: string) => void;
  clearUserData: () => void;
}

export const useUserStore = create<UserStoreProps>()(
  persist(
    (set) => ({
      user: null,
      location: null,
      outOfRange: false,
      access_token: null,
      refresh_token: null,

      setUser: (user) => set({ user }),
      setLocation: (location) => set({ location }),
      setOutOfRange: (outOfRange) => set({ outOfRange }),

      setAuth: (access_token, refresh_token) =>
        set({ access_token, refresh_token }),

      clearUserData: () =>
        set({
          user: null,
          location: null,
          outOfRange: false,
          access_token: null,
          refresh_token: null,
        }),
    }),
    {
      name: 'user-store',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);