import React, { useState, useEffect } from 'react';
import { useThemeMode } from '../../web/theme/useThemeMode';
import Grid from '@mui/material/Grid';
import {
  Paper,
  Box,
  Typography,
  Button,
  Stack,
  Container,
  ToggleButton,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { THEMES } from '../../web/theme/theme';

type Tag = string;

type Props = {
  getTags: () => Promise<{ data: Tag[] | null; error?: any }>;
  selectedTags: string[];
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
  setSuccessSave: React.Dispatch<React.SetStateAction<string | null>>;
  setError: React.Dispatch<React.SetStateAction<string | Error | null>>;
};

const ThemePreferencesSection: React.FC = () => {
  const ctx = useThemeMode() as any;
  const currentThemeId: string = ctx.themeId ?? ctx.theme ?? ctx.mode ?? 'default';

  const setThemeById = (id: string) => {
    if (!id) return;
    if (typeof ctx.setThemeId === 'function') return ctx.setThemeId(id);
    if (typeof ctx.setTheme === 'function') return ctx.setTheme(id);
    if (typeof ctx.setMode === 'function') return ctx.setMode(id as 'light' | 'dark');
    if (typeof ctx.set === 'function') return ctx.set(id);
    if (typeof ctx.toggleMode === 'function') {
      if ((id === 'light' || id === 'dark') && ctx.mode !== id) ctx.toggleMode();
    }
  };

  const makeList = () => {
    if (THEMES && typeof THEMES === 'object') {
      return Object.entries(THEMES).map(([id, t]) => {
        const name = t?.name ?? id;
        const primary = t?.palette?.primary?.main ?? 'var(--primary)';
        const bg = t?.palette?.background?.default ?? 'var(--bg)';
        const paper = t?.palette?.background?.paper ?? 'var(--paper)';
        return { id, name, primary, bg, paper };
      });
    }
    return [
      { id: 'light', name: 'Light', primary: 'var(--primary)', bg: 'var(--bg)', paper: 'var(--paper)' },
      { id: 'dark', name: 'Dark', primary: 'var(--primary)', bg: 'var(--bg)', paper: 'var(--paper)' },
    ];
  };

  const themes = makeList();

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h6" fontWeight={700}>
            Theme
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Choose a visual theme for TEABOX.
          </Typography>
        </Box>
      </Stack>

      <Grid container spacing={2}>
        {themes.map((t) => (
          <Grid  key={t.id}   component="div">
            <ToggleButton
              value={t.id}
              selected={currentThemeId === t.id}
              onChange={() => setThemeById(t.id)}
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                textTransform: 'none',
                p: 1,
                borderRadius: 2,
                borderColor: 'divider',
                bgcolor: 'transparent',
                '&.Mui-selected': {
                  boxShadow: (theme) =>
                    `0 6px 20px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.08)'}`,
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 56,
                    height: 40,
                    borderRadius: 1,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    border: '1px solid rgba(0,0,0,0.12)',
                  }}
                >
                  <Box sx={{ flex: 1, background: t.bg }} />
                  <Box sx={{ height: 12, background: t.primary }} />
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {t.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Preview
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {currentThemeId === t.id ? <CheckIcon fontSize="small" color="primary" /> : null}
              </Box>
            </ToggleButton>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

const PreferencesPage: React.FC<Props> = ({ getTags, selectedTags, setSelectedTags, setSuccessSave, setError }) => {
  const [allTags, setAllTags] = useState<Tag[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const result = await getTags();
        if (result?.data && Array.isArray(result.data)) {
          setAllTags(result.data);
        }
      } catch (error) {
        setError(error as Error);
      }
    };

    if (allTags.length === 0) {
      fetchTags();
    }
  }, [allTags.length, getTags, setError]);

  const toggleTag = (tag: Tag) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) return prev.filter((t) => t !== tag);
      if (prev.length < 5) return [...prev, tag];
      return prev;
    });
  };

  const handleSave = () => {
    localStorage.setItem('user-tags', JSON.stringify(selectedTags));
    setSuccessSave('Selected tags saved successfully.');
  };

  const handleReset = () => {
    localStorage.setItem('user-tags', JSON.stringify([]));
    setSelectedTags([]);
    setSuccessSave('Selected tags reset.');
  };

  return (
    <Container sx={{ py: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Typography variant="h4" fontWeight={700}>
        Your Preferences
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Typography>Select tags you're interested in (max 5):</Typography>

        {selectedTags.length >= 5 && (
          <Typography sx={{ color: 'crimson', mt: 1 }}>You can only select up to 5 tags.</Typography>
        )}

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
          {allTags.map((tag) => (
            <Button
              key={tag}
              variant={selectedTags.includes(tag) ? 'contained' : 'outlined'}
              color={selectedTags.includes(tag) ? 'primary' : 'inherit'}
              onClick={() => toggleTag(tag)}
              disabled={!selectedTags.includes(tag) && selectedTags.length >= 5}
              sx={{ textTransform: 'none' }}
            >
              {tag}
            </Button>
          ))}
        </Box>

        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          <Button variant="contained" onClick={handleSave}>
            Save Preferences
          </Button>
          <Button variant="outlined" onClick={handleReset}>
            Reset
          </Button>
        </Stack>
      </Paper>

      <ThemePreferencesSection />
    </Container>
  );
};

export default PreferencesPage;
