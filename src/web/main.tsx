import { createRoot } from 'react-dom/client';
import App from './App';
import './css/globalVariables.css'
import './css/header.css';
import './css/index.css';
import './css/loadingSpinner.css';
import './css/recentGames.css';
import './css/sidebar.css';

createRoot(document.getElementById('root')!).render(
  <App />,
);
