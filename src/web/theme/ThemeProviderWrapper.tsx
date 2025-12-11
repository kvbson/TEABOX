import React, { createContext, useEffect, useMemo, useState } from 'react';
import { ThemeProvider, CssBaseline, GlobalStyles } from '@mui/material';
import { createAppThemeFromDef, THEMES, ThemeDef } from './theme';

type ThemeCtx = {
  themeId: string;
  setThemeId: (id: string) => void;
  mode: 'light' | 'dark';
  setMode: (m: 'light' | 'dark') => void;
  toggleMode: () => void;
  currentDef: ThemeDef;
};

const STORAGE_KEY = 'teabox:themeId';
export const ThemeModeContext = createContext<ThemeCtx | null>(null);

export const ThemeProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const availableIds = Object.keys(THEMES);
  const defaultId = availableIds.includes('crimson') ? 'crimson' : availableIds[0] ?? 'light';

  const [themeId, setThemeIdState] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && THEMES[stored]) return stored;
    } catch (e) {}
    return defaultId;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, themeId);
    } catch (e) {}
  }, [themeId]);

  const currentDef = THEMES[themeId] ?? THEMES[defaultId];

  const theme = useMemo(() => createAppThemeFromDef(currentDef), [currentDef]);

  const setThemeId = (id: string) => {
    if (!THEMES[id]) {
      console.warn('Unknown theme id', id);
      return;
    }
    setThemeIdState(id);
  };

  const setMode = (m: 'light' | 'dark') => {
    // find theme with matching mode; prefer current if same mode exists
    const sameMode = Object.values(THEMES).find((t) => t.palette.mode === m);
    if (sameMode) setThemeIdState(sameMode.id);
  };

  const toggleMode = () => {
    setThemeIdState((prev) => {
      const current = THEMES[prev] ?? THEMES[defaultId];
      const targetMode = current.palette.mode === 'dark' ? 'light' : 'dark';
      const candidate = Object.values(THEMES).find((t) => t.palette.mode === targetMode);
      return candidate ? candidate.id : prev;
    });
  };

  const cssVars = {
    '--bg': currentDef.palette.background.default,
    '--paper': currentDef.palette.background.paper,
    '--text': currentDef.palette.text?.primary ?? (currentDef.palette.mode === 'dark' ? '#fff' : '#111'),
    '--muted': currentDef.palette.text?.secondary ?? (currentDef.palette.mode === 'dark' ? '#bbb' : '#666'),
    '--primary': currentDef.palette.primary.main,
    '--error': currentDef.palette.error?.main ?? '#ff5252',
  } as Record<string, string>;

  return (
    <ThemeModeContext.Provider value={{ themeId, setThemeId, mode: currentDef.palette.mode, setMode, toggleMode, currentDef }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles
          styles={{
            ':root': cssVars,
            body: {
              backgroundColor: 'var(--bg)',
              color: 'var(--text)',
            },
          }}
        />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
};

export default ThemeProviderWrapper;
