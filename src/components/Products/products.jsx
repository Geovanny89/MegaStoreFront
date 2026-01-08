import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { Heart } from "lucide-react";
import { useFavorites } from "../../context/FavoriteContext";
import ProductQuestions from "../../components/Questions/ProductQuestions";
import RatingStars from "../Ratings/RatingStars";
import ProductReviews from "../User/Calificaciones/ProductReviews";

// --- FUNCIÓN DE ALEATORIZACIÓN (Fuera del componente para evitar recreaciones) ---
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

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

        // ALEATORIZACIÓN: Mezclamos todos los productos recibidos
        const productosMezclados = shuffleArray(res.data);

        setProductos(productosMezclados);
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

      // 1. Notifica a la pestaña actual
      window.dispatchEvent(new Event("cartUpdated"));

      // 2. Notifica a OTRAS pestañas
      localStorage.setItem("cartTimestamp", Date.now().toString());

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
                      Stocks: {p.stock}
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

      {/* MODAL AJUSTADO (MANTENIDO ÍNTEGRO) */}
      {modalOpen && selectedProduct && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden relative flex flex-col max-h-[85vh]">

            {/* HEADER */}
            <div className="flex items-center justify-between px-5 py-3 border-b bg-gray-50/50">
              <h3 className="text-sm font-bold text-gray-800 truncate pr-6">
                {selectedProduct.name}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-black transition-colors"
              >
                <span className="text-xl">✕</span>
              </button>
            </div>

            {/* CUERPO */}
            <div className="overflow-y-auto overflow-x-hidden">
              <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                  {/* IMÁGENES */}
                  <div className="space-y-3">
                    <div className="bg-gray-50 border border-gray-100 rounded-xl h-48 flex items-center justify-center">
                      <img
                        src={selectedImg}
                        alt={selectedProduct.name}
                        className="object-contain max-h-full p-2"
                      />
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {selectedProduct.image.slice(0, 4).map((img, i) => (
                        <img
                          key={i}
                          src={img.url}
                          onClick={() => setSelectedImg(img.url)}
                          className={`h-12 w-12 min-w-[3rem] rounded-lg object-cover cursor-pointer border-2 transition-all ${selectedImg === img.url ? "border-blue-500" : "border-transparent opacity-70"
                            }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* INFO PRODUCTO */}
                  <div className="flex flex-col">
                    <div className="mb-2">

                      <h2 className="text-lg font-black text-gray-900 leading-tight">
                        {selectedProduct.name}
                      </h2>
                      <div className="flex items-center gap-1 mt-1 scale-90 origin-left">
                        {selectedProduct.rating?.count > 0 ? (
                          <>
                            <span className="text-[10px] font-semibold text-gray-700">
                              Calificación
                            </span>
                            <RatingStars
                              value={selectedProduct.rating.average}
                              count={selectedProduct.rating.count}
                              size="text-[10px]"
                            />
                          </>
                        ) : (
                          <span className="text-[10px] text-blue-600 font-semibold">
                            Compra y sé el primero en calificar
                          </span>
                        )}
                      </div>

                    </div>

                    <p className="text-xl font-black text-blue-600 mb-3">
                      ${selectedProduct.price}
                    </p>

                    <div className="space-y-1.5 text-xs text-gray-600 mb-5">
                      <p>Marca: <span className="font-semibold">{selectedProduct.brand}</span></p>
                      {selectedProduct.description && (
                        <div className="mt-3 text-xs text-gray-700 leading-relaxed">
                          <p className="font-bold text-gray-900 mb-1">Descripción</p>
                          <p>{selectedProduct.description}</p>
                        </div>
                      )}

                      <p className="flex items-center gap-1">
                        Vendido por: <span className="font-bold uppercase text-blue-700">{selectedProduct?.vendedor?.storeName}</span>
                        {selectedProduct.size?.length > 0 && (
                          <div className="mt-4">
                            <p className="text-xs font-bold text-gray-900 mb-2">Tallas disponibles</p>
                            <div className="flex flex-wrap gap-2">
                              {selectedProduct.size.map((talla, i) => (
                                <span
                                  key={i}
                                  className="px-3 py-1 text-xs font-semibold border rounded-lg bg-gray-50"
                                >
                                  {talla}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                      </p>
                      <p>Stock: <span className="font-semibold text-green-600">{selectedProduct.stock}</span></p>
                    </div>

                    <div className="mt-auto space-y-2">
                      <div className="flex items-center justify-between bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Cantidad</span>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                            className="w-6 h-6 flex items-center justify-center rounded bg-white border text-xs shadow-sm hover:bg-gray-50"
                          >
                            −
                          </button>
                          <span className="text-xs font-bold">{cantidad}</span>
                          <button
                            onClick={() => setCantidad(cantidad + 1)}
                            className="w-6 h-6 flex items-center justify-center rounded bg-white border text-xs shadow-sm hover:bg-gray-50"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => agregarAlCarrito(selectedProduct._id, cantidad)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-bold shadow-md transition-transform active:scale-95"
                      >
                        Agregar al carrito
                      </button>
                    </div>
                  </div>
                  
                </div>

                {/* SECCIONES EXTRA */}
                <div className="border-t border-gray-50 pt-5 space-y-6">
                  <section>
                    <h4 className="text-sm font-bold text-gray-900 mb-3">Opiniones</h4>
                    <div className="scale-95 origin-top-left">
                      <ProductReviews productId={selectedProduct._id} />
                    </div>
                  </section>

                  <section>
                    <h4 className="text-sm font-bold text-gray-900 mb-3">Preguntas</h4>
                    <div className="scale-95 origin-top-left">
                      <ProductQuestions productId={selectedProduct._id} />
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}