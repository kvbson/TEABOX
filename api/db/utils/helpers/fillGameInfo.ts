import { getAllGames } from '#api/server/routes/GetAllGames';
import { getAllGameInfo } from '#api/server/routes/utils/getAllGameInfo';

export const fillGameInfo = async (quantity = 1000, offset = 0) => {
  const allGames = await getAllGames();
  const selectedGames = allGames.applist.apps.slice(offset, quantity + offset).map(el => parseInt(el.appid, 10)).filter(id => !isNaN(id) && (id || id === 0));
  console.log(`Selected ${selectedGames.length} games from ${allGames.applist.apps.length} total games.`);
  if (selectedGames.length === 0) {
    console.log('No valid games selected.');
    return [];
  }
  const allGameInfo = await getAllGameInfo(selectedGames);
  return allGameInfo;
};