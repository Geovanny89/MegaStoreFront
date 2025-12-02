import { createContext, useContext, useState } from "react";

const FavoriteContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  const addFavorite = (product) => {
    if (!favorites.find(f => f._id === product._id)) {
      setFavorites([...favorites, product]);
    }
  };

  const removeFavorite = (productId) => {
    setFavorites(favorites.filter(f => f._id !== productId));
  };

  // OJO: no se exporta toggleFavorite desde aquí; se puede crear dentro del componente que lo use
  return (
    <FavoriteContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoriteContext);
