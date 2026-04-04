import axios from "axios";
import { BASE_URL } from "./config";
import { zustandStorage } from "./storage";
import { logout } from "./authService";

export const refreshAccessToken = async () =>{
    try {
        const refreshToken = zustandStorage.getItem('refresh_token');
        const response = await axios.post(`${BASE_URL}/auth/refresh-token`, {
            refresh_token: refreshToken,
        });
        const new_access_token = response.data.access_token;
        const new_refresh_token = response.data.refresh_token;
        zustandStorage.setItem('refresh_token', new_refresh_token); 
        zustandStorage.setItem('access_token', response.data.access_token);
        return new_access_token;
    } catch (error) {
        console.error('Error refreshing access token:', error);
        zustandStorage.clearAll();
        logout();
    }
}

export const appAxio = axios.create({
    baseURL: BASE_URL,
});

appAxio.interceptors.request.use(async config => {
    const accessToken = zustandStorage.getItem('access-token');
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