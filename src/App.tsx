// import { FaRegStar, FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { ToastContainer } from "react-toastify";
import './App.css';
import { errorHandler } from './utils/errorHandler';
const SERVER_URL = 'http://localhost:5000';

interface UserGame {
   appid: number;
   name: string;
   playtime_forever: number;
   playtime_2weeks?: number; // Optional field
  
 };

export const FetchGameData = async (gameId: number) => {
  return errorHandler(await fetch(`${SERVER_URL}/api/steam/game-data/${gameId}`));
};

export const FetchRecentGames = async (steamId: string) => {
  return errorHandler(await fetch(`${SERVER_URL}/api/steam/recent/${steamId}`));
};

function App() {
const [userGames, setUserGames] = useState<UserGame[]>([]);

  useEffect(() => {
    const fetchGames = async () => {
      const games = await FetchRecentGames('76561198271038475');
      setUserGames(games.response.games);
      // games.response.games.map(async (game: UserGame) => {
      // return FetchGameData(game.appid);
      // }); 
    }
    fetchGames();
   
  }, [])


  return (
    
    <div className="App">
<ToastContainer
        position="bottom-right"
        autoClose={3000}
        draggable
        style={{
          fontSize: '10px',
          maxWidth: '200px',
          height: 'auto',
        }}
      />
       <h1>Recently Played Games:</h1>
       {userGames.length > 0 ? (
         <ul>
           {userGames.map((game) => (
             <li key={game.appid}>
               {/* {image[game.appid] ? (
               <img src={ image[game.appid]} />
               ) : ''} */}
               <h3>
                 {game.name} ID: {game.appid}
               </h3>
                {/* {score[game.appid] !== undefined && <StarRating score={score[game.appid]} />} */}
               <p>Total Playtime: {Math.floor(game.playtime_forever / 60)} hours</p>
               {game.playtime_2weeks && (
                 <p>Playtime (Last 2 Weeks): {Math.floor(game.playtime_2weeks / 60)} hours</p>
               )}
               {/* {reviews[game.appid] ? (
                 <p>Latest review: {reviews[game.appid]}</p>
               ) : ''}  */}
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

//Init code

// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.tsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App
