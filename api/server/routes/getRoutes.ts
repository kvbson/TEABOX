import { Router } from 'express';
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
  const steamPrefix = '/api/steam';
  const mySQLPrefix = '/';
  const routes: { route: Router; prefix: string }[] = [
    { route: userPlaytime, prefix: steamPrefix },
    { route: userRecentGames, prefix: steamPrefix },
    { route: userOwnedGames, prefix: steamPrefix },
    { route: userProfileData, prefix: steamPrefix },
    { route: userBadges, prefix: steamPrefix },
    { route: gameInfo, prefix: steamPrefix },
    { route: missingIds, prefix: steamPrefix },
    { route: tags, prefix: steamPrefix },
    { route: topmostTags, prefix: steamPrefix },
    { route: sortedGameInfo, prefix: steamPrefix },
    { route: addUser, prefix: mySQLPrefix },
    { route: deleteUser, prefix: mySQLPrefix },
    { route: getUserWithEmail, prefix: mySQLPrefix },
    { route: getUserWithId, prefix: mySQLPrefix },
    { route: loginUser, prefix: mySQLPrefix },
    { route: logoutUser, prefix: mySQLPrefix },
    { route: meUser, prefix: mySQLPrefix },
  ];
  return routes;
}
