import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import ReactPixel from "react-facebook-pixel";
import "./index.css";

import App from "./App.jsx";

// CONTEXT
import { FavoritesProvider } from "./context/FavoriteContext.jsx";

// ===============================
// META PIXEL – SOLO INIT (NO TRACK)
// ===============================
const PIXEL_ID = "1777352596269707";

if (typeof window !== "undefined") {
  ReactPixel.init(PIXEL_ID, {
    autoConfig: true,
    debug: false,
  });
}

// ===============================
// RENDER APP
// ===============================
createRoot(document.getElementById("root")).render(
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
