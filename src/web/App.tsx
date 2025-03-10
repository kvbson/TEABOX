import { useEffect, useState } from 'react';
import { ToastContainer } from "react-toastify";
import './App.css';
import { callServer } from './utils/callServer';

const testSteamId = '76561198271038475';

interface UserGame {
  appid: number;
  name: string;
  playtime_forever: number;
  playtime_2weeks?: number;
}

const fetchGameData = async (appId: number) => await callServer<UserGame>('gameData', { appId });

const fetchRecentGames = async (steamId: string) => await callServer('recentGames', { steamId });

const fetchOwnedGames = async (steamId: string) => await callServer('ownedGames', { steamId });

const fetchPlaytime = async (steamId: string, appId: number) => await callServer('playtime', { appId, steamId });

function App() {
  const [userGames, setUserGames] = useState<UserGame[]>([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const gamesData = await fetchRecentGames(testSteamId);
        if (gamesData?.response?.games) {
          setUserGames(gamesData.response.games);

          const gameDetails = await Promise.all(
            gamesData.response.games.map((game: any) => fetchGameData(game.appid))
          );

          console.log("Game Details: ", gameDetails);
          console.log("Owned Games: ", await fetchOwnedGames(testSteamId))
        }
      } catch (error) {
        console.error("Error in fetchGames:", error);
      }
    };

    fetchGames();
  }, []);

  return (
    <div className="App">
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        draggable
        style={{ fontSize: '10px', maxWidth: '200px', height: 'auto' }}
      />
      <h1>Recently Played Games:</h1>
      {userGames.length > 0 ? (
        <ul>
          {userGames.map((game) => (
            <li key={game.appid}>
              <h3>
                {game.name} ID: {game.appid}
              </h3>
              <p>Total Playtime: {Math.floor(game.playtime_forever / 60)} hours</p>
              {game.playtime_2weeks && (
                <p>Playtime (Last 2 Weeks): {Math.floor(game.playtime_2weeks / 60)} hours</p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No recently played games found.</p>
      )}
    </div>
  );
}

export default App;