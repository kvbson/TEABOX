import { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import useRecentGames from './hooks/useRecentGames';

const testSteamId = '76561198271038475';

function App() {
  const { recentGames, loading, error } = useRecentGames(testSteamId);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="loading-spinner"></div>
        <span className="loading-text">Loading games...</span>
      </div>
    );
  }

  return (
    <div className="App">
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        draggable
        style={{ fontSize: '10px', maxWidth: '200px', height: 'auto' }}
      />
      <h1>Recently Played Games</h1>
      {recentGames.length > 0 ? (
        <ul>
          {recentGames.map((game) => (
            <li key={game.appid}>
              <h3>{game.name}</h3>
              <div>
                <p>App ID: {game.appid}</p>
                <p>Total Playtime: {Math.floor(game.playtime_forever / 60)}h</p>
                {game.playtime_2weeks && (
                  <p>Recent Playtime: {Math.floor(game.playtime_2weeks / 60)}h</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-games">No recently played games found</p>
      )}
    </div>
  );
}

export default App;