import React, { useEffect, useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Typography,
  Button,

} from '@mui/material';
import { useBannedGamesWithInfo } from '../hooks/useBannedGamesWithInfo';
import LoadingOverlay from '../components/LoadingOverlay';

type BannedGamesParams = {
  currentUserId: number;
    handleBanGame: ({ currentUserId, gameId }: {
  currentUserId: number;
  gameId: number;
  }) => Promise<void>
}

export default function BannedGames({ currentUserId, handleBanGame }: BannedGamesParams) {
  const { data, loading } = useBannedGamesWithInfo({ currentUserId });
  const [games, setGames] = useState<any[]>([]);

  useEffect(() => {
    setGames(data);
  }, [data]);

  const onUnban = async (e: React.FormEvent, gameId: number) => {
    e.preventDefault();
    await handleBanGame({ currentUserId, gameId });
    setGames(prev => prev.filter(g => g.id !== gameId));
  };

  return (
    <>
      {loading ? (
        <LoadingOverlay info='banned list' />
      ) : (
        <Box sx={{ p: 15 }}>
          <Typography variant="h5" gutterBottom>
          Lista zbanowanych gier
          </Typography>

          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Game</TableCell>
                  <TableCell>Banned date</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {games.map((game) => (
                  <TableRow key={game.id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Button onClick={(e) => onUnban(e, game.id)}>🔓</Button>
                        <Avatar src={game.capsuleImage} variant="rounded" sx={{ width: 'auto', height: 56 }} />
                        <Box>
                          <Typography variant="subtitle1">{game.gameName}</Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      {new Date(game.ban_date).toLocaleString('pl-PL', {
                        timeZone: 'Europe/Warsaw',
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                      })}
                    </TableCell>
                  </TableRow>
                ))}

                {games.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                    Brak zbanowanych gier.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </>
  );
}
