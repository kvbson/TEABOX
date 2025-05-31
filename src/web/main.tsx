import { createRoot } from 'react-dom/client';
import App from './App';
//added to import all css globally in web vite environment
import.meta.glob('./css/**/*.css', { eager: true });

createRoot(document.getElementById('root')!).render(
  <App />,
);
