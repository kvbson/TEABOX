import React, { useEffect, useMemo, useState } from 'react';
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
import { useProfileData } from '../hooks/useProfileData';
import LoadingOverlay from '../components/LoadingOverlay';
import { useSortedGameInfo } from '../hooks/useSortedGameInfo';
import { useNavigate } from 'react-router-dom';

const images = [
  game1_img,
  game2_img,
  game3_img,
  game4_img,
  game5_img,
  game6_img,
];

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

const StatItem: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <Box>
    <Typography variant="caption" sx={{ color: 'rgba(227,209,170,0.7)' }}>
      {label}
    </Typography>
    <Typography
      variant="h6"
      sx={{ color: 'var(--color-text)', fontWeight: 700 }}
    >
      {value}
    </Typography>
  </Box>
);

const GameCard: React.FC<{ title: string; cover?: string }> = ({
  title,
  cover,
}) => (
  <Card
    sx={{
      width: 'auto',
      borderRadius: 2,
      overflow: 'hidden',
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(227,209,170,0.06)',
    }}
    elevation={0}
  >
    <CardMedia
      component="img"
      image={cover}
      alt={title}
      sx={{ height: 'auto', objectFit: 'cover' }}
    />
    <CardContent sx={{ p: 1 }}>
      <Typography variant="body2" sx={{ color: 'var(--color-text)' }} noWrap>
        {title}
      </Typography>
    </CardContent>
  </Card>
);

const HorizontalScroll: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <Box
    sx={{
      display: 'flex',
      overflowX: 'auto',
      gap: 2,
      py: 1,
      px: 0.5,
      '&::-webkit-scrollbar': { height: 8 },
      '&::-webkit-scrollbar-thumb': {
        background: 'rgba(255,255,255,0.08)',
        borderRadius: 4,
      },
    }}
  >
    {children}
  </Box>
);

const HomePage: React.FC<{ steamId: string, currentUserId: number, sidebarTags: string[] }> = ({
  steamId,
  currentUserId,
  sidebarTags,
}: {
  steamId: string;
  currentUserId: number;
   sidebarTags: string[];
}) => {
  // const theme = useTheme();
  const navigate = useNavigate();

  const { data, loading: gameInfoLoading } = useSortedGameInfo(sidebarTags, currentUserId, true);

  const { profileData: rawProfileData, loading:profileDataLoading } = useProfileData(steamId);
  const steamProfileData = rawProfileData as Record<string, any>;
  const gameInfoData = data as Record<string, any>;

  console.log(gameInfoData);

  const processedGameInfoData = useMemo(() => {
    let gameInfo: GameItem[] = [];
    if (!data) return null;
    gameInfo = data.map(gi => ({
      id: `gameInfo_${gi.steam_appid}_${gi.name}`,
      title: gi.name,
      cover: gi.header_image,
    }));

    return { gameInfo };

  },[data]);

  const processedProfileData = useMemo(() => {
    if (!steamProfileData) return null;

    const ownedGames = steamProfileData.ownedGames as Record<string, any> | undefined;
    const uniqueTags = steamProfileData.tags as string[] | undefined;
    const recentGamesData = steamProfileData.recentGames as Record<string, any> | undefined;

    let topFive: GameItem[] = [];
    let totalHours = 0;
    let mostPlayedGame = '';
    let topTags: string[] = [];
    //
    let recentGames: GameItem[] = [];

    if (recentGamesData) {
      const recentGamesArray = Object.values(recentGamesData).map(recentGame => ({
        id: `recentGame_${recentGame.appid}_${recentGame.name}`,
        title: recentGame.name,
        cover: recentGame.gameDetails.data.header_image,
      }));

      recentGames = recentGamesArray.slice(0,10);

    }

    if (ownedGames) {
      const gamesArray = Object.values(ownedGames)
        .sort((a, b) => b.playtime_forever - a.playtime_forever)
        .map(game => (

          {
            id: `game_${game.appid}_${game.name}`,
            title: game.name,
            cover: game.gameDetails.data.header_image,
            playtime: game.playtime_forever,
            genres: game.gameDetails.data.genres || [],
          }));

      topFive = gamesArray.slice(0, 5);
      totalHours = gamesArray.reduce((sum, game) => sum + (game.playtime || 0), 0) / 60;
      mostPlayedGame = gamesArray[0]?.title || '';
      //
      const genreMap: Record<string, number> = {};
      gamesArray.forEach(game => {
        game.genres.forEach((g: { description: string }) => {
          genreMap[g.description] = (genreMap[g.description] || 0) + (game.playtime || 0);
        });
      });

      topTags = Object.entries(genreMap)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([genre]) => genre);

    }

    return {
      topFive,
      totalHours: Number(totalHours.toFixed(0)),
      mostPlayedGame,
      uniqueTags: Array.isArray(uniqueTags) && uniqueTags.length > 0 ? uniqueTags.length : 0,
      topTags,
      recentGames,
    };
  }, [steamProfileData]);

  const topGames = processedProfileData?.topFive;
  const totalPlaytime = processedProfileData?.totalHours;
  const mostPlayedGame = processedProfileData?.mostPlayedGame;
  const uniqueTags = processedProfileData?.uniqueTags;
  const topTags = processedProfileData?.topTags;
  const recentGames = processedProfileData?.recentGames;
  //
  const quickRecommendations = processedGameInfoData?.gameInfo;

  if (profileDataLoading || gameInfoLoading || !steamProfileData || !gameInfoData) {
    return <LoadingOverlay />;
  }

  mockData.topGames = topGames ?? [];
  mockData.totalHours = totalPlaytime ?? 0;
  mockData.mostPlayed = mostPlayedGame ?? '';
  mockData.uniqueTags = uniqueTags ?? 0;
  mockData.topTags = topTags ?? [];
  mockData.recent = recentGames ?? [];
  mockData.quickRecs = quickRecommendations ?? [];

  return (
    <Box sx={{ minHeight: '100vh', pb: 6, backgroundColor: 'var(--color-bg)' }}>
      <Container maxWidth="lg" sx={{ pt: 4 }}>
        {/* header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography
            variant="h3"
            sx={{ color: 'var(--color-primary)', fontWeight: 800 }}
          >
            {mockData.name}
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center">
            <Chip
              label={`${mockData.gamesInLibrary} games`}
              size="small"
              sx={{
                bgcolor: 'transparent',
                color: 'var(--color-primary)',
                border: '1px dashed rgba(216,53,87,0.12)',
              }}
            />
            <Button variant="text" sx={{ color: 'var(--color-primary)' }}>
              Preferences
            </Button>
          </Stack>
        </Box>

        <Grid container spacing={3}>
          <Grid size={12} display="flex" gap={2}>
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
                <StatItem
                  label="Games in library"
                  value={mockData.gamesInLibrary}
                />
                <StatItem label="Unique tags" value={mockData.uniqueTags} />
                <StatItem label="Total hours" value={`${mockData.totalHours} h`} />
                <StatItem label="Most played" value={mockData.mostPlayed} />

                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: 'var(--color-text)', mb: 1 }}
                  >
                    Top tags
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {mockData.topTags.map((t) => (
                      <Chip
                        key={t}
                        label={t}
                        size="small"
                        sx={{
                          color: 'var(--color-text)',
                          bgcolor: 'transparent',
                          border: '1px solid rgba(227,209,170,0.06)',
                        }}
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
              <Typography
                variant="subtitle1"
                sx={{ color: 'var(--color-primary)', mb: 1 }}
              >
                Profile Summary
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: 'rgba(227,209,170,0.8)' }}
              >
                {mockData.profileSummary}
              </Typography>
            </Paper>
          </Grid>

          <Grid size={12}>
            <Typography variant="h6" sx={{ color: 'var(--color-text)', mb: 1 }}>
              Top 5 Most Played
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
              {mockData.topGames.map((g) => (
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
                {mockData.quickRecs.map((r) => (
                  <Box key={r.id} sx={{ minWidth: 160 }}>
                    <Card
                      sx={{
                        borderRadius: 2,
                        overflow: 'hidden',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(227,209,170,0.04)',
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={r.cover}
                        alt={r.title}
                        sx={{ height: 120, objectFit: 'cover' }}
                      />
                      <CardContent sx={{ p: 1 }}>
                        <Typography
                          variant="body2"
                          sx={{ color: 'var(--color-text)' }}
                          noWrap
                        >
                          {r.title}
                        </Typography>
                        <Button
                          size="small"
                          variant="contained"
                          sx={{ mt: 1, bgcolor: 'var(--color-primary)' }}
                          onClick={() => navigate('/user/recommendations')}
                        >
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
              {mockData.recent.map((r) => (
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
                  <Avatar
                    src={r.cover}
                    variant="rounded"
                    sx={{ width: 56, height: 56 }}
                  />
                  <Box>
                    <Typography
                      variant="body1"
                      sx={{ color: 'var(--color-text)' }}
                    >
                      {r.title}
                    </Typography>
                    {/* <Typography
                      variant="caption"
                      sx={{ color: 'rgba(227,209,170,0.7)' }}
                    >
                      Played 3 days ago
                    </Typography> */}
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
