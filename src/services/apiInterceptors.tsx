import axios from "axios";
import { BASE_URL } from "./config";
import { logout } from "./authService";

import { useUserStore } from "./userStore";
import { useRiderStore } from "./riderStore";

export const refreshAccessToken = async () => {
    try {
        console.log("refreshAccessToken called");
        
        const { refresh_token, setAuth } = useRiderStore.getState();

        const response = await axios.post(`${BASE_URL}/auth/refresh-token`, {
            refresh_token: refresh_token,
        });

        const newAccessToken = response.data.access_token;
        const newRefreshToken = response.data.refresh_token;

        setAuth(newAccessToken, newRefreshToken);

        return newAccessToken;
    } catch (error) {
        console.error('refreshAccessToken : Error refreshing token:', error);
        logout();
    }
};

export const appAxio = axios.create({
    baseURL: BASE_URL,
});

appAxio.interceptors.request.use(async (config) => {
    let access_token = "";
    const isRider = config.headers?.role === 'rider';
    console.log("apiInterceptors :: request : role - " + config.headers?.role)
    console.log("apiInterceptors :: request : isRider - " + isRider);
    
    access_token = isRider ? useRiderStore.getState().access_token as string
                           : useUserStore.getState().access_token as string;
    
    if (access_token) {
        config.headers.Authorization = `Bearer ${access_token}`;
    }
    return config;
});

appAxio.interceptors.response.use(
    response => response, 
    async error => {
        if (error.response && error.response.status === 401) {
            try {
                console.log("apiInterceptors :: response : role " + error.config?.headers?.role)
                const newAccessToken = await refreshAccessToken();
                if (newAccessToken) {
                    error.config.headers.Authorization = `Bearer ${newAccessToken}`;
                    return axios(error.config);
                }
            } catch (error) {
                console.error('response : Error refreshing token:', error);
            }
    }
    return Promise.reject(error);
});