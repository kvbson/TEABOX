// src/web/theme/ThemeProviderWrapper.tsx
import React, { createContext, useEffect, useMemo, useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { buildTheme } from './theme';

export type ThemeMode = 'light' | 'dark';

export type ThemeContextType = {
  mode: ThemeMode;
  toggleMode: () => void;
  setMode: (m: ThemeMode) => void;
};

export const ThemeModeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'teabox_theme_mode';

// Example: update a few CSS variables on theme change
function applyCssVarsForMode(mode: ThemeMode) {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
}

export const ThemeProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    const saved = typeof window !== 'undefined'
      ? (localStorage.getItem(STORAGE_KEY) as ThemeMode | null)
      : null;
    return saved ?? 'light';
  });

  // Save + update CSS variables
  useEffect(() => {
    applyCssVarsForMode(mode);
    localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  const theme = useMemo(() => buildTheme(mode), [mode]);

  const toggleMode = () => setModeState((m) => (m === 'light' ? 'dark' : 'light'));
  const setMode = (m: ThemeMode) => setModeState(m);

  return (
    <ThemeModeContext.Provider value={{ mode, toggleMode, setMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
};
