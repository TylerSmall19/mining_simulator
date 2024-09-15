import React, { ReactElement, useCallback } from 'react';
import { gameScript } from '../game_logic/gameScript';
import { Box, Button } from '@mui/material';
import { renderingEngine } from '../game_logic/rendering/renderingEngine';

export const GameWindow = (props: { children: ReactElement }) => {
  const handleStartClick = useCallback(() => {
    gameScript.init();
    renderingEngine.startGame();
  }, []);

  return (<Box>
    <p>This is the app window</p>
    <Box sx={{marginBottom: '15px'}}>
      <Button onClick={handleStartClick} variant='contained' sx={{}}>Start Game</Button>
    </Box>
    {props.children}
  </Box>);
}