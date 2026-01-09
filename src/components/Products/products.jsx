import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { Heart, Truck } from "lucide-react";
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

  };

  // AGREGAR AL CARRITO (con cantidad)
 const agregarAlCarrito = async (productId, quantity = 1) => {
  // 1. Verificar si el usuario está logueado
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Debes iniciar sesión para agregar productos al carrito 🔑");
    // Opcional: Redirigir al login si tienes acceso a navigate
    // navigate("/login"); 
    return; // Detiene la ejecución aquí
  }

  try {
    setLoadingId(productId);
    await api.post("/user/car", { productId, quantity });

    // Notifica a la pestaña actual
    window.dispatchEvent(new Event("cartUpdated"));

    // Notifica a OTRAS pestañas
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
  // 1. Verificar si el usuario está logueado
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Debes iniciar sesión para guardar favoritos ❤️");
    return; // Detiene la ejecución
  }

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
    <div className="min-h-screen bg-gray-100 dark:bg-[#020617] py-6">

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
            className="
              group
              bg-white dark:bg-gray-900
              rounded-2xl
              shadow-sm dark:shadow-none
              border border-gray-100 dark:border-gray-800
              hover:shadow-xl hover:-translate-y-1
              transition-all duration-300
              overflow-hidden
            "
          >
            {/* IMAGEN */}
            <div className="relative aspect-square bg-gray-50 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
              
              {/* DESCUENTO */}
              {p.hasDiscount && (
                <span className="absolute top-3 left-3 bg-red-600 text-white text-[11px] font-black px-3 py-1 rounded-full shadow-lg z-10">
                  {p.discount.type === "percentage"
                    ? `-${p.discount.value}%`
                    : `-$${p.discount.value}`}
                </span>
              )}

              <img
                src={p.image?.[0]?.url || p.image?.[1]?.url}
                alt={p.name}
                className="
                  h-full w-full object-contain p-4
                  transition-transform duration-500
                  group-hover:scale-110
                  dark:brightness-95
                "
              />

              {/* FAVORITO */}
              <button
                onClick={() => handleToggleFavorite(p)}
                disabled={loadingId === p._id}
                className={`
                  absolute top-3 right-3
                  rounded-full p-2.5
                  shadow-md transition-all
                  backdrop-blur
                  ${
                    favorites.some((f) => f._id === p._id)
                      ? "bg-red-500 text-white scale-110 shadow-red-300/40"
                      : "bg-white/90 dark:bg-gray-900/80 text-gray-600 dark:text-gray-300 hover:text-red-500"
                  }
                `}
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
            <div className="p-5 dark:bg-[#020617]">
              <h2 className="text-base font-bold text-gray-800 dark:text-gray-100 line-clamp-1">
                {p.name}
              </h2>

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Marca: {p.brand}
              </p>

              {/* PRECIO */}
              <div className="flex items-center justify-between mt-4">
                {p.hasDiscount ? (
                  <div className="flex flex-col">
                    <span className="text-sm line-through text-gray-400">
                      ${p.price}
                    </span>
                    <span className="text-xl font-black text-red-600">
                      ${p.finalPrice}
                    </span>
                  </div>
                ) : (
                  <span className="text-xl font-black text-slate-900 dark:text-white">
                    ${p.price}
                  </span>
                )}

                <span
                  className={`text-[10px] px-2 py-1 rounded-full font-bold
                    ${
                      p.stock > 0
                        ? "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                    }
                  `}
                >
                  {p.stock > 0 ? `STOCK: ${p.stock}` : "SIN STOCK"}hola
                </span>
              </div>
              {/* ENVÍO */}
<div className="mt-3">
  {p.shippingPolicy?.trim().toLowerCase() === "free" ? (
    <span className="flex items-center gap-1 text-[11px] font-bold text-green-600 dark:text-green-400">
      <Truck size={13} /> Envío Gratis
    </span>
  ) : (
    <span className="flex items-center gap-1 text-[11px] font-medium text-gray-500 dark:text-gray-400 italic">
      <Truck size={13} /> Envío a coordinar
    </span>
  )}

  {p.shippingNote && (
    <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
      {p.shippingNote}
    </p>
  )}
</div>


              {/* BOTONES */}
              <div className="mt-5 flex gap-2">
                <button
                  onClick={() => verProducto(p._id)}
                  className="
                    flex-1
                    bg-slate-100 dark:bg-gray-800
                    text-slate-700 dark:text-gray-200
                    py-2.5 rounded-xl
                    text-xs font-bold
                    hover:bg-slate-200 dark:hover:bg-gray-700
                    transition
                  "
                >
                  Ver producto
                </button>

                <button
                  onClick={() => agregarAlCarrito(p._id, 1)}
                  disabled={loadingId === p._id || p.stock <= 0}
                  className={`
                    flex-1 py-2.5 rounded-xl text-xs font-bold
                    text-white transition-all
                    ${
                      loadingId === p._id
                        ? "bg-blue-300 dark:bg-blue-500/50"
                        : "bg-blue-600 hover:bg-blue-500 active:scale-[0.97]"
                    }
                  `}
                >
                  {loadingId === p._id ? "Agregando..." : "Comprar"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINACIÓN (NO TOCADA) */}
      <div className="flex flex-wrap justify-center items-center mt-10 gap-2 px-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-2 rounded-xl border text-sm transition-all ${
            currentPage === 1
              ? "text-gray-300 bg-gray-50 border-gray-100"
              : "bg-white text-gray-700 hover:bg-gray-100 border-gray-200 shadow-sm"
          }`}
        >
          ←
        </button>

        {[...Array(totalPages)].map((_, i) => {
          const page = i + 1;
          return (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-9 h-9 rounded-xl border text-sm font-bold transition-all ${
                currentPage === page
                  ? "bg-blue-600 text-white border-blue-600 scale-105"
                  : "bg-white text-gray-600 border-gray-200 hover:border-blue-400"
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-2 rounded-xl border text-sm transition-all ${
            currentPage === totalPages
              ? "text-gray-300 bg-gray-50 border-gray-100"
              : "bg-white text-gray-700 hover:bg-gray-100 border-gray-200 shadow-sm"
          }`}
        >
          →
        </button>
      </div>
    </>
  )}
</div>


      {/* MODAL AJUSTADO (MANTENIDO ÍNTEGRO) */}
      {modalOpen && selectedProduct && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#020617] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden relative flex flex-col max-h-[85vh]">

            {/* HEADER */}
            <div className="flex items-center justify-between px-5 py-3 border-b bg-gray-50/50 dark:bg-gray-900 dark:border-gray-800">
              <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 truncate pr-6">
                {selectedProduct.name}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-black dark:hover:text-white transition-colors"
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
                    <div className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl h-48 flex items-center justify-center">
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
                          className={`h-12 w-12 min-w-[3rem] rounded-lg object-cover cursor-pointer border-2 transition-all
                      ${selectedImg === img.url
                              ? "border-blue-500"
                              : "border-transparent opacity-70"
                            }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* INFO PRODUCTO */}
                  <div className="flex flex-col">
                    <div className="mb-2">
                      <h2 className="text-lg font-black text-gray-900 dark:text-gray-100 leading-tight">
                        {selectedProduct.name}
                      </h2>

                      <div className="flex items-center gap-1 mt-1 scale-90 origin-left">
                        {selectedProduct.rating?.count > 0 ? (
                          <>
                            <span className="text-[10px] font-semibold text-gray-700 dark:text-gray-400">
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

                   {/* PRECIOS */}
{selectedProduct.hasDiscount && selectedProduct.discount ? (
  <div className="mb-3">
    <p className="text-sm line-through text-gray-400">
      ${selectedProduct.price}
    </p>

    <p className="text-2xl font-black text-red-600">
      ${selectedProduct.finalPrice}
    </p>

    <p className="text-[11px] text-green-600 font-semibold mt-1">
      Oferta válida del{" "}
      {new Date(selectedProduct.discount.startDate).toLocaleDateString()}{" "}
      al{" "}
      {new Date(selectedProduct.discount.endDate).toLocaleDateString()}
    </p>
  </div>
) : (
  <p className="text-xl font-black text-blue-600 mb-3">
    ${selectedProduct.price}
  </p>
)}


                    <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-400 mb-5">
                      <p>
                        Marca: <span className="font-semibold">{selectedProduct.brand}</span>
                      </p>

                      {selectedProduct.description && (
                        <div className="mt-3 text-xs leading-relaxed">
                          <p className="font-bold text-gray-900 dark:text-gray-100 mb-1">
                            Descripción
                          </p>
                          <p>{selectedProduct.description}</p>
                        </div>
                      )}

                      <p>
                        Vendido por:{" "}
                        <span className="font-bold uppercase text-blue-700">
                          {selectedProduct?.vendedor?.storeName}
                        </span>
                      </p>

                      {selectedProduct.size?.length > 0 && (
                        <div className="mt-4">
                          <p className="text-xs font-bold text-gray-900 dark:text-gray-100 mb-2">
                            Tallas disponibles
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {selectedProduct.size.map((talla, i) => (
                              <span
                                key={i}
                                className="px-3 py-1 text-xs font-semibold border rounded-lg
                                     bg-gray-50 dark:bg-gray-900
                                     border-gray-200 dark:border-gray-700
                                     text-gray-700 dark:text-gray-300"
                              >
                                {talla}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <p>
                        Stock:{" "}
                        <span className="font-semibold text-green-600">
                          {selectedProduct.stock}
                        </span>
                      </p>
                    </div>
{/* 🚚 ENVÍO */}
<div className="mb-4">
  {selectedProduct.shippingPolicy?.trim().toLowerCase() === "free" ? (
    <div className="inline-flex items-center gap-1.5 
                    text-xs font-bold text-green-600 
                    bg-green-50 dark:bg-green-900/20 
                    px-3 py-1 rounded-full">
      🚚 Envío gratis
    </div>
  ) : (
    <div className="inline-flex items-center gap-1.5 
                    text-xs font-medium text-gray-500 
                    bg-gray-100 dark:bg-gray-800 
                    px-3 py-1 rounded-full italic">
      🚚 Envío a coordinar con el vendedor
    </div>
  )}

  {selectedProduct.shippingNote && (
    <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
      {selectedProduct.shippingNote}
    </p>
  )}
</div>

                    <div className="mt-auto space-y-2">
                      <div className="flex items-center justify-between
                                bg-gray-50 dark:bg-gray-900
                                px-3 py-1.5 rounded-lg
                                border border-gray-100 dark:border-gray-800">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">
                          Cantidad
                        </span>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                            className="w-6 h-6 flex items-center justify-center rounded
                                 bg-white dark:bg-gray-800
                                 border border-gray-200 dark:border-gray-700
                                 text-xs shadow-sm
                                 hover:bg-gray-50 dark:hover:bg-gray-700
                                 text-gray-800 dark:text-gray-200"
                          >
                            −
                          </button>
                          <span className="text-xs font-bold text-gray-900 dark:text-gray-100">
                            {cantidad}
                          </span>
                          <button
                            onClick={() => setCantidad(cantidad + 1)}
                            className="w-6 h-6 flex items-center justify-center rounded
                                 bg-white dark:bg-gray-800
                                 border border-gray-200 dark:border-gray-700
                                 text-xs shadow-sm
                                 hover:bg-gray-50 dark:hover:bg-gray-700
                                 text-gray-800 dark:text-gray-200"
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
                <div className="border-t border-gray-50 dark:border-gray-800 pt-5 space-y-6">
                  <section>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3">
                      Opiniones
                    </h4>
                    <div className="scale-95 origin-top-left">
                      <ProductReviews productId={selectedProduct._id} />
                    </div>
                  </section>

                  <section>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3">
                      Preguntas
                    </h4>
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