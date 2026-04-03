import * as SecureStore from 'expo-secure-store';

const KEYS = ['rider-store', 'user-store', 'auth_token'];

export const zustandStorage = {
  getItem: async (name: string) => {
    const value = await SecureStore.getItemAsync(name);
    return value ?? null;
  },

  setItem: async (name: string, value: string) => {
    await SecureStore.setItemAsync(name, value);
  },

  removeItem: async (name: string) => {
    await SecureStore.deleteItemAsync(name);
  },
  
  clearAll: async () => {
    await Promise.all(KEYS.map((key) => SecureStore.deleteItemAsync(key)));
  },
};