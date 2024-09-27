import { ChangeEventHandler, FormEventHandler, ReactElement, useCallback, useState } from 'react';
import { gameScript } from '../game_logic/gameScript';
import { Box, Button, FormControl, FormHelperText, Input, InputLabel } from '@mui/material';
import { renderingEngine } from '../game_logic/rendering/renderingEngine';
import { InventoryDisplay } from './InventoryDisplay';
import { PlayerMiner } from '../game_logic/rendering/actors/characters/PlayerMiner';
import { usePlayerMinerInventory } from '../globals/hooks/useAddItemSubscription';
import { ApiUtility } from '../utils/ApiUtility';

export const GameWindow = (props: { children: ReactElement }) => {
  const [playerFormValues, setPlayerFormValues] = useState({ playerName: '' });
  const inventory = usePlayerMinerInventory();

  const handleCreate = useCallback<FormEventHandler<HTMLFormElement>>(async (e) => {
    e.preventDefault();
    const player = await ApiUtility.createPlayer(playerFormValues)
    if (player) {
      gameScript.init();
      renderingEngine.startGame();
      if (window.localStorage)
        window.localStorage.setItem('player', JSON.stringify(player));
    }
  }, [playerFormValues]);

  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>((e) => {
    e.preventDefault();
    setPlayerFormValues({
      ...playerFormValues,
      [e.target.name]: e.target.value
    });
  }, [playerFormValues, setPlayerFormValues]);

  return (
    <Box>
      <Box sx={{ marginBottom: '15px', marginTop: '15px' }}>
        <FormControl component='form' onSubmit={handleCreate}>
          <InputLabel htmlFor='my-input'>Player Display Name</InputLabel>
          <Input
            id='playerName'
            name='playerName'
            aria-describedby='my-helper-text'
            value={playerFormValues.playerName}
            onChange={handleChange}
          />
          <FormHelperText id='my-helper-text'>Choose the display name of your Player.</FormHelperText>
          <Button type='submit' variant='contained' sx={{}}>Go Mining</Button>
        </FormControl>
        <InventoryDisplay inventory={inventory} itemCount={PlayerMiner.inventory.itemCount} />
      </Box>
      {props.children}
    </Box>
  );
}