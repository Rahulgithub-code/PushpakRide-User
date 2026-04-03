import { resetAndNavigate } from "@/utils/Helpers";
import { useRiderStore } from "./riderStore";
import { zustandStorage } from "./storage";
import { useUserStore } from "./userStore"


export const logout = () => async (disconnect?: () => void) => {
    if (disconnect) {
        disconnect();
    }
    const {clearUserData} = useUserStore.getState();
    const {clearRiderData} = useRiderStore.getState();

    zustandStorage.clearAll();
    clearUserData();
    clearRiderData();
    resetAndNavigate('/role');

}