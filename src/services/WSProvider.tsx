import React, { createContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { zustandStorage } from "./storage";
import { SOCKET_URL } from "./config";
import { refreshAccessToken } from "./apiInterceptors";

const ACCESS_TOKEN_KEY = "access_token"; // ✅ keep consistent

interface WSService {
    emit: (event: string, data: any) => void;
    on: (event: string, callback: (data: any) => void) => void;
    off: (event: string, callback: (data: any) => void) => void;
    removeListeners: (event: string) => void;
    updateAccessToken: () => Promise<void>;
    disconnect: () => void;
    isConnected: () => boolean;
}

const WSContext = createContext<WSService | undefined>(undefined);

export const WSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socketAccessToken, setSocketAccessToken] = useState<string | null>(null);
    const socket = useRef<Socket | null>(null);

    // 🔹 Load token on mount (ASYNC FIXED)
    useEffect(() => {
        const loadToken = async () => {
            try {
                const token = await zustandStorage.getItem(ACCESS_TOKEN_KEY);
                if (token) {
                    console.log("🔑 Token loaded");
                    setSocketAccessToken(token);
                } else {
                    console.log("❌ No token found");
                }
            } catch (err) {
                console.log("❌ Error loading token:", err);
            }
        };

        loadToken();
    }, []);

    // 🔹 Initialize socket when token changes
    useEffect(() => {
        if (!socketAccessToken) {
            console.log("❌ No token, skipping socket init");
            return;
        }

        console.log("🚀 Initializing socket...");
        console.log("🌐 URL:", SOCKET_URL);

        // cleanup old socket
        if (socket.current) {
            socket.current.removeAllListeners();
            socket.current.disconnect();
        }

        // create new socket
        socket.current = io(SOCKET_URL, {
            withCredentials: true,
            auth: {
                token: socketAccessToken,
            },
        });

        socket.current.connect();

        // ✅ connected
        socket.current.on("connect", () => {
            console.log("✅ Socket connected:", socket.current?.id);
        });

        // ❌ disconnected
        socket.current.on("disconnect", (reason) => {
            console.log("❌ Socket disconnected:", reason);
        });

        // 🚨 errors (auth, network, etc.)
        socket.current.on("connect_error", async (err) => {
            console.log("🚨 Socket error:", err.message);
            console.log("FULL ERROR:", err);

            // 🔥 handle auth error
            if (err.message?.toLowerCase().includes("auth")) {
                console.log("🔄 Refreshing token...");

                try {
                    await refreshAccessToken();

                    const newToken = await zustandStorage.getItem(ACCESS_TOKEN_KEY);
                    if (newToken) {
                        console.log("✅ Token refreshed");
                        setSocketAccessToken(newToken); // 🔥 triggers reconnect
                    } else {
                        console.log("❌ No new token after refresh");
                    }
                } catch (e) {
                    console.log("❌ Token refresh failed:", e);
                }
            }
        });

        return () => {
            socket.current?.removeAllListeners();
            socket.current?.disconnect();
        };
    }, [socketAccessToken]);

    // 🔹 Emit event safely
    const emit = (event: string, data: any) => {
        if (socket.current?.connected) {
            socket.current.emit(event, data);
        } else {
            console.warn("⚠️ Cannot emit, socket not connected");
        }
    };

    // 🔹 Listen
    const on = (event: string, callback: (data: any) => void) => {
        socket.current?.on(event, callback);
    };

    // 🔹 Remove specific listener
    const off = (event: string, callback: (data: any) => void) => {
        socket.current?.off(event, callback);
    };

    // 🔹 Remove all listeners
    const removeListeners = (event: string) => {
        socket.current?.removeAllListeners(event);
    };

    // 🔹 Manually update token
    const updateAccessToken = async () => {
        const token = await zustandStorage.getItem(ACCESS_TOKEN_KEY);
        if (token) {
            setSocketAccessToken(token);
        }
    };

    // 🔹 Disconnect
    const disconnect = () => {
        socket.current?.disconnect();
    };

    // 🔹 Check connection
    const isConnected = () => {
        return socket.current?.connected ?? false;
    };

    const socketService: WSService = {
        emit,
        on,
        off,
        removeListeners,
        updateAccessToken,
        disconnect,
        isConnected,
    };

    return (
        <WSContext.Provider value={socketService}>
            {children}
        </WSContext.Provider>
    );
};

export const useWS = (): WSService => {
    const context = React.useContext(WSContext);
    if (!context) {
        throw new Error("useWS must be used within a WSProvider");
    }
    return context;
};