import React from 'react';
import Grid from '@mui/material/Grid';
import {
  Box,
  Container,
  Paper,
  Typography,
  Stack,
  Avatar,
  Card,
  CardMedia,
  CardContent,
  Button,
  Chip,
  useTheme,
} from '@mui/material';

import game1_img from '../../../public/assets/images/game_image1.webp';
import game2_img from '../../../public/assets/images/game_image2.jpg';
import game3_img from '../../../public/assets/images/game_image3.png';
import game4_img from '../../../public/assets/images/game_image_4.jpg';
import game5_img from '../../../public/assets/images/game_image_5.png';
import game6_img from '../../../public/assets/images/game_image_6.webp';
import game7_img from '../../../public/assets/images/game_image_7.jpg';

const images = [game1_img, game2_img, game3_img, game4_img, game5_img, game6_img];

type GameItem = { id: string; title: string; cover?: string };

const mockData = {
  name: 'PlayerOne',
  totalHours: 1280,
  mostPlayed: 'Mystery Quest',
  gamesInLibrary: 214,
  uniqueTags: 48,
  topTags: ['Adventure', 'RPG', 'Indie', 'Puzzle', 'Co-op'],
  topGames: new Array(5).fill(0).map((_, i) => ({
    id: `tg${i}`,
    title: `Top Game ${i + 1}`,
    cover: images[i],
  })) as GameItem[],
  quickRecs: new Array(7).fill(0).map((_, i) => ({
    id: `qr${i}`,
    title: `Rec ${i + 1}`,
    cover: game7_img,
  })) as GameItem[],
  recent: new Array(6).fill(0).map((_, i) => ({
    id: `r${i}`,
    title: `Recent ${i + 1}`,
    cover: images[i],
  })) as GameItem[],
  profileSummary:
    'Casual explorer who loves short narrative experiences and puzzle-heavy mechanics. Prefers games with strong atmosphere.',
};

const StatItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <Box>
    <Typography variant="caption" sx={{ color: 'rgba(227,209,170,0.7)' }}>
      {label}
    </Typography>
    <Typography variant="h6" sx={{ color: 'var(--text)', fontWeight: 700 }}>
      {value}
    </Typography>
  </Box>
);

const GameCard: React.FC<{ title: string; cover?: string }> = ({ title, cover }) => (
  <Card
    sx={{
      width: 150,
      borderRadius: 2,
      overflow: 'hidden',
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(227,209,170,0.06)',
    }}
    elevation={0}
  >
    <CardMedia component="img" image={cover} alt={title} sx={{ height: 140, objectFit: 'cover' }} />
    <CardContent sx={{ p: 1 }}>
      <Typography variant="body2" sx={{ color: 'var(--color-text)' }} noWrap>
        {title}
      </Typography>
    </CardContent>
  </Card>
);

const HorizontalScroll: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box
    sx={{
      display: 'flex',
      overflowX: 'auto',
      gap: 2,
      py: 1,
      px: 0.5,
      '&::-webkit-scrollbar': { height: 8 },
      '&::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.08)', borderRadius: 4 },
    }}
  >
    {children}
  </Box>
);

const HomePage: React.FC = () => {
  const data = mockData;
  const theme = useTheme();

  return (
    <Box sx={{ minHeight: '100vh', pb: 6, backgroundColor: 'var(--color-bg)' }}>
      <Container maxWidth="lg" sx={{ pt: 4 }}>
        {/* header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h3" sx={{ color: 'var(--primary)', fontWeight: 800 }}>
            {data.name}
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center">
            <Chip
              label={`${data.gamesInLibrary} games`}
              size="small"
              sx={{
                bgcolor: 'transparent',
                color: 'var(--primary)',
                border: '1px dashed rgba(216,53,87,0.12)',
              }}
            />
            <Button variant="text" sx={{ color: 'var(--primary)' }}>
              Preferences
            </Button>
          </Stack>
        </Box>

        <Grid container spacing={3}>
          <Grid size={12} display="flex" gap={2} >
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 2,
                backgroundColor: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(227,209,170,0.04)',
              }}
            >
              <Stack spacing={2}>
                <StatItem label="Games in library" value={data.gamesInLibrary} />
                <StatItem label="Unique tags" value={data.uniqueTags} />
                <StatItem label="Total hours" value={`${data.totalHours} h`} />
                <StatItem label="Most played" value={data.mostPlayed} />

                <Box>
                  <Typography variant="subtitle2" sx={{ color: 'var(--color-text)', mb: 1 }}>
                    Top tags
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {data.topTags.map((t) => (
                      <Chip
                        key={t}
                        label={t}
                        size="small"
                        sx={{ color: 'var(--color-text)', bgcolor: 'transparent', border: '1px solid rgba(227,209,170,0.06)' }}
                      />
                    ))}
                  </Stack>
                </Box>
              </Stack>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(227,209,170,0.04)',
              }}
            >
              <Typography variant="subtitle1" sx={{ color: 'var(--primary)', mb: 1 }}>
                Profile Summary
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(227,209,170,0.8)' }}>
                {data.profileSummary}
              </Typography>
            </Paper>
          </Grid>

          <Grid size={12}>
            <Typography variant="h6" sx={{ color: 'var(--color-text)', mb: 1 }}>
              Top 5 Most Played
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
              {data.topGames.map((g) => (
                <GameCard key={g.id} title={g.title} cover={g.cover} />
              ))}
            </Stack>

            <Typography variant="h6" sx={{ color: 'var(--color-text)', mb: 1 }}>
              Quick recommendations
            </Typography>

            <Paper
              elevation={0}
              sx={{
                p: 1,
                borderRadius: 2,
                backgroundColor: 'transparent',
                border: '1px solid rgba(227,209,170,0.03)',
              }}
            >
              <HorizontalScroll>
                {data.quickRecs.map((r) => (
                  <Box key={r.id} sx={{ minWidth: 160 }}>
                    <Card
                      sx={{
                        borderRadius: 2,
                        overflow: 'hidden',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(227,209,170,0.04)',
                      }}
                    >
                      <CardMedia component="img" image={r.cover} alt={r.title} sx={{ height: 120, objectFit: 'cover' }} />
                      <CardContent sx={{ p: 1 }}>
                        <Typography variant="body2" sx={{ color: 'var(--color-text)' }} noWrap>
                          {r.title}
                        </Typography>
                        <Button size="small" variant="contained" sx={{ mt: 1, bgcolor: 'var(--primary)' }}>
                          View
                        </Button>
                      </CardContent>
                    </Card>
                  </Box>
                ))}
              </HorizontalScroll>
            </Paper>
          </Grid>

          <Grid size={12}>
            <Typography variant="h6" sx={{ color: 'var(--color-text)', mb: 1 }}>
              Recently played
            </Typography>

            <Stack spacing={2}>
              {data.recent.map((r) => (
                <Paper
                  key={r.id}
                  elevation={0}
                  sx={{
                    display: 'flex',
                    gap: 2,
                    alignItems: 'center',
                    p: 1.25,
                    borderRadius: 2,
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(227,209,170,0.03)',
                  }}
                >
                  <Avatar src={r.cover} variant="rounded" sx={{ width: 56, height: 56 }} />
                  <Box>
                    <Typography variant="body1" sx={{ color: 'var(--color-text)' }}>
                      {r.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(227,209,170,0.7)' }}>
                      Played 3 days ago
                    </Typography>
                  </Box>
                </Paper>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;
