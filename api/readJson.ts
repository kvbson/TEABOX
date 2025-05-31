import fs from 'node:fs';
import { getAllGameInfo } from './server/routes/utils/getAllGameInfo.js';
import { bulkUpsertGames } from './db/utils/upsertGamesList.js';
import { ExtendedGameInfo } from './types/gameInfo.types.js';

type JsonFile = Record<string, { Pros: { pro1: string; pro2: string; pro3: string; pro4: string; }, Cons: { con1: string; con2: string; con3: string; con4: string; }}>

export const readJson = async () => {
  const jsonData = JSON.parse(fs.readFileSync('./api/review_list.json', 'utf-8')) as JsonFile;
  if (!jsonData) {
    return console.log('Missing json data');
  }
  try {
    const fetchAllApps = async () => {
      const appIds = Object.keys(jsonData).map(id => Number(id)).filter(id => !isNaN(id) && (id || id === 0));
      return await getAllGameInfo(appIds);
    };
    const allGameInfo = await fetchAllApps();
    const filledGameInfo = Object.values(allGameInfo.games).map(({ gameDetails: { data } }) => {
      if (!data?.steam_appid) {
        return null;
      }
      const pros = Object.values(jsonData[String(data?.steam_appid)].Pros);
      const cons = Object.values(jsonData[String(data?.steam_appid)].Cons);
      if (pros.length > 0 || cons.length > 0) {
        console.log(pros, cons, data.name);
      }
      return { ...data, pros, cons };
    }).filter(Boolean) as ExtendedGameInfo[];
    const result = await bulkUpsertGames(filledGameInfo);
    console.log(result);
  } catch (err: any) {
    console.log('Error: ', err?.message);
  }

};

