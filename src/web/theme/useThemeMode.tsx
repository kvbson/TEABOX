// src/web/theme/useThemeMode.tsx
import { useContext } from 'react';
import { ThemeModeContext } from './ThemeProviderWrapper';

export const useThemeMode = () => {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) {
    throw new Error('useThemeMode must be used inside <ThemeProviderWrapper>');
  }
  return ctx;
};