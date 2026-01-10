import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../api/axios";
import { Heart } from "lucide-react";
import { useFavorites } from "../../../context/FavoriteContext";
import ProductQuestions from "../../Questions/ProductQuestions";
import RatingStars from "../../Ratings/RatingStars";
import ProductReviews from "../Calificaciones/ProductReviews";
import { formatPriceCOP } from "../../../utils/FomatoPrice";

export default function BuscarProducto() {
  const { name } = useParams();

  const [productos, setProductos] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(null);

  // FAVORITOS
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  // MODAL
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImg, setSelectedImg] = useState("");
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await api.get(`/user/product/${name}`);
        setProductos(res.data || []);
      } catch (error) {
        console.error(error);
        setProductos([]);
      }
    };

    fetchProductos();
  }, [name]);

  // AGREGAR AL CARRITO
  const agregarAlCarrito = async (productId, quantity = 1) => {
    try {
      setLoadingId(productId);
      await api.post("/user/car", { productId, quantity });
      window.dispatchEvent(new Event("cartUpdated"));
      alert("Producto agregado al carrito ✔");
    } catch (error) {
      console.error(error);
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
      console.error(error);
      alert("Error al cargar producto");
    } finally {
      setLoadingProduct(null);
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-2xl font-semibold mb-6">
          Resultados para: <span className="font-bold">{name}</span>
        </h2>

        {productos.length === 0 ? (
          <p className="text-gray-500">No se encontraron productos.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
            {productos.map((p) => (
              <div
                key={p._id}
                className="bg-white rounded-2xl shadow-sm border hover:shadow-lg transition overflow-hidden"
              >
                {/* IMAGEN + FAVORITO */}
                <div className="relative">
                  <div className="w-full h-48 bg-gray-50 flex justify-center items-center">
                    <img
                      src={p.image?.[1]?.url || p.image?.[0]?.url}
                      alt={p.name}
                      className="h-full object-contain p-2"
                    />
                  </div>

                  <button
                    onClick={() => handleToggleFavorite(p)}
                    disabled={loadingId === p._id}
                    className={`absolute top-3 right-3 rounded-full p-2 shadow transition
                      ${
                        favorites.some((f) => f._id === p._id)
                          ? "bg-red-500 text-white"
                          : "bg-white text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    <Heart
                      className="h-5 w-5"
                      fill={
                        favorites.some((f) => f._id === p._id)
                          ? "white"
                          : "transparent"
                      }
                    />
                  </button>
                </div>

                {/* INFO */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{p.name}</h3>
                  <p className="text-sm text-gray-500">Marca: {p.brand}</p>

                  <p className={`text-sm mt-1 ${p.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                    Stock: {p.stock}
                  </p>

                  <p className="text-blue-600 font-bold mt-3 text-xl">
                    Precio: ${p.price}
                  </p>

                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => verProducto(p._id)}
                      disabled={loadingProduct === p._id}
                      className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
                    >
                      Ver producto
                    </button>

                    <button
                      onClick={() => agregarAlCarrito(p._id, 1)}
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
            ))}
          </div>
        )}
      </div>

      {/* MODAL PRODUCTO */}
      {modalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden">

            <div className="flex justify-between items-center px-4 py-3 border-b">
              <h3 className="font-semibold truncate">{selectedProduct.name}</h3>
              <button onClick={() => setModalOpen(false)}>✖</button>
            </div>

            <div className="max-h-[80vh] overflow-y-auto">
              <div className="p-4 border-b grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* IMÁGENES */}
                <div>
                  <div className="bg-gray-50 border rounded-lg h-[320px] flex items-center justify-center">
                    <img src={selectedImg} className="object-contain max-h-full" />
                  </div>

                  <div className="grid grid-cols-4 gap-2 mt-3">
                    {selectedProduct.image.slice(0, 4).map((img, i) => (
                      <img
                        key={i}
                        src={img.url}
                        onClick={() => setSelectedImg(img.url)}
                        className={`h-16 rounded-md object-cover cursor-pointer border ${
                          selectedImg === img.url
                            ? "border-blue-500 ring-2 ring-blue-500"
                            : "border-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* INFO */}
                <div>
                  <h2 className="text-xl font-bold">{selectedProduct.name}</h2>

                  {selectedProduct.rating?.count > 0 ? (
                    <RatingStars
                      value={selectedProduct.rating.average}
                      count={selectedProduct.rating.count}
                    />
                  ) : (
                    <p className="text-xs text-gray-400">Sin calificaciones</p>
                  )}

                  <p className="text-2xl font-bold text-blue-600 mt-3">
                    ${formatPriceCOP(selectedProduct.price)}
                  </p>

                  <p className="mt-2">Marca: {selectedProduct.brand}</p>
                  <p>Stock: {selectedProduct.stock}</p>

                  {/* CANTIDAD */}
                  <div className="mt-4">
                    <label>Cantidad</label>
                    <div className="flex items-center gap-2 mt-1">
                      <button onClick={() => setCantidad(Math.max(1, cantidad - 1))}>−</button>
                      <input
                        type="number"
                        value={cantidad}
                        min="1"
                        onChange={(e) => setCantidad(Math.max(1, Number(e.target.value)))}
                        className="w-14 text-center border rounded"
                      />
                      <button onClick={() => setCantidad(cantidad + 1)}>+</button>
                    </div>
                  </div>

                  <button
                    onClick={() => agregarAlCarrito(selectedProduct._id, cantidad)}
                    className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                  >
                    Agregar al carrito
                  </button>
                </div>
              </div>

              <div className="p-4 border-b">
                <ProductReviews productId={selectedProduct._id} />
              </div>

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
