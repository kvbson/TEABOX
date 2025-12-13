import React, { useMemo } from 'react';
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
} from '@mui/material';

import { useProfileData } from '../hooks/useProfileData';
import LoadingOverlay from '../components/LoadingOverlay';
import { useSortedGameInfo } from '../hooks/useSortedGameInfo';
import { useNavigate } from 'react-router-dom';

type GameItem = { id: string; title: string; cover?: string };

const StatItem: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <Box>
    <Typography variant="caption" sx={{ color: 'var(--primary)' }}>
      {label}
    </Typography>
    <Typography variant="h6" sx={{ color: 'var(--text)', fontWeight: 700 }}>
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
      <Typography variant="body2" sx={{ color: 'var(--text)' }} noWrap>
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

const HomePage: React.FC<{ steamId: string; currentUserId: number; sidebarTags: string[] }> = ({
  steamId,
  currentUserId,
  sidebarTags,
}) => {
  const navigate = useNavigate();
  const { profileData: rawProfileData, loading: profileDataLoading } = useProfileData(steamId);
  const { data: gameInfoData, loading: gameInfoLoading } = useSortedGameInfo(sidebarTags, currentUserId, true);

  const steamProfileData = rawProfileData as Record<string, any>;
  const processedGameInfoData = useMemo(() => {
    if (!gameInfoData) return [];
    return gameInfoData.map((gi: any) => ({
      id: `gameInfo_${gi.steam_appid}_${gi.name}`,
      title: gi.name,
      cover: gi.header_image,
    }));
  }, [gameInfoData]);

  const processedProfileData = useMemo(() => {
    if (!steamProfileData) return null;

    const ownedGames = steamProfileData.ownedGames as Record<string, any> | undefined;
    const recentGamesData = steamProfileData.recentGames as Record<string, any> | undefined;
    const playerData = steamProfileData.user as Record<string, any> | undefined;
    const playerLevel = steamProfileData.badges?.player_level as number | undefined;

    let topFive: GameItem[] = [];
    let gamesInLibrary = 0;
    let totalHours = 0;
    let mostPlayedGame = '';
    let topTags: string[] = [];
    let uniqueTags = 0;
    let recentGames: GameItem[] = [];

    if (recentGamesData) {
      recentGames = Object.values(recentGamesData)
        .map((g: any) => ({
          id: `recentGame_${g.appid}_${g.name}`,
          title: g.name,
          cover: g.gameDetails.data.header_image,
        }))
        .slice(0, 10);
    }

    if (ownedGames) {
      const gamesArray = Object.values(ownedGames)
        .sort((a, b) => b.playtime_forever - a.playtime_forever)
        .map((game: any) => ({
          id: `game_${game.appid}_${game.name}`,
          title: game.name,
          cover: game.gameDetails.data.header_image,
          playtime: game.playtime_forever,
          genres: game.gameDetails.data.genres || [],
        }));

      topFive = gamesArray.slice(0, 5);
      gamesInLibrary = gamesArray.length;
      totalHours = gamesArray.reduce((sum, g) => sum + (g.playtime || 0), 0) / 60;
      mostPlayedGame = gamesArray[0]?.title || '';

      const genreMap: Record<string, number> = {};
      const uniqueTagsSet = new Set<string>();

      gamesArray.forEach((game) => {
        game.genres.forEach((g: { description: string }) => {
          genreMap[g.description] = (genreMap[g.description] || 0) + (game.playtime || 0);
          uniqueTagsSet.add(g.description);
        });
      });

      topTags = Object.entries(genreMap)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([tag]) => tag);

      uniqueTags = uniqueTagsSet.size;
    }

    return {
      topFive,
      totalHours: Number(totalHours.toFixed(0)),
      gamesInLibrary,
      mostPlayedGame,
      topTags,
      uniqueTags,
      recentGames,
      playerData,
      playerLevel,
    };
  }, [steamProfileData]);

  if (profileDataLoading || gameInfoLoading || !processedProfileData) {
    return <LoadingOverlay info="profile" />;
  }

  const {
    topFive: topGames,
    gamesInLibrary,
    totalHours,
    mostPlayedGame,
    topTags,
    uniqueTags,
    recentGames,
    playerData,
    playerLevel,
  } = processedProfileData;

  return (
    <Box sx={{ minHeight: '100vh', pb: 6, backgroundColor: 'var(--bg)' }}>
      <Container maxWidth="lg" sx={{ pt: 4 }}>
        {/* header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Avatar
            src={playerData?.avatarFull}
            variant="rounded"
            sx={{ width: 56, height: 56 }}
          />
          <Typography
            variant="h3"
            component="a"
            href={playerData?.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: 'var(--primary)', fontWeight: 800, textDecoration: 'none' }}
          >
            {playerData?.name} lv. {playerLevel ?? 0}
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center">
            <Chip
              label={`${gamesInLibrary} games`}
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
                  value={gamesInLibrary} />
                <StatItem label="Unique tags" value={uniqueTags} />
                <StatItem label="Total hours" value={`${totalHours} h`} />
                <StatItem label="Most played" value={mostPlayedGame} />

                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: 'var(--primary)', mb: 1 }}
                  >
                    Top tags
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {topTags.map((t) => (
                      <Chip
                        key={t}
                        label={t}
                        size="small"
                        sx={{
                          color: 'var(--text)',
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
              <Typography variant="subtitle1" sx={{ color: 'var(--primary)', mb: 1 }}>
                Profile Summary
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: 'var(--text)' }}
              >
                {'Byle co tu można wkleić.....................i się nie rozciąga'}
              </Typography>
            </Paper>
          </Grid>

          <Grid size={12}>
            <Typography variant="h6" sx={{ color: 'var(--text)', mb: 1 }}>
              Top 5 Most Played
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
              {topGames.map((g) => (
                <GameCard key={g.id} title={g.title} cover={g.cover} />
              ))}
            </Stack>

            <Typography variant="h6" sx={{ color: 'var(--text)', mb: 1 }}>
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
                {processedGameInfoData.map((r) => (
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
                          sx={{ color: 'var(--text)' }}
                          noWrap
                        >
                          {r.title}
                        </Typography>
                        <Button
                          size="small"
                          variant="contained"
                          sx={{ mt: 1, bgcolor: 'var(--primary)' }}
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
            <Typography variant="h6" sx={{ color: 'var(--text)', mb: 1 }}>
              Recently played
            </Typography>

            <Stack spacing={2}>
              {recentGames?.map((r) => (
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
                      sx={{ color: 'var(--text)' }}
                    >
                      {r.title}
                    </Typography>
                    {/* <Typography
                      variant="caption"
                      sx={{ color: ''var(--text)' }}
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
