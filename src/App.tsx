// import { FaRegStar, FaStar, FaStarHalfAlt } from 'react-icons/fa';
import './App.css';
const SERVER_URL = 'http://localhost:5000';

export const FetchRecentGames = async (steamId: string) => {
   const response = await fetch(`${SERVER_URL}/api/steam/recent/${steamId}`);
   return response.json();
   
};

function App() {

  //   fetchSteamData()
  //     .then((userRecentlyPlayedGames) => {
        
  //       if (userRecentlyPlayedGames?.response?.games) {
  //         const fetchedGames = userRecentlyPlayedGames.response.games;
  //         setGames(fetchedGames);
  //         fetchedGames.forEach((game: SteamGame) => {
  //           fetchLatestReview(game.appid)
  //             .then(({latestReview, score}) => {
  //               if (latestReview) {
  //                 setReviews((prevReviews) => ({
  //                   ...prevReviews,
  //                   [game.appid]: latestReview,
  //                 }));
  //               }
  //               if (score) {
  //                 setScore((prevScore) => ({
  //                   ...prevScore,
  //                   [game.appid]: score,
  //                 }));
  //               }
  //             })
  //           fetchIMG(game.appid)
  //             .then((image: string) => {
  //               if (image) {
  //                 setImage((prevReviews) => ({
  //                   ...prevReviews,
  //                   [game.appid]: image,
  //                 }));
  //               }
  //             })
  //         });
  //       }
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching Steam data:', error);
  //     });
  // }, []);

  return (
    <div className="App">
            <button onClick={() => {
        FetchRecentGames('76561198271038475')
      }}></button>
    </div>
  );
}

export default App;