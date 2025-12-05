import missingIds from './db/GetMissingIds.js';
import sortedGameInfo from './db/GetSortedGameInfo.js';
import gameInfo from './GetGameInfo.js';
import tags from './GetTags.js';
import addUser from './mysql/addUser.js';
import deleteUser from './mysql/deleteUser.js';
import getUserWithEmail from './mysql/get/byEmail.js';
import getUserWithId from './mysql/get/byId.js';
import loginUser from './mysql/loginUser.js';
import logoutUser from './mysql/logoutUser.js';
import meUser from './mysql/meUser.js';
import userBadges from './steamUser/GetBadges.js';
import userOwnedGames from './steamUser/GetOwnedGames.js';
import userPlaytime from './steamUser/GetPlaytime.js';
import userProfileData from './steamUser/GetProfileData.js';
import userRecentGames from './steamUser/GetRecentGames.js';
import topmostTags from './utils/getTopmostTags.js';

export function getRoutes() {
  const routes = [
    userPlaytime,
    userRecentGames,
    userOwnedGames,
    userProfileData,
    userBadges,
    gameInfo,
    missingIds,
    tags,
    topmostTags,
    sortedGameInfo,
    addUser,
    deleteUser,
    getUserWithEmail,
    getUserWithId,
    loginUser,
    logoutUser,
    meUser,
  ];
  return routes;
}