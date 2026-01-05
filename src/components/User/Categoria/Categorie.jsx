import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../../api/axios";
import { Heart } from "lucide-react";
import { useFavorites } from "../../../context/FavoriteContext";
import ProductQuestions from "../../Questions/ProductQuestions";
import ProductReviews from "../Calificaciones/ProductReviews";
import RatingStars from "../../Ratings/RatingStars";

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

    // 🔔 AVISAR AL NAVBAR
    window.dispatchEvent(new Event("cartUpdated"));

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
        setSelectedImg(res.data.image[0].url);
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
                        src={p.image?.[1]?.url || p.image?.[0]?.url}
                        alt={p.name}
                      />

                    </div>

                    <button
                      onClick={() => handleToggleFavorite(p)}
                      disabled={loadingId === p._id}
                      className={`absolute top-3 right-3 rounded-full p-2 shadow transition 
                        ${isFav
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
                          ${loadingId === p._id
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
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden">

            {/* HEADER */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="text-base font-semibold text-gray-800 truncate">
                {selectedProduct.name}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-black text-lg"
              >
                ✖
              </button>
            </div>

            {/* CUERPO */}
            <div className="max-h-[80vh] overflow-y-auto">

              {/* PRODUCTO */}
              <div className="p-4 border-b">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* IMÁGENES */}
                  <div>
                    <div className="bg-gray-50 border rounded-lg h-[320px] flex items-center justify-center">
                      <img
                        src={selectedImg}
                        alt={selectedProduct.name}
                        className="object-contain max-h-full"
                      />
                    </div>

                    <div className="grid grid-cols-4 gap-2 mt-3">
                      {selectedProduct.image.slice(0, 4).map((img, i) => (
                        <img
                          key={i}
                          src={img.url}
                          onClick={() => setSelectedImg(img.url)}
                        />
                      ))}

                    </div>
                  </div>

                  {/* INFO */}
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {selectedProduct.name}
                    </h2>

                    <div className="mt-1">Calificación
                      {selectedProduct.rating?.count > 0 ? (
                        <RatingStars
                          value={selectedProduct.rating.average}
                          count={selectedProduct.rating.count}
                          size="text-base"
                        />
                      ) : (
                        <p className="text-xs text-gray-400">
                          Sin calificaciones
                        </p>
                      )}
                    </div>

                    <p className="text-2xl font-bold text-blue-600 mt-3">Precio: $
                      {selectedProduct.price}
                    </p>

                    <div className="mt-3 text-sm text-gray-600 space-y-1">
                      <p>Marca: <span className="font-medium">{selectedProduct.brand}</span></p>

                      <p className="flex items-center gap-2">
                        Vendido por{" "}
                        <span className="font-bold uppercase">
                          {selectedProduct?.vendedor?.storeName}
                        </span>
                        {selectedProduct?.vendedor?.sellerRating?.count > 0 && (
                          <RatingStars
                            value={selectedProduct.vendedor.sellerRating.average}
                            count={selectedProduct.vendedor.sellerRating.count}
                            size="text-xs"
                          />
                        )}
                      </p>

                      <p>
                        Stock:{" "}
                        <span className="font-semibold">
                          {selectedProduct.stock}
                        </span>
                      </p>
                    </div>

                    {/* CANTIDAD */}
                    <div className="mt-4">
                      <label className="text-sm font-medium">Cantidad</label>
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                          className="w-9 h-9 rounded bg-gray-200"
                        >
                          −
                        </button>

                        <input
                          type="number"
                          value={cantidad}
                          min="1"
                          onChange={(e) =>
                            setCantidad(Math.max(1, Number(e.target.value)))
                          }
                          className="w-14 text-center border rounded"
                        />

                        <button
                          onClick={() => setCantidad(cantidad + 1)}
                          className="w-9 h-9 rounded bg-gray-200"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => agregarAlCarrito(selectedProduct._id, cantidad)}
                      className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
                    >
                      Agregar al carrito
                    </button>
                  </div>
                </div>
              </div>

              {/* REVIEWS */}
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold mb-3">
                  Opiniones
                </h3>
                <ProductReviews productId={selectedProduct._id} />
              </div>

              {/* PREGUNTAS */}
              <div className="p-4">
                <ProductQuestions productId={selectedProduct._id} />
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
