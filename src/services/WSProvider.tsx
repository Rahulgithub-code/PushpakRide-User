import React, { createContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { zustandStorage } from "./storage";
import { SOCKET_URL } from "./config";
import { refreshAccessToken } from "./apiInterceptors";
import { useUserStore } from "./userStore";
import { useRiderStore } from "./riderStore";

const ACCESS_TOKEN_KEY = "access_token";

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

    // 🔥 QUEUE (critical fix)
    const messageQueue = useRef<{ event: string; data: any }[]>([]);
    const isRefreshing = useRef(false);

    // 🔹 Load token
    useEffect(() => {
        console.log("Load Token");
        const loadToken = async () => {
            const token = useUserStore.getState().access_token || useRiderStore.getState().access_token;
            if (token) {
                console.log("🔑 Token loaded");
                setSocketAccessToken(token);
            } else {
                console.log("❌ No token found");
            }
        };
        loadToken();
    }, []);

    // 🔹 Socket init
    useEffect(() => {
        console.log("WSProvider : Socket init");
        
        if (!socketAccessToken) {
            console.log("❌ No token, skipping socket init");
            return;
        }

        console.log("🚀 Initializing socket...");
        console.log("🌐 URL:", SOCKET_URL);

        // cleanup
        if (socket.current) {
            socket.current.removeAllListeners();
            socket.current.disconnect();
        }

        socket.current = io(SOCKET_URL, {
            withCredentials: true,
            auth: {
                token: socketAccessToken,
            },
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        socket.current.connect();

        // ✅ CONNECT
        socket.current.on("connect", () => {
            console.log("✅ Connected:", socket.current?.id);

            // 🔥 FLUSH QUEUE
            console.log("🚀 Flushing queue:", messageQueue.current.length);

            while (messageQueue.current.length > 0) {
                const msg = messageQueue.current.shift();
                if (msg) {
                    console.log("📤 Flushed:", msg.event);
                    socket.current?.emit(msg.event, msg.data);
                }
            }
        });

        // ❌ DISCONNECT
        socket.current.on("disconnect", (reason) => {
            console.log("❌ Disconnected:", reason);
        });

        // 🚨 ERROR
        socket.current.on("connect_error", async (err) => {
            console.log("🚨 Socket error:", err.message);

            if (err.message.toLowerCase().includes("auth") && !isRefreshing.current) {
                isRefreshing.current = true;

                console.log("🔄 Refreshing token...");

                try {
                    await refreshAccessToken();

                    const newToken = useUserStore.getState().access_token || useRiderStore.getState().access_token;
                    if (newToken) {
                        console.log("✅ Token refreshed");
                        setSocketAccessToken(newToken);
                    }
                } catch (e) {
                    console.log("❌ Token refresh failed");
                }

                isRefreshing.current = false;
            }
        });

        return () => {
            socket.current?.removeAllListeners();
            socket.current?.disconnect();
        };

    }, [socketAccessToken]);

    // 🔥 SAFE EMIT (QUEUE BASED)
    const emit = (event: string, data: any) => {
        console.log("WSProvide: event - " + event +", data - " +JSON.stringify(data));
        if (!socket.current) return;

        if (socket.current.connected) {
            console.log("📤 Emit:", event);
            socket.current.emit(event, data);
        } else {
            console.warn("⚠️ Queuing event:", event);
            messageQueue.current.push({ event, data });
        }
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
        const token = useUserStore.getState().access_token || useRiderStore.getState().access_token;
        if (token) {
            setSocketAccessToken(token);
        }
    };

    const disconnect = () => {
        socket.current?.disconnect();
    };

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