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
  accessToken: string | null;
  refreshToken: string | null;
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
      accessToken: null,
      refreshToken: null,

      setUser: (user) => set({ user }),
      setLocation: (location) => set({ location }),
      setOutOfRange: (outOfRange) => set({ outOfRange }),

      setAuth: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),

      clearUserData: () =>
        set({
          user: null,
          location: null,
          outOfRange: false,
          accessToken: null,
          refreshToken: null,
        }),
    }),
    {
      name: 'user-store',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);