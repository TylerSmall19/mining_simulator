import { useCallback, useSyncExternalStore } from "react";
import { PlayerMiner } from "../../game_logic/rendering/actors/characters/PlayerMiner";
import { ADD_ITEM_EVENT } from "../customEvents";

export const usePlayerMinerInventory = () => {
  const subscribe = useCallback((callback: () => void) => {
    window.addEventListener(ADD_ITEM_EVENT, callback);
    return () => {
      window.removeEventListener(ADD_ITEM_EVENT, callback);
    }
  }, [])

  const minerItems = useSyncExternalStore(subscribe, useCallback(() => PlayerMiner.inventory.snapshot, []));
  return minerItems;
}