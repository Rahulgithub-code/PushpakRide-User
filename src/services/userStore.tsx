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
  setUser: (user: any) => void;
  setLocation: (location: CustomLocation) => void;
  setOutOfRange: (data: boolean) => void;
  clearUserData: () => void;
}

export const useUserStore = create<UserStoreProps>()(
  persist(
    (set) => ({
      user: null,
      location: null,
      outOfRange: false,
      setUser: (user: any) => set({ user }),
      setLocation: (location: CustomLocation) => set({ location }),
      setOutOfRange: (outOfRange: boolean) => set({ outOfRange }),

      clearUserData: () =>
        set({ user: null, location: null, outOfRange: false }),
    }),
    {
      name: 'user-store',

      partialize: (state) => ({
        user: state.user,
      }),

      storage: createJSONStorage(() => zustandStorage)
    }
  )
);