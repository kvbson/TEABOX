import { createTheme, ThemeOptions } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';

export type ThemeDef = {
  id: string;
  name: string;
  palette: {
    mode: PaletteMode;
    primary: { main: string; contrastText?: string };
    background: { default: string; paper: string };
    text?: { primary?: string; secondary?: string };
    error?: { main: string };
  };
};

export const THEMES: Record<string, ThemeDef> = {
  crimson: {
    id: 'crimson',
    name: 'Crimson',
    palette: {
      mode: 'dark',
      primary: { main: '#FE4B71', contrastText: '#fff' },
      background: { default: '#301f24', paper: '#301f24' },
      text: { primary: '#e3d1aa', secondary: '#c9b594' },
      error: { main: '#ff5a6b' },
    },
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean',
    palette: {
      mode: 'dark',
      primary: { main: '#4BBBAC', contrastText: '#041616' },
      background: { default: '#132628', paper: '#132628' },
      text: { primary: '#B5D7DE', secondary: '#9fdcd8' },
      error: { main: '#ff7b7b' },
    },
  },
  teal: {
    id: 'teal',
    name: 'Teal',
    palette: {
      mode: 'dark',
      primary: { main: '#4BA165', contrastText: '#02120f' },
      background: { default: '#13160D', paper: '#13160D' },
      text: { primary: '#D2AA5F', secondary: '#9bded0' },
      error: { main: '#ff6b6b' },
    },
  },
  fire: {
    id: 'fire',
    name: 'Fire',
    palette: {
      mode: 'dark',
      primary: { main: '#E1382D', contrastText: '#02120f' },
      background: { default: '#000C16', paper: '#000C16' },
      text: { primary: '#ACD4E7', secondary: '#9bded0' },
      error: { main: '#ff6b6b' },
    },
  },
  light: {
    id: 'light',
    name: 'Light',
    palette: {
      mode: 'light',
      primary: { main: '#CD202A', contrastText: '#fff' },
      background: { default: '#f7f8fa', paper: '#ffffff' },
      text: { primary: '#012A4A', secondary: '#4b5563' },
      error: { main: '#d32f2f' },
    },
  },
};

export function createAppThemeFromDef(def: ThemeDef) {
  const opts: ThemeOptions = {
    palette: {
      mode: def.palette.mode,
      primary: { main: def.palette.primary.main, contrastText: def.palette.primary.contrastText },
      background: { default: def.palette.background.default, paper: def.palette.background.paper },
      text: { primary: def.palette.text?.primary, secondary: def.palette.text?.secondary },
      error: def.palette.error ? { main: def.palette.error.main } : undefined,
    },
    typography: {
      fontFamily: ['Inter', 'Arial', 'system-ui', 'sans-serif'].join(','),
    },
    shape: { borderRadius: 8 },
  };

  return createTheme(opts);
}
