import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import ReactPixel from "react-facebook-pixel"; // 1. Importas la librería
import './index.css';

import App from './App.jsx';

// CONTEXT
import { FavoritesProvider } from './context/FavoriteContext.jsx';

// 2. CONFIGURACIÓN DEL PIXEL (Fuera del render para mayor velocidad)
const PIXEL_ID = "1777352596269707";
const options = {
    autoConfig: true,
    debug: false,
};

if (typeof window !== 'undefined') {
    ReactPixel.init(PIXEL_ID, options);
    ReactPixel.pageView(); // Primer disparo al cargar la web
}

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