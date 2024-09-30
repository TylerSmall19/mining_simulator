import { useCallback, useSyncExternalStore } from "react";
import { SET_ACTIVE_PLAYER_EVENT } from "../customEvents";
import { gameScript } from "../../game_logic";

export const usePlayerMinerInventory = () => {
  const subscribe = useCallback((callback: () => void) => {
    window.addEventListener(SET_ACTIVE_PLAYER_EVENT, callback);
    return () => {
      window.removeEventListener(SET_ACTIVE_PLAYER_EVENT, callback);
    }
  }, []);

  const activePlayer = useSyncExternalStore(subscribe, useCallback(() => gameScript.getGameEngine(), []));
  return activePlayer;
}