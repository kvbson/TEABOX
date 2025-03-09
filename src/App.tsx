// import { FaRegStar, FaStar, FaStarHalfAlt } from 'react-icons/fa';
import './App.css';
const SERVER_URL = 'http://localhost:5000';

export const FetchRecentGames = async (steamId: string) => {
   const response = await fetch(`${SERVER_URL}/api/steam/recent/${steamId}`);
   return response.json();
   
};

function App() {


  return (
    <div className="App">
            <button onClick={() => {
        FetchRecentGames('76561198271038475')
      }}></button>
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
