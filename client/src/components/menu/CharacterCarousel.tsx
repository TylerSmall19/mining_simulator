import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { styled } from '@mui/material/styles';
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Configurable colors and constants
const config = {
  buttonColor: '#1976d2',
  activeImageBorderColor: '#ff9800',
  activeImageShadowColor: 'rgba(0, 0, 0, 0.6)',
  inactiveImageOpacity: 0.7,
  transitionDuration: 750, // in ms
};

// Sample array of image paths (replace with API call)
const imageArray = [
  "https://localhost:3001/assets/characters/miners/female_miner.png",
  "https://localhost:3001/assets/characters/miners/male_miner_alt.png",
];

// Define the custom prop types for the Image component
interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  isActive: boolean;
}

// Custom styles for the active image with border and shadow
const Image = styled('img')<ImageProps>(({ isActive }) => ({
  width: '200px',
  height: '200px',
  objectFit: 'cover',
  margin: '0 10px',
  borderRadius: '8px',
  border: isActive ? `4px solid ${config.activeImageBorderColor}` : 'none',
  boxShadow: isActive ? `0 4px 8px ${config.activeImageShadowColor}` : 'none',
  opacity: isActive ? 1 : config.inactiveImageOpacity,
  transition: `transform ${config.transitionDuration}ms ease, opacity ${config.transitionDuration}ms ease`,
}));

// Main component
const CharacterCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Handlers for navigation
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % imageArray.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? imageArray.length - 1 : prevIndex - 1
    );
  };

  // Get the currently visible images (3 at a time)
  const getVisibleImages = () => {
    const images = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % imageArray.length;
      images.push({
        src: imageArray[index],
        isActive: i === 1, // Highlight the middle image as active
      });
    }
    return images;
  };

  const visibleImages = getVisibleImages();

  // Theme customization for button colors
  const theme = createTheme({
    palette: {
      primary: {
        main: config.buttonColor,
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          width: '800px',
          height: '600px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: '#f0f0f0',
          // background: 'none!important',
          position: 'relative',
        }}
      >
        {/* Image Container */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            overflow: 'hidden',
          }}
        >
          {/* Previous Button */}
          <Button
            onClick={handlePrevious}
            variant="contained"
            color="primary"
            sx={{ position: 'absolute', left: '10px', zIndex: 2 }}
          >
            Prev
          </Button>

          {/* Image Slider */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '600px', // Fit 3 images (200px each with some margin)
              transition: `transform ${config.transitionDuration}ms ease`,
            }}
          >
            {visibleImages.map((img, index) => (
              <Image key={index} src={img.src} isActive={img.isActive} />
            ))}
          </Box>

          {/* Next Button */}
          <Button
            onClick={handleNext}
            variant="contained"
            color="primary"
            sx={{ position: 'absolute', right: '10px', zIndex: 2 }}
          >
            Next
          </Button>
        </Box>

        {/* Character Info */}
        <Box sx={{ marginTop: '20px', textAlign: 'center', color: 'black' }}>
          <Typography variant="h5" fontWeight='bold'>Character Stats</Typography>
          <Typography variant="body1">Strength: 80</Typography>
          <Typography variant="body1">Agility: 65</Typography>
          <Typography variant="body1">Intelligence: 70</Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export { CharacterCarousel };