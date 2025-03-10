import { Router } from 'express';
import steamApi from '../../clients/steamApiClient';

 /**
  * Parameters:
  * @param steamId user steam id
  */

const userOwnedGames = Router();

userOwnedGames.get('/user/ownedGames/:steamId', async (req, res) => {
  const { steamId } = req.params;
  const params = {
    steamid: steamId,
    format: 'json',
    include_played_free_games: 'true',
    include_appinfo: 'true',
  };

  try {
    const { data } = await steamApi.get('IPlayerService/GetOwnedGames/v0001/', {
      params
    });
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch game data' });
  }
});

export default userOwnedGames;