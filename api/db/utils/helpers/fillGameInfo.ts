import { getAllGames } from '#api/server/routes/GetAllGames';
import { getAllGameInfo } from '#api/server/routes/utils/getAllGameInfo';

export const fillGameInfo = async (quantity = 1000, offset = 0) => {
  const allGames = await getAllGames();
  const selectedGames = allGames.applist.apps.slice(offset, quantity).map(el => parseInt(el.appid, 10)).filter(id => !isNaN(id) && (id || id === 0));
  const allGameInfo = await getAllGameInfo(selectedGames);
  return allGameInfo;
};