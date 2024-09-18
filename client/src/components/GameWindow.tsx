import { ReactElement, useCallback, useSyncExternalStore } from 'react';
import { gameScript } from '../game_logic/gameScript';
import { Box, Button } from '@mui/material';
import { renderingEngine } from '../game_logic/rendering/renderingEngine';
import { InventoryDisplay } from './InventoryDisplay';
import { PlayerMiner } from '../game_logic/rendering/actors/characters/PlayerMiner';
import { ADD_ITEM_EVENT } from '../globals/customEvents';

export const GameWindow = (props: { children: ReactElement }) => {
  const handleStartClick = useCallback(() => {
    gameScript.init();
    renderingEngine.startGame();
  }, []);

  const subscribe = useCallback((callback: () => void) => {
    window.addEventListener(ADD_ITEM_EVENT, callback);
    return () => {
      window.removeEventListener(ADD_ITEM_EVENT, callback);
    }
  }, [])

  const inventory = useSyncExternalStore(subscribe, useCallback(() => PlayerMiner.inventory.snapshot, []));

  return (
    <Box>
      <Box sx={{ marginBottom: '15px', marginTop: '15px' }}>
        <Button onClick={handleStartClick} variant='contained' sx={{}}>Go Mining</Button>
        <InventoryDisplay inventory={inventory} />
      </Box>
      {props.children}
    </Box>
  );
}