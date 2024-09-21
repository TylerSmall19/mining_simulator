import { ReactElement, useCallback } from 'react';
import { gameScript } from '../game_logic/gameScript';
import { Box, Button } from '@mui/material';
import { renderingEngine } from '../game_logic/rendering/renderingEngine';
import { InventoryDisplay } from './InventoryDisplay';
import { PlayerMiner } from '../game_logic/rendering/actors/characters/PlayerMinerChar';
import { usePlayerMinerInventory } from '../globals/hooks/useAddItemSubscription';

export const GameWindow = (props: { children: ReactElement }) => {
  const handleStartClick = useCallback(() => {
    gameScript.init();
    renderingEngine.startGame();
  }, []);

  const inventory = usePlayerMinerInventory();

  return (
    <Box>
      <Box sx={{ marginBottom: '15px', marginTop: '15px' }}>
        <Button onClick={handleStartClick} variant='contained' sx={{}}>Go Mining</Button>
        <InventoryDisplay inventory={inventory} itemCount={PlayerMiner.inventory.itemCount} />
      </Box>
      {props.children}
    </Box>
  );
}