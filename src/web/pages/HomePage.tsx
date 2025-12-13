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
import { useNavigate } from 'react-router-dom';

import { useProfileData } from '../hooks/useProfileData';
import { useSortedGameInfo } from '../hooks/useSortedGameInfo';
import LoadingOverlay from '../components/LoadingOverlay';

type GameItem = {
  id: string;
  title: string;
  cover?: string;
};

type SteamProfileData = {
  ownedGames?: Record<string, any>;
  recentGames?: Record<string, any>;
  user?: {
    name?: string;
    avatarFull?: string;
    profileUrl?: string;
  };
  badges?: {
    player_level?: number;
  };
};

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
    elevation={0}
    sx={{
      borderRadius: 2,
      overflow: 'hidden',
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(227,209,170,0.06)',
    }}
  >
    <CardMedia component="img" image={cover} alt={title} />
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

const HomePage: React.FC<{
  steamId: string;
  currentUserId: number;
  sidebarTags: string[];
}> = ({ steamId, currentUserId, sidebarTags }) => {
  const navigate = useNavigate();

  const { profileData: rawProfileData, loading: profileLoading } =
    useProfileData(steamId);

  const profileData = rawProfileData as SteamProfileData | null;

  const { data: gameInfoData, loading: gameInfoLoading } =
    useSortedGameInfo(sidebarTags, currentUserId, true);

  const processedGameInfoData = useMemo(() => {
    if (!gameInfoData) return [];
    return gameInfoData.map((gi: any) => ({
      id: `gameInfo_${gi.steam_appid}_${gi.name}`,
      title: gi.name,
      cover: gi.header_image,
    }));
  }, [gameInfoData]);

  const processedProfileData = useMemo(() => {
    if (!profileData) return null;

    const ownedGames = profileData.ownedGames;
    const recentGamesData = profileData.recentGames;
    const playerData = profileData.user;
    const playerLevel = profileData.badges?.player_level;

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
          id: `recent_${g.appid}`,
          title: g.name,
          cover: g.gameDetails?.data?.header_image,
        }))
        .slice(0, 10);
    }

    if (ownedGames) {
      const gamesArray = Object.values(ownedGames)
        .sort((a: any, b: any) => b.playtime_forever - a.playtime_forever)
        .map((game: any) => ({
          id: `game_${game.appid}`,
          title: game.name,
          cover: game.gameDetails?.data?.header_image,
          playtime: game.playtime_forever,
          genres: game.gameDetails?.data?.genres || [],
        }));

      topFive = gamesArray.slice(0, 5);
      gamesInLibrary = gamesArray.length;
      totalHours =
        gamesArray.reduce((sum: number, g: any) => sum + g.playtime, 0) / 60;
      mostPlayedGame = gamesArray[0]?.title ?? '';

      const genreMap: Record<string, number> = {};
      const uniqueSet = new Set<string>();

      gamesArray.forEach((game: any) => {
        game.genres.forEach((g: any) => {
          genreMap[g.description] =
            (genreMap[g.description] || 0) + game.playtime;
          uniqueSet.add(g.description);
        });
      });

      topTags = Object.entries(genreMap)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([tag]) => tag);

      uniqueTags = uniqueSet.size;
    }

    return {
      topFive,
      gamesInLibrary,
      totalHours: Math.round(totalHours),
      mostPlayedGame,
      topTags,
      uniqueTags,
      recentGames,
      playerData,
      playerLevel,
    };
  }, [profileData]);

  if (profileLoading || gameInfoLoading || !processedProfileData) {
    return <LoadingOverlay info="profile" />;
  }

  const {
    topFive,
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
        <Grid container columns={12} spacing={3}>
          <Grid size={{ xs: 12, md: 'auto' }}>
            <Paper
              elevation={0}
              sx={{
                minWidth: 320,
                p: 2.5,
                borderRadius: 2,
                backgroundColor: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(227,209,170,0.04)',
              }}
            >
              <Box sx={{ display: 'flex', gap: 3, mb: 3, alignItems: 'flex-start' }}>
                <Avatar
                  src={playerData?.avatarFull}
                  variant="rounded"
                  sx={{ width: 100, height: 100 }}
                />

                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="h4"
                    component="a"
                    href={playerData?.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: 'var(--primary)',
                      fontWeight: 800,
                      textDecoration: 'none',
                    }}
                  >
                    {playerData?.name}
                  </Typography>

                  <Typography
                    sx={{
                      textAlign: 'right',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    lv. {playerLevel ?? 0}
                  </Typography>
                </Box>
              </Box>

              <Stack spacing={2}>
                <StatItem label="Games in library" value={gamesInLibrary} />
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
          </Grid>

          <Grid size={{ xs: 12, md: 'grow' }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                height: '100%',
                borderRadius: 2,
                backgroundColor: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(227,209,170,0.04)',
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ color: 'var(--primary)', mb: 1 }}
              >
                Profile Summary
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: 'var(--text)', wordBreak: 'break-word' }}
              >
                Byle co tu można wkleić
              </Typography>
            </Paper>
          </Grid>

          <Grid size={12}>
            <Typography variant="h6" sx={{ color: 'var(--text)', mb: 1 }}>
              Top 5 Most Played
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
              {topFive.map((g) => (
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
                background: 'transparent',
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
                        sx={{ height: 120 }}
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
                          onClick={() =>
                            navigate('/user/recommendations')
                          }
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
              {recentGames.map((r) => (
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
                  <Typography
                    variant="body1"
                    sx={{ color: 'var(--text)' }}
                  >
                    {r.title}
                  </Typography>
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
