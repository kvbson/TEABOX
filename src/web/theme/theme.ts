// src/web/theme/theme.ts
import { createTheme, ThemeOptions } from '@mui/material/styles';

function getCssVar(name: string, fallback: string) {
  if (typeof window === 'undefined') return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

/**
 * Map CSS variables into MUI theme.
 * Use mode param if you want to tweak mapping for light/dark later.
 */
export const buildTheme = (mode: 'light' | 'dark' = 'dark') => {
  // read variables (with fallbacks)
  const primary = getCssVar('--color-primary', '#d83557');
  const secondary = getCssVar('--color-secondary', '#301f24');
  const textPrimary = getCssVar('--color-text', '#e3d1aa');
  const bg = getCssVar('--color-bg', '#301f24');
  const surface = getCssVar('--color-surface', bg); // optional var
  const radius = getCssVar('--radius', '8px');
  const shadow = getCssVar('--shadow', '0 2px 25px rgba(0,0,0,0.7)');

  const fontInter = getCssVar('--font-inter', `"Inter", sans-serif`);
  const fontArchivo = getCssVar('--font-archivo', `"Archivo", sans-serif`);

  // font sizes
  const fSmall = getCssVar('--f-small', '15px');
  const fMedium = getCssVar('--f-medium', '17px');
  const fLarge = getCssVar('--f-large', '20px');
  const fXLarge = getCssVar('--f-xlarge', '30px');
  const fXXLarge = getCssVar('--f-xxlarge', '42px');

  const palette: ThemeOptions['palette'] = {
    mode: mode === 'light' ? 'light' : 'dark',
    primary: { main: primary },
    secondary: { main: secondary },
    text: { primary: textPrimary },
    background: { default: bg, paper: surface },
  };

  const theme = createTheme({
    palette,
    typography: {
      fontFamily: fontInter,
      h1: { fontFamily: fontArchivo, fontSize: fXXLarge, fontWeight: 700 },
      h2: { fontFamily: fontArchivo, fontSize: fXLarge, fontWeight: 700 },
      body1: { fontSize: fMedium },
      body2: { fontSize: fSmall },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: { borderRadius: Number(radius.replace('px', '')) || 8 },
    components: {
      MuiPaper: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            backgroundColor: surface,
            color: textPrimary,
            boxShadow: shadow,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: radius,
            textTransform: 'none',
          },
          containedPrimary: {
            backgroundColor: primary,
            color: textPrimary,
            '&:hover': {
              filter: 'brightness(0.95)',
            },
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            color: textPrimary,
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: bg,
            color: textPrimary,
            fontFamily: fontInter,
          },
        },
      },
    },
  });

  // Optionally tweak theme.shadows[1] etc. to include your custom shadow string
  // createTheme expects an array of shadows — override a few entries:
  const shadowArray = [...theme.shadows];
  shadowArray[1] = shadow;
  shadowArray[2] = shadow;
  return { ...theme, shadows: shadowArray };
};
