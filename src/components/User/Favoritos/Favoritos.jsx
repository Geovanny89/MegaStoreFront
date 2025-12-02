import { useFavorites } from "../../../context/FavoriteContext.jsx";
import { useEffect, useState } from "react";
import api from "../../../api/axios";
import { Trash2 } from "lucide-react";

export default function Favoritos() {
  const { removeFavorite } = useFavorites();
  const [productos, setProductos] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    const fetchFavProducts = async () => {
      try {
        const res = await api.get("/favorito/all");
        setProductos(Array.isArray(res.data.favorites) ? res.data.favorites : []);
      } catch (e) {
        console.log(e);
        setProductos([]);
      }
    };

    fetchFavProducts();
  }, []);

 const eliminarFavorito = async (favoriteId) => {
  try {
    setLoadingId(favoriteId);
    await api.delete(`/favoriteDelete/${favoriteId}`);
    removeFavorite(favoriteId);
    setProductos(productos.filter(f => f._id !== favoriteId));
  } catch (e) {
    console.log(e);
    alert("Error al eliminar favorito");
  } finally {
    setLoadingId(null);
  }
};

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Mis favoritos</h1>

      {productos.length === 0 ? (
        <p className="text-gray-500">Aún no tienes productos marcados como favoritos.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
          {productos.map(f => (
            <div
              key={f.product._id}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <div className="w-full h-48 bg-gray-50 flex justify-center items-center">
                <img
                  src={f.product.image?.[0]}
                  alt={f.product.name}
                  className="h-full object-contain p-2"
                />
              </div>

              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900">{f.product.name}</h2>
                <p className="text-blue-600 font-bold mt-3 text-xl">${f.product.price}</p>

              <button
  onClick={() => eliminarFavorito(f._id)}
  disabled={loadingId === f._id}
  className="mt-4 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition"
>
  <Trash2 size={18} />
  {loadingId === f._id ? "Eliminando..." : "Quitar favorito"}
</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
