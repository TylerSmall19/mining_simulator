import React, { useState } from 'react';
import { Box, Button, Typography, Grid2 } from '@mui/material';

// Configurable variables for max points, initial stats, etc.
const config = {
  initialStats: {
    strength: 100,
    agility: 100,
    intelligence: 100,
  },
  maxPoints: 30,
  step: 10,
  buttonColor: '#1976d2',
};

// Sub-component for character stats using Grid2
const CharacterStats: React.FC = () => {
  const [stats, setStats] = useState({
    strength: config.initialStats.strength,
    agility: config.initialStats.agility,
    intelligence: config.initialStats.intelligence,
  });

  const [remainingPoints, setRemainingPoints] = useState(config.maxPoints);

  const handleStatChange = (statKey: keyof typeof stats, delta: number) => {
    // If no more points to assign and user is trying to add
    if (delta > 0 && remainingPoints === 0) return;

    const newStatValue = stats[statKey] + delta;

    if (newStatValue >= 0) {
      setStats((prevStats) => ({
        ...prevStats,
        [statKey]: newStatValue,
      }));
      setRemainingPoints((prevPoints) => prevPoints - delta);
    }
  };

  return (
    // <UIWrapper>
      <Box
        sx={{
          // width: '100%',
          padding: '20px',
          border: '1px solid black',
          backgroundColor: 'red',
          borderRadius: '8px',
          color: 'white',
          fontWeight: '550'
        }}
      >
        <Typography variant="h6" sx={{ marginBottom: '10px' }}>
          Character Stats (Remaining Points: {remainingPoints})
        </Typography>

        <Grid2 container spacing={2}>
          {/* Strength Stat */}
          <Grid2 size={{ xs:6 }}>
            <Typography variant="body1">Strength</Typography>
          </Grid2>
          <Grid2 size={{ xs:3 }}>
            <Typography variant="body1">{stats.strength}</Typography>
          </Grid2>
          <Grid2 size={{ xs:3 }}>
            <Button
              variant="contained"
              color="primary"
              disabled={remainingPoints <= 0}
              onClick={() => handleStatChange('strength', config.step)}
            >
              +
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleStatChange('strength', -config.step)}
              sx={{ marginLeft: '5px' }}
            >
              -
            </Button>
          </Grid2>

          {/* Agility Stat */}
          <Grid2 size={{ xs:6 }}>
            <Typography variant="body1">Agility</Typography>
          </Grid2>
          <Grid2 size={{ xs:3 }}>
            <Typography variant="body1">{stats.agility}</Typography>
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
            <Typography variant="body1">Intelligence</Typography>
          </Grid2>
          <Grid2 size={{ xs:3 }}>
            <Typography variant="body1">{stats.intelligence}</Typography>
          </Grid2>
          <Grid2 size={{ xs:3 }}>
            <Button
              variant="contained"
              color="primary"
              disabled={remainingPoints <= 0}
              onClick={() => handleStatChange('intelligence', config.step)}
            >
              +
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleStatChange('intelligence', -config.step)}
              sx={{ marginLeft: '5px' }}
            >
              -
            </Button>
          </Grid2>
        </Grid2>

        {/* Button to finalize selection */}
        <Box sx={{ marginTop: '20px', textAlign: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => alert(`Selected Stats: ${JSON.stringify(stats)}`)}
          >
            Finalize Selection
          </Button>
        </Box>
      </Box>
    // </UIWrapper>
  );
};

export { CharacterStats };