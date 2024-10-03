import { ChangeEventHandler, FormEventHandler, ReactElement, useCallback, useEffect, useState } from 'react';
import { gameScript } from '../game_logic';
import { Box, Button, FormControl, FormHelperText, TextField } from '@mui/material';
import { renderingEngine } from '../game_logic/rendering/renderingEngine';
import { InventoryDisplay } from './InventoryDisplay';
import { PlayerMiner } from '../game_logic/rendering/actors/characters/PlayerMiner';
import { usePlayerMinerInventory } from '../globals/hooks/useAddItemSubscription';
import { ApiUtility } from '../utils/ApiUtility';
import { useActivePlayerSubscription } from '../globals/hooks/useActivePlayerSubscription';
import { CharacterCreationComponent } from './scenes/CharacterCreationScene';

const Logout = () => {
  const handleLogout = useCallback(() => {
    gameScript.getGameEngine().activePlayer = null;
  }, []);
  return (
    <Button variant='contained' onClick={handleLogout}>
      Logout
    </Button>
  );
};

const startTheGame = () => {
  gameScript.init();
  renderingEngine.startGame();
}

const PlayerCreateForm = () => {
  const [playerFormValues, setPlayerFormValues] = useState({ playerName: '' });
  const [errors, setErrors] = useState<string[]>([]);

  const handleCreate = useCallback<FormEventHandler<HTMLFormElement>>(async (e) => {
    e.preventDefault();
    const player = await ApiUtility.createPlayer(playerFormValues)
    if (player) {
      gameScript.getGameEngine().activePlayer = player;
      startTheGame();
    } else {
      setErrors([...errors, 'Unable to create player']);
    }
  }, [playerFormValues, errors]);

  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>((e) => {
    e.preventDefault();
    setPlayerFormValues({
      ...playerFormValues,
      [e.target.name]: e.target.value
    });
    setErrors([]);
  }, [playerFormValues, setPlayerFormValues]);

  return (
    <Box sx={{ marginBottom: '15px', marginTop: '15px' }}>
      <FormControl component='form' onSubmit={handleCreate}>
      {errors.length > 0 && <FormHelperText sx={{fontSize: '.6em'}} error id='input-errors'>{errors.map((err) => <span key={err}>{err}</span>)}</FormHelperText>}
        <TextField
          sx={{ input: { color: 'whitesmoke'}}}
          id='playerName'
          name='playerName'
          aria-describedby='my-helper-text'
          value={playerFormValues.playerName}
          onChange={handleChange}
          helperText='Choose your display name'
          label='Player Name'
          variant='outlined'
          color='secondary'
          error={errors.length > 0}
          aria-errormessage='input-errors'
        />
        <Button type='submit' variant='contained'>Login</Button>
      </FormControl>
    </Box>
  )
}

export const GameWindow = (props: { children: ReactElement }) => {
  const inventory = usePlayerMinerInventory();
  const activePlayer = useActivePlayerSubscription();

  useEffect(() => {
    if (activePlayer && !gameScript.getGameEngine().isRunning())
      startTheGame();
  }, [activePlayer])

  if(!activePlayer)
    gameScript.getGameEngine().stop();

  return (
    <Box>
      {(activePlayer && <Logout />) || <PlayerCreateForm />}
      {/* @TODO: This should change to inventory.ores.itemCount so the player inventory can hold more types of items */}
      {activePlayer && <InventoryDisplay inventory={inventory} itemCount={PlayerMiner.inventory.itemCount} />}
      {activePlayer && <CharacterCreationComponent />}
      {/* this is the canvas */}
      {props.children}
    </Box>
  );
}