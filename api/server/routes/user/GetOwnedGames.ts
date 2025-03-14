import { Router } from 'express';
import steamApi from '../../clients/steamClients/steamApiClient.js';

/**
  * Parameters:
  * @param steamId user steam id
  */

const userOwnedGames = Router();

userOwnedGames.get('/user/ownedGames', async (req, res) => {
  const { steamId } = req.query;
  const params = {
    steamid: steamId,
    format: 'json',
    include_played_free_games: 'true',
    include_appinfo: 'true',
    adapter: 'https',
  };

  try {
    const { data } = await steamApi.get('IPlayerService/GetOwnedGames/v0001/', {
      params,
    });
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

export default userOwnedGames;