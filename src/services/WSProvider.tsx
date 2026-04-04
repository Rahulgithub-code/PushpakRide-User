import React, { createContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { zustandStorage } from "./storage";
import { SOCKET_URL } from "./config";
import { refreshAccessToken } from "./apiInterceptors";

interface WSService {
    initializeSocket: () => void;
    emit: (event: string, data: any) => void;
    on: (event: string, callback: (data: any) => void) => void;
    off: (event: string, callback: (data: any) => void) => void;
    removeListeners: (event: string) => void;
    updateAccessToken: () => void;
    disconnect: () => void;
}

const WSContext = createContext<WSService | undefined>(undefined);

export const WSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socketAccessToken, setSocketAccessToken] = useState<string | null>(
        null
    );
    const socket = useRef<Socket | null>(null);
    useEffect( () => {
        const loadToken = async () => {
            const token =  await zustandStorage.getItem("access-token");
        if (token) {
            setSocketAccessToken(token);
        }
        }
        loadToken();
    }, []);

    useEffect(() => {
        if (socketAccessToken) {
            if (socket.current) {
                socket.current.disconnect();
            }

            socket.current = io(SOCKET_URL, {
                transports: ["websocket"],
                withCredentials: true,
                extraHeaders: {
                    access_token: socketAccessToken || "",
                }
            });
            socket.current?.on("connect_error", (err) => {
                if (err.message === "Authentication error") {
                    console.error("Socket authentication failed. Please check your access token.", err.message);
                    refreshAccessToken();
                }
            });
        }
        return () => {
            socket.current?.disconnect();
        }
    }, [socketAccessToken]);

    const emit = (event: string, data: any) => {
        socket.current?.emit(event, data);
    };
    
    const on = (event: string, callback: (data: any) => void) => {
        socket.current?.on(event, callback);
    };
    const off = (event: string, callback: (data: any) => void) => {
        socket.current?.off(event, callback);
    };
    const removeListeners = (event: string) => {
        socket.current?.removeAllListeners(event);
    };
    const updateAccessToken = async () => {
        const token = await zustandStorage.getItem("access-token");
        if (token) {
            setSocketAccessToken(token);
        }
    };
    const disconnect = () => {
        if (socket.current) {
            socket.current.disconnect();
        }
    };

    const socketService: WSService = {
        initializeSocket: () => {},
        emit,
        on,
        off,
        removeListeners,
        updateAccessToken,
        disconnect
    };

    return (
        <WSContext.Provider value={socketService}>
            {children}
        </WSContext.Provider>
    );
};

export const useWS = (): WSService => {
    const socketContext = React.useContext(WSContext);
    if (!socketContext) {
        throw new Error("useWS must be used within a WSProvider");
    }
    return socketContext;
};