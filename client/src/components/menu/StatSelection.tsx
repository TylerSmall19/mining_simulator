import React, { useState } from 'react';
import { Box, Button, Typography, Grid2, Tooltip } from '@mui/material';
import { CharacterStatsShape } from '../../types/CharacterStatsShape';
import { UIElement, UIWrapper } from '../positioning/UIWrapper';

// Configurable variables for max points, initial stats, etc.
const config: {
  initialStats: CharacterStatsShape,
  maxPoints: number,
  step: number,
  buttonColor: string
} = {
  initialStats: {
    baseMiningAmount: 100,
    miningSpeed: 100,
    agility: 100
  },
  maxPoints: 30,
  step: 10,
  buttonColor: '#1976d2',
};

type StatSelectionProps = {
  onConfirmation: (statValues: CharacterStatsShape) => void
}

const CharacterStats = (props: StatSelectionProps) => {
  const [statValues, setStatValues] = useState<CharacterStatsShape>({
    miningSpeed: config.initialStats.miningSpeed,
    agility: config.initialStats.agility,
    baseMiningAmount: config.initialStats.baseMiningAmount,
  });

  const [remainingPoints, setRemainingPoints] = useState(config.maxPoints);

  const handleStatChange = (statKey: keyof typeof statValues, delta: number) => {
    // If no more points to assign and user is trying to add
    if (delta > 0 && remainingPoints === 0) return;

    const newStatValue = statValues[statKey] + delta;

    if (newStatValue >= 0) {
      setStatValues((prevStats) => ({
        ...prevStats,
        [statKey]: newStatValue,
      }));
      setRemainingPoints((prevPoints) => prevPoints - delta);
    }
  };

  return (
    // <UIWrapper>
      <UIElement left={0} bottom={20} canInteract>
        <Box
          sx={{
            padding: '20px',
            borderTop: '2px solid black',
            // borderRadius: '8px',
            color: 'white',
            fontWeight: '550'
          }}
          component='div'
        >
          <Typography variant="h6" sx={{ marginBottom: '10px' }}>
            Character Stats (Remaining Points: {remainingPoints})
          </Typography>

          <Grid2 container spacing={2}>
            {/* Strength Stat */}
            <Grid2 size={{ xs:6 }}>
              <Tooltip title='A higher number means more ore per cycle'>
                <Typography variant="body1">Base Mining Amount</Typography>
              </Tooltip>
            </Grid2>
            <Grid2 size={{ xs:3 }}>
              <Typography variant="body1">{statValues.baseMiningAmount}</Typography>
            </Grid2>
            <Grid2 size={{ xs:3 }}>
              <Button
                variant="contained"
                color="primary"
                disabled={remainingPoints <= 0}
                onClick={() => handleStatChange('baseMiningAmount', config.step)}
              >
                +
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleStatChange('baseMiningAmount', -config.step)}
                sx={{ marginLeft: '5px' }}
              >
                -
              </Button>
            </Grid2>

            {/* Agility Stat */}
            <Grid2 size={{ xs:6 }}>
              <Tooltip title='A higher number means faster character running'>
                <Typography variant="body1">Agility</Typography>
              </Tooltip>
            </Grid2>
            <Grid2 size={{ xs:3 }}>
              <Typography variant="body1">{statValues.agility}</Typography>
            </Grid2>
            <Grid2 size={{ xs:3 }}>
              <Button
                variant="contained"
                color="primary"
                disabled={remainingPoints <= 0}
                onClick={() => handleStatChange('agility', config.step)}
              >
                +
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleStatChange('agility', -config.step)}
                sx={{ marginLeft: '5px' }}
              >
                -
              </Button>
            </Grid2>

            {/* Intelligence Stat */}
            <Grid2 size={{ xs:6 }}>
              <Tooltip title='A higher number means faster mining'>
                <Typography variant="body1">Mining Speed</Typography>
              </Tooltip>
            </Grid2>
            <Grid2 size={{ xs:3 }}>
              <Typography variant="body1">{statValues.miningSpeed}</Typography>
            </Grid2>
            <Grid2 size={{ xs:3 }}>
              <Button
                variant="contained"
                color="primary"
                disabled={remainingPoints <= 0}
                onClick={() => handleStatChange('miningSpeed', config.step)}
              >
                +
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleStatChange('miningSpeed', -config.step)}
                sx={{ marginLeft: '5px' }}
              >
                -
              </Button>
            </Grid2>
          </Grid2>

          {/* Button to finalize selection */}
          {/* <UIElement canInteract> */}
            <Tooltip title={remainingPoints > 0 ? 'Use your remaining points to complete creation!' : ''}>
              <Box sx={{ marginTop: '20px', textAlign: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => props.onConfirmation(statValues)}
                  disabled={remainingPoints > 0}
                >
                  Finalize Selection
                </Button>
                </Box>
            </Tooltip>
          {/* </UIElement> */}
        </Box>
      </UIElement>
    // </UIWrapper>
  );
};

export { CharacterStats };