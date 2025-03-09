import { useEffect, useState } from 'react';
import { FaRegStar, FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { fetchIMG, fetchLatestReview, fetchSteamData } from '../api/steam/service'; // Import serwisu
import './App.css';

interface SteamGame {
  appid: number;
  name: string;
  playtime_forever: number;
  playtime_2weeks?: number; // Optional field
}

const StarRating = ({ score }: {score: number}) => {
  const fullStars = Math.floor(score / 2);
  const hasHalf = score % 2 === 1;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="rating-container">
      {Array.from({ length: fullStars }, (_, i) => (
        <FaStar key={i} className="star full" />
      ))}
      {hasHalf && <FaStarHalfAlt key="half" className="star half" />}
      {Array.from({ length: emptyStars }, (_, i) => (
        <FaRegStar key={i + fullStars + 1} className="star empty" />
      ))}
    </div>
  );
};
function App() {
  const [games, setGames] = useState<SteamGame[]>([]);
  const [reviews, setReviews] = useState<{ [key: number]: string }>({});
  const [score, setScore] = useState<{ [key: number]: number }>({});
  const [image, setImage] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    fetchSteamData()
      .then((userRecentlyPlayedGames) => {
        
        if (userRecentlyPlayedGames?.response?.games) {
          const fetchedGames = userRecentlyPlayedGames.response.games;
          setGames(fetchedGames);
          fetchedGames.forEach((game: SteamGame) => {
            fetchLatestReview(game.appid)
              .then(({latestReview, score}) => {
                if (latestReview) {
                  setReviews((prevReviews) => ({
                    ...prevReviews,
                    [game.appid]: latestReview,
                  }));
                }
                if (score) {
                  setScore((prevScore) => ({
                    ...prevScore,
                    [game.appid]: score,
                  }));
                }
              })
            fetchIMG(game.appid)
              .then((image: string) => {
                if (image) {
                  setImage((prevReviews) => ({
                    ...prevReviews,
                    [game.appid]: image,
                  }));
                }
              })
          });
        }
      })
      .catch((error) => {
        console.error('Error fetching Steam data:', error);
      });
  }, []);

  return (
    <div className="App">
      <h1>Recently Played Games:</h1>
      {games.length > 0 ? (
        <ul>
          {games.map((game) => (
            <li key={game.appid}>
              {image[game.appid] ? (
              <img src={ image[game.appid]} />
              ) : ''}
              <h3>
                {game.name} ID: {game.appid}
              </h3>
               {score[game.appid] !== undefined && <StarRating score={score[game.appid]} />}
              <p>Total Playtime: {Math.floor(game.playtime_forever / 60)} hours</p>
              {game.playtime_2weeks && (
                <p>Playtime (Last 2 Weeks): {Math.floor(game.playtime_2weeks / 60)} hours</p>
              )}
              {reviews[game.appid] ? (
                <p>Latest review: {reviews[game.appid]}</p>
              ) : ''} 
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