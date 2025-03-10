import { Router } from 'express';
import { fetchSteamData } from '../../server/utils/fetchSteamData';

 /**
  * Parameters:
  * @param steamId user steam id
  */

const userRecentGames = Router();

userRecentGames.get('/user/recentGames/:steamId', async (req, res) => {
  const { steamId } = req.params;
  const params = {
    steamid: steamId,
    format: 'json',
  };
  console.log(params);

  try {
    const data = await fetchSteamData('IPlayerService/GetRecentlyPlayedGames/v0001/', params);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error });
  }
});

export default userRecentGames;