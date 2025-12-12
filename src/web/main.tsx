import { createRoot } from 'react-dom/client';
import App from './App';
//added to import all css globally in web vite environment
import './/theme/fonts-and-variables.css';

import.meta.glob('./css/**/*.css', { eager: true });

import  ThemeProviderWrapper from './theme/ThemeProviderWrapper'; 
import React from 'react';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProviderWrapper>
      <App />
    </ThemeProviderWrapper>
  </React.StrictMode>,
);