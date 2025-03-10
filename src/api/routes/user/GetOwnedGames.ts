import { Router } from 'express';
import { fetchSteamData } from '../../server/utils/fetchSteamData';

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
    const data = await fetchSteamData('IPlayerService/GetOwnedGames/v0001/', params);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error });
  }
});

export default userOwnedGames;