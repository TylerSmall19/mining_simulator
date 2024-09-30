import { createTheme } from "@mui/material";
// import { createStyled } from '@mui/system'

const palette = {
  primary: {
    main: '#1976d2',
    contrastText: 'white',
  },
  secondary: {
    main: '#1976d2',
    light: 'cyan',
    dark: 'chocolate'
  },
  info: {
    main: '#ccc',
    light: '#e6e6e6',
    dark: '#b3b3b3'
  }
}

export const AppTheme = createTheme({
  palette,
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          // Outlined
          "& .MuiFormHelperText-root": {
            color: palette.primary.main,
            marginBottom: '15px'
          },
          "& .MuiOutlinedInput-root": {
            color: palette.primary.main,
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: palette.primary.main,
            },
            "&.Mui-focused": {
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: palette.secondary.main,
              },
            },
            "&:hover:not(.Mui-focused)": {
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: palette.primary.contrastText,
              },
            },
          },
          "& .MuiInputLabel-outlined": {
            color: palette.primary.contrastText,
            "&.Mui-focused": {
              color: palette.primary.contrastText,
            },
          },
        },
      },
    },
  },
});

// Interesting bit to learn: https://mui.com/system/styled/#how-to-use-components-selector-api

// override the default theme
// createStyled({ defaultTheme: AppTheme });