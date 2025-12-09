import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../../api/axios";
import { Heart } from "lucide-react";
import { useFavorites } from "../../../context/FavoriteContext";

export default function Categorie() {
  const { id } = useParams();
  const [categoria, setCategoria] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(null);

  const { favorites, addFavorite, removeFavorite } = useFavorites();

  // MODAL
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImg, setSelectedImg] = useState("");
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    const fetchCategoria = async () => {
      try {
        const res = await api.get(`/user/categori/${id}`);
        setCategoria(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCategoria();
  }, [id]);

  if (!categoria) return <p>Cargando...</p>;

  const agregarAlCarrito = async (productId, quantity = 1) => {
    try {
      setLoadingId(productId);
      await api.post("/user/car", { productId, quantity });
      alert("Producto agregado al carrito ✔");
    } catch (error) {
      alert("Error al agregar al carrito ❌");
    } finally {
      setLoadingId(null);
    }
  };

  // FAVORITOS
  const handleToggleFavorite = async (product) => {
    try {
      setLoadingId(product._id);
      const isFav = favorites.some((f) => f._id === product._id);

      if (isFav) {
        await api.delete(`/favoriteDelete/${product._id}`);
        removeFavorite(product._id);
      } else {
        await api.post(`/favorite/${product._id}`);
        addFavorite(product);
      }
    } catch (e) {
      console.error(e);
      alert("Error al actualizar favoritos");
    } finally {
      setLoadingId(null);
    }
  };

  // VER PRODUCTO
  const verProducto = async (id) => {
    try {
      setLoadingProduct(id);
      const res = await api.get(`/product/${id}`);

      setSelectedProduct(res.data);
      if (res.data.image?.length > 0) {
        setSelectedImg(res.data.image[0]);
      }

      setCantidad(1);
      setModalOpen(true);
    } catch (error) {
      alert("Error cargando producto");
    } finally {
      setLoadingProduct(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold mb-6">
          Categoría: {categoria.name}
        </h1>

        {categoria.productos?.length === 0 ? (
          <p className="text-gray-500 text-lg">No hay productos en esta categoría.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
            {categoria.productos.map((p) => {
              const isFav = favorites.some((f) => f._id === p._id);

              return (
                <div
                  key={p._id}
                  className="bg-white rounded-2xl shadow-sm border hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  {/* Imagen + favorito */}
                  <div className="relative">
                    <div className="w-full h-48 bg-gray-50 flex justify-center items-center">
                      <img
                        src={p.image?.[1] || p.image?.[0]}
                        alt={p.name}
                        className="h-full object-contain p-2"
                      />
                    </div>

                    <button
                      onClick={() => handleToggleFavorite(p)}
                      disabled={loadingId === p._id}
                      className={`absolute top-3 right-3 rounded-full p-2 shadow transition 
                        ${
                          isFav
                            ? "bg-red-500 text-white"
                            : "bg-white text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                      <Heart
                        className="h-5 w-5"
                        fill={isFav ? "white" : "transparent"}
                      />
                    </button>
                  </div>

                  {/* Información */}
                  <div className="p-4">
                    <h2 className="text-lg font-semibold text-gray-900">{p.name}</h2>
                    <p className="text-sm text-gray-500">Código: {p.codigo}</p>

                    <p className="text-blue-600 font-bold mt-3 text-xl">${p.price}</p>

                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={() => verProducto(p._id)}
                        className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
                      >
                        Ver producto
                      </button>

                      <button
                        onClick={() => agregarAlCarrito(p._id)}
                        disabled={loadingId === p._id}
                        className={`flex-1 py-2 rounded-lg text-white transition 
                          ${
                            loadingId === p._id
                              ? "bg-blue-300"
                              : "bg-blue-600 hover:bg-blue-700"
                          }`}
                      >
                        {loadingId === p._id ? "Agregando..." : "Agregar"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL REUTILIZADO */}
      {modalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-5xl w-full relative shadow-xl">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl"
            >
              ✖
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Miniaturas */}
              <div className="flex gap-4">
                <div className="flex flex-col gap-3 w-24">
                  {selectedProduct.image.slice(0, 5).map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      onClick={() => setSelectedImg(img)}
                      className={`w-24 h-24 rounded-xl object-cover cursor-pointer border ${
                        selectedImg === img
                          ? "border-blue-500"
                          : "border-gray-200"
                      }`}
                    />
                  ))}
                </div>

                <div className="flex-1">
                  <img
                    src={selectedImg}
                    className="w-full h-[400px] rounded-xl object-contain bg-gray-50 p-4 border"
                  />
                </div>
              </div>

              {/* Información producto */}
              <div>
                <h2 className="text-3xl font-bold text-gray-800">
                  {selectedProduct.name}
                </h2>

                <p className="text-gray-500 mt-1">Marca: {selectedProduct.brand}</p>
                <p className="text-gray-500">Precio: {selectedProduct.price}</p>
                <p className="text-gray-500 mt-2">Stock: {selectedProduct.stock}</p>

                {/* Cantidad */}
                <div className="mt-6">
                  <label className="block text-gray-700 font-medium mb-1">
                    Cantidad:
                  </label>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                      className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                      -
                    </button>

                    <input
                      type="number"
                      min="1"
                      value={cantidad}
                      onChange={(e) =>
                        setCantidad(Math.max(1, Number(e.target.value)))
                      }
                      className="w-20 text-center border rounded-lg py-2"
                    />

                    <button
                      onClick={() => setCantidad(cantidad + 1)}
                      className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Agregar */}
                <button
                  onClick={() =>
                    agregarAlCarrito(selectedProduct._id, cantidad)
                  }
                  className="w-full mt-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition text-lg"
                >
                  Agregar al carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
