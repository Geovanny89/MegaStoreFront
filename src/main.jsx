import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import './index.css';

import App from './App.jsx';

// IMPORTA EL PROVIDER
import { FavoritesProvider } from './context/FavoriteContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>

      {/* ENVUELVE AQUÍ TODA LA APP */}
      <FavoritesProvider>
        <App />
      </FavoritesProvider>

    </BrowserRouter>
  </StrictMode>
);
