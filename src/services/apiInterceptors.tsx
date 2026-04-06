import axios from "axios";
import { BASE_URL } from "./config";
import { logout } from "./authService";

import { useUserStore } from "./userStore";

export const refreshAccessToken = async () => {
    try {
        const { refreshToken, setAuth } = useUserStore.getState();

        const response = await axios.post(`${BASE_URL}/auth/refresh-token`, {
            refresh_token: refreshToken,
        });

        const newAccessToken = response.data.access_token;
        const newRefreshToken = response.data.refresh_token;

        setAuth(newAccessToken, newRefreshToken);

        return newAccessToken;
    } catch (error) {
        console.error('Error refreshing token:', error);

        logout();
    }
};

export const appAxio = axios.create({
    baseURL: BASE_URL,
});

appAxio.interceptors.request.use(async (config) => {
    const { accessToken } = useUserStore.getState();

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});

appAxio.interceptors.response.use(
    response => response, 
    async error => {
        if (error.response && error.response.status === 401) {
            try {
                const newAccessToken = await refreshAccessToken();
                if (newAccessToken) {
                    error.config.header.Authorization = `Bearer ${newAccessToken}`;
                    return axios(error.config);
                }
            } catch (error) {
                console.error('Error refreshing token:', error);
            }
    }
    return Promise.reject(error);
});