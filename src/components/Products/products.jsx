import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { Heart } from "lucide-react";
import { useFavorites } from "../../context/FavoriteContext";
import ProductQuestions from "../../components/Questions/ProductQuestions";
import RatingStars from "../Ratings/RatingStars";
import ProductReviews from "../User/Calificaciones/ProductReviews";


export default function Products() {
  const [productos, setProductos] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(null);

  // PAGINACIÓN
  const [currentPage, setCurrentPage] = useState(1);
  const productosPorPagina = 8;

  // FAVORITOS CONTEXT
  const { favorites, addFavorite, removeFavorite } = useFavorites();


  // MODAL
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // IMAGEN PRINCIPAL DEL MODAL
  const [selectedImg, setSelectedImg] = useState("");

  // CANTIDAD
  const [cantidad, setCantidad] = useState(1);


  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await api.get("/user/allProducts");

        setProductos(res.data);
      } catch (error) {
        console.log(error);
        alert("No existen productos");
      }
    };
    fetchProductos();
  }, []);

  const indexLast = currentPage * productosPorPagina;
  const indexFirst = indexLast - productosPorPagina;
  const productosActuales = productos.slice(indexFirst, indexLast);
  const totalPages = Math.ceil(productos.length / productosPorPagina);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // AGREGAR AL CARRITO (con cantidad)
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
      console.log(error);
      alert("Error al cargar producto");
    } finally {
      setLoadingProduct(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-6">
        {productos.length === 0 ? (
          <p className="text-gray-500 text-lg">No hay productos disponibles.</p>
        ) : (
          <>
            {/* GRID PRODUCTOS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
              {productosActuales.map((p) => (
                <div
                  key={p._id}
                  className="bg-white rounded-2xl shadow-sm border hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <div className="relative">
                    <div className="w-full h-48 bg-gray-50 flex justify-center items-center">
                      <img
                        src={p.image?.[1]?.url || p.image?.[0]?.url}
                        alt={p.name}
                        className="h-full object-contain p-2"
                      />

                    </div>

                    {/* FAVORITO */}
                    <button
                      onClick={() => handleToggleFavorite(p)}
                      disabled={loadingId === p._id}
                      className={`absolute top-3 right-3 rounded-full p-2 shadow transition 
            ${favorites.some((f) => f._id === p._id)
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

                  <div className="p-4">
                    {/* NOMBRE */}
                    <h2 className="text-lg font-semibold text-gray-900">
                      {p.name}
                    </h2>

                    {/* MARCA */}
                    <p className="text-sm text-gray-500">Marca: {p.brand}</p>

                    {/* STOCK */}
                    <p className={`text-sm mt-1 ${p.stock > 0 ? "text-green-600" : "text-red-600"
                      }`}>
                      Stock: {p.stock}
                    </p>

                    {/* PRECIO EN COP */}
                    <p className="text-blue-600 font-bold mt-3 text-xl">
                      Precio: {p.price}
                    </p>

                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={() => verProducto(p._id)}
                        className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
                      >
                        Ver producto
                      </button>

                      <button
                        onClick={() => agregarAlCarrito(p._id, 1)}
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
              ))}
            </div>


            {/* PAGINACIÓN */}
            <div className="flex justify-center mt-10 space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg border ${currentPage === 1
                  ? "text-gray-400 bg-gray-200"
                  : "bg-white hover:bg-gray-100"
                  }`}
              >
                Anterior
              </button>

              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-lg border ${currentPage === page
                      ? "bg-blue-600 text-white"
                      : "bg-white hover:bg-gray-100"
                      }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg border ${currentPage === totalPages
                  ? "text-gray-400 bg-gray-200"
                  : "bg-white hover:bg-gray-100"
                  }`}
              >
                Siguiente
              </button>
            </div>
          </>
        )}
      </div>

      {/* MODAL PROFESIONAL */}
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