import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import './index.css';

import App from './App.jsx';

// CONTEXT
import { FavoritesProvider } from './context/FavoriteContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter
      future={{
        v7_relativeSplatPath: true,
      }}
    >
      <FavoritesProvider>
        <App />
      </FavoritesProvider>
    </BrowserRouter>
  </StrictMode>
);
