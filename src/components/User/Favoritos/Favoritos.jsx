import { useFavorites } from "../../../context/FavoriteContext.jsx";
import { useEffect, useState } from "react";
import api from "../../../api/axios";
import { Trash2 } from "lucide-react";

export default function Favoritos() {
  const { removeFavorite } = useFavorites();
  const [productos, setProductos] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [addingId, setAddingId] = useState(null);

  useEffect(() => {
    const fetchFavProducts = async () => {
      try {
        const res = await api.get("/favorito/all");
        setProductos(Array.isArray(res.data.favorites) ? res.data.favorites : []);
      } catch (e) {
        if (e.response?.status === 404) {
          setProductos([]);
        } else {
          console.error("Error inesperado:", e);
        }
      }
    };

    fetchFavProducts();
  }, []);

  // ✅ Eliminar FAVORITO usando productId → porque tu backend lo pide así
  const eliminarFavorito = async (favorite) => {
    try {
      setLoadingId(favorite._id);

      await api.delete(`/favoriteDelete/${favorite.product._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      // Eliminar en lista local de favoritos
      setProductos((prev) => prev.filter((f) => f._id !== favorite._id));

      // 🔥 ACTUALIZAR FAVORITOS GLOBALES (Products.jsx también lo verá)
      removeFavorite(favorite.product._id);

    } catch (e) {
      console.error("ERROR ELIMINANDO FAVORITO:", e);
      alert("Error al eliminar favorito");
    } finally {
      setLoadingId(null);
    }
  };


  // 🛒 Agregar al carrito y luego eliminar favorito
  const agregarCarrito = async (productId, favoriteId) => {
    try {
      setAddingId(productId);
      const token = localStorage.getItem("token");

      await api.post(
        "/user/car",
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Buscar el favorito completo
      const favoritoItem = productos.find(f => f._id === favoriteId);

      if (favoritoItem) {
        await eliminarFavorito(favoritoItem);
      }

      alert("Producto añadido al carrito y eliminado de favoritos");

    } catch (err) {
      console.error(err);
      alert("Error al añadir al carrito");
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Mis favoritos</h1>

      {productos.length === 0 ? (
        <p className="text-gray-500">Aún no tienes productos marcados como favoritos.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
          {productos.map((f) => (
            <div
              key={f._id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              <div className="w-full h-44 bg-gray-50 flex justify-center items-center">
                <img
                  src={
                    f.product.image?.[0]?.url ||
                    f.product.image?.[1]?.url ||
                    "/no-image.png"
                  }
                  alt={f.product.name}
                  className="h-full object-contain p-3"
                />

              </div>

              <div className="p-4">
                <h2 className="text-lg font-medium text-gray-800">{f.product.name}</h2>

                <p className="text-gray-900 font-semibold mt-2 text-lg">
                  ${f.product.price}
                </p>

                {/* 🛒 Añadir al carrito */}
                <button
                  onClick={() => agregarCarrito(f.product._id, f._id)}
                  disabled={addingId === f.product._id}
                  className="
                    mt-4 w-full py-2 text-sm font-medium
                    border border-gray-300 rounded-md
                    text-gray-700 hover:bg-gray-100
                    transition-all
                  "
                >
                  {addingId === f.product._id ? "Agregando..." : "Añadir al carrito"}
                </button>

                {/* ❌ Quitar favorito */}
                <button
                  onClick={() => eliminarFavorito(f)}
                  disabled={loadingId === f._id}
                  className="
                    mt-2 w-full py-2 text-sm font-medium
                    text-red-600 hover:bg-red-50 rounded-md
                    flex items-center justify-center gap-2
                    transition-all
                  "
                >
                  <Trash2 size={16} />
                  {loadingId === f._id ? "Eliminando..." : "Quitar"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
