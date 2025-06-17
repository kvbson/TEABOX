import fs from 'node:fs';
import { getAllGameInfo } from './server/routes/utils/getAllGameInfo.js';
import { bulkUpsertGames } from './db/utils/upsertGamesList.js';
export const readJson = async () => {
    try {
        const jsonData = JSON.parse(fs.readFileSync('./api/review_list.json', 'utf-8'));
        if (!jsonData) {
            return console.log('Missing json data');
        }
        const fetchAllApps = async () => {
            const appIds = Object.keys(jsonData).map(id => Number(id)).filter(id => !isNaN(id) && (id || id === 0));
            console.log(`Selected ${appIds.length} apps from json data.`);
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
        }).filter(Boolean);
        const result = await bulkUpsertGames(filledGameInfo);
        console.log(result);
    }
    catch (err) {
        console.log('Error: ', err?.message);
    }
};
