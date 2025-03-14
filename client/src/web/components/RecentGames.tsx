import { ToastContainer } from 'react-toastify';
import { UserGame } from '../hooks/useRecentGames.types';

const RecentGames: React.FC<{ recentGames: UserGame[] }> = ({ recentGames }) => {
  return (

    <div className="recent-games">
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        draggable
        style={{ fontSize: '10px', maxWidth: '200px', height: 'auto' }}
      />
      {recentGames.length > 0 ? (
        <ul>
          <h3>Recently Played Games</h3>
          {recentGames.map((game) => (
            <li key={game.appid} className='game'>
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
};

export default RecentGames;
