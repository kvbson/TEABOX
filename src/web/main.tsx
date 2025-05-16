import { createRoot } from 'react-dom/client';
import App from './App';
import './css/header.css';
import './css/index.css';
import './css/loadingOverlay.css';
import './css/recentGames.css';
import './css/sidebar.css';
import './css/pages/Prefferences.css';

createRoot(document.getElementById('root')!).render(
  <App />,
);
