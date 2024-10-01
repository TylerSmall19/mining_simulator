import { useCallback, useMemo, useSyncExternalStore } from 'react';
import { SET_ACTIVE_PLAYER_EVENT } from '../customEvents';
import { gameScript } from '../../game_logic';

export const useActivePlayerSubscription = () => {
  const subscribe = useCallback((callback: () => void) => {
    window.addEventListener(SET_ACTIVE_PLAYER_EVENT, callback);
    return () => {
      window.removeEventListener(SET_ACTIVE_PLAYER_EVENT, callback);
    }
  }, []);
  const engine = gameScript.getGameEngine();
  const getSnapshot = () => engine.activePlayer;
  const activePlayer = useSyncExternalStore(subscribe, getSnapshot );
  return activePlayer;
}