import React, { useEffect, useState } from "react";
import api from "../../../api/axios";
import {
  Heart, ShoppingCart, X, Star, MessageCircle,
  ChevronLeft, ChevronRight, ShieldCheck, Info
} from "lucide-react";
import { useFavorites } from "../../../context/FavoriteContext";
import { useParams, useNavigate } from "react-router-dom";
import ProductQuestions from "../../Questions/ProductQuestions";
import RatingStars from "../../Ratings/RatingStars";
import ProductReviews from "../Calificaciones/ProductReviews";

export default function Productosvendedor({ vendedorId: propVendedorId, search }) {
  const { vendedorId: paramVendedorId } = useParams();

  // Usamos el ID que venga por props, si no hay, usamos el de la URL
  const activeVendedorId = propVendedorId || paramVendedorId;

  const [vendedor, setVendedor] = useState(null);
  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [loadingId, setLoadingId] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const productosPorPagina = 8;
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImg, setSelectedImg] = useState("");
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    const fetchVendedor = async () => {
      if (!activeVendedorId) return;
      try {
        const { data } = await api.get(`/vendedor/${activeVendedorId}`);
        setVendedor(data.vendedor);
        setProductos(data.productos || []);
      } catch (error) {
        console.error("Error al cargar la tienda", error);
      }
    };
    fetchVendedor();
  }, [activeVendedorId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, categoriaFiltro]);

  const categorias = [...new Set(productos.map((p) => p.tipo?.name).filter(Boolean))];

  const productosFiltrados = categoriaFiltro
    ? productos.filter((p) => p.tipo?.name === categoriaFiltro)
    : productos;
  const productosBuscados = search
    ? productosFiltrados.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase())
    )
    : productosFiltrados;

  const indexLast = currentPage * productosPorPagina;
  const indexFirst = indexLast - productosPorPagina;
  const productosActuales = productosBuscados.slice(indexFirst, indexLast);
  const totalPages = Math.ceil(productosBuscados.length / productosPorPagina);

  const handlePageChange = (page) => {
  if (page < 1 || page > totalPages) return;
  setCurrentPage(page);
  
  // 2. En lugar de ir al top 0, vamos a donde empieza nuestra sección
  if (productosSectionRef.current) {
    productosSectionRef.current.scrollIntoView({ 
      behavior: "smooth", 
      block: "start" 
    });
  }
};

  const checkAuth = (action) => {
    if (!localStorage.getItem("token")) {
      alert(`Inicia sesión para ${action}`);
      return false;
    }
    return true;
  };

  const agregarAlCarrito = async (productId, quantity = 1) => {
    if (!checkAuth("comprar")) return;
    try {
      setLoadingId(productId);
      await api.post("/user/car", { productId, quantity });
      window.dispatchEvent(new Event("cartUpdated"));
      alert("Producto agregado al carrito ✔");
    } catch (error) { alert("Error al agregar al carrito"); }
    finally { setLoadingId(null); }
  };

  const handleToggleFavorite = async (product) => {
    if (!checkAuth("usar favoritos")) return;
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
    } catch (e) { alert("Error en favoritos"); }
    finally { setLoadingId(null); }
  };

  const verProducto = async (id) => {
    try {
      setLoadingProduct(id);
      const res = await api.get(`/product/${id}`);
      const prod = res.data;
      setSelectedProduct(prod);
      if (prod.image && prod.image.length > 0) {
        setSelectedImg(prod.image[0].url);
      } else {
        setSelectedImg("");
      }
      setCantidad(1);
      setModalOpen(true);
    } catch (error) { alert("Error al cargar detalle"); }
    finally { setLoadingProduct(null); }
  };

  if (!vendedor) return (
    <div className="flex justify-center items-center h-screen animate-pulse text-gray-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-950">
      Cargando...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-transparent pb-10 font-sans overflow-x-hidden transition-colors">

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {productosBuscados.length === 0 && (
          <div className="col-span-full text-center py-20 text-gray-400 dark:text-slate-500">
            <p className="text-sm font-bold uppercase">
              No se encontraron productos
              {search && ` para "${search}"`}
            </p>
          </div>
        )}

        {productosActuales.map((p) => (
          <div key={p._id} className="group flex flex-col bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-[1.8rem] md:rounded-[2.5rem] p-3 md:p-4 hover:shadow-xl dark:hover:shadow-blue-900/10 transition-all duration-300">

            <div className="relative aspect-square bg-[#fcfcfc] dark:bg-slate-800/50 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden mb-4">
              {p.hasDiscount && (
                <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-full shadow-lg z-10">
                  {p.discount?.type === "percentage" ? `-${p.discount.value}%` : `-$${p.discount.value}`}
                </span>
              )}

              <img
                src={p.image?.[0]?.url || "https://via.placeholder.com/300?text=Sin+Imagen"}
                className="w-full h-full object-contain p-4 md:p-6 group-hover:scale-105 transition-transform"
                alt={p.name}
              />

              <button
                onClick={() => handleToggleFavorite(p)}
                className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-xl shadow-sm text-gray-400"
              >
                <Heart size={16} fill={favorites.some((f) => f._id === p._id) ? "#ef4444" : "none"} className={favorites.some((f) => f._id === p._id) ? "text-red-500" : ""} />
              </button>
            </div>

            <div className="px-1 pb-1 flex-1 flex flex-col">
              <p className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">{p.tipo?.name || 'PRODUCTO'}</p>
              <h3 className="text-sm md:text-base font-black text-slate-800 dark:text-slate-100 line-clamp-1 mb-1 uppercase tracking-tight">{p.name}</h3>

              <div className="mt-auto flex items-center justify-between mb-4">
                {p.hasDiscount ? (
                  <div className="flex flex-col">
                    <span className="text-[10px] line-through text-gray-400 dark:text-slate-500 leading-none">${p.price}</span>
                    <span className="text-xl md:text-2xl font-black text-red-600 dark:text-red-500">${p.finalPrice}</span>
                  </div>
                ) : (
                  <span className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">${p.price}</span>
                )}

                <div className={`px-2 py-0.5 rounded-md text-[8px] font-black ${p.stock > 0 ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400" : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"}`}>
                  STOCK: {p.stock}
                </div>
              </div>

              <div className="mb-2 flex items-center gap-2">
                {p.shippingPolicy === "free" ? (
                  <span className="flex items-center gap-1 text-[10px] font-black text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full uppercase">
                    <ShieldCheck size={10} /> Envío Gratis
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full uppercase">
                    Envío a coordinar
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => verProducto(p._id)}
                  className="flex-1 bg-gray-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 py-2.5 rounded-xl text-[9px] font-black uppercase flex items-center justify-center gap-1 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <Info size={12} /> Detalles
                </button>
                <button
                  onClick={() => agregarAlCarrito(p._id, 1)}
                  disabled={p.stock <= 0}
                  className="flex-[1.5] bg-blue-600 dark:bg-blue-700 text-white py-2.5 rounded-xl text-[9px] font-black uppercase flex items-center justify-center gap-1 shadow-lg shadow-blue-100 dark:shadow-none disabled:bg-gray-300 dark:disabled:bg-slate-700 transition-all active:scale-95"
                >
                  <ShoppingCart size={12} /> Comprar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- CONTROLES DE PAGINACIÓN --- */}
     {/* --- CONTROLES DE PAGINACIÓN --- */}
      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center items-center mt-12 mb-6 gap-2 px-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-600 dark:text-slate-400 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all active:scale-90"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex flex-wrap justify-center gap-1">
            {[...Array(totalPages)].map((_, i) => {
              const pageNumber = i + 1;
              
              // Lógica para que no se desborde si hay demasiadas páginas (ej. 100 páginas)
              // Muestra la primera, la última y las 2 alrededor de la actual
              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${
                      currentPage === pageNumber
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none scale-110"
                        : "bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-500 dark:text-slate-400 hover:border-blue-300 dark:hover:border-blue-700"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              }

              // Muestra puntos suspensivos para separar los saltos
              if (
                pageNumber === currentPage - 2 ||
                pageNumber === currentPage + 2
              ) {
                return (
                  <span key={pageNumber} className="flex items-end justify-center w-6 text-gray-400 dark:text-slate-600 font-bold pb-2">
                    ...
                  </span>
                );
              }

              return null;
            })}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-600 dark:text-slate-400 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all active:scale-90"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* MODAL RESPONSIVO */}
      {modalOpen && selectedProduct && (
        <div className="fixed inset-0 z-[100] bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden relative flex flex-col max-h-[85vh] border border-white/20 dark:border-slate-800">

            {/* HEADER */}
            <div className="flex items-center justify-between px-5 py-3 border-b dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50">
              <h3 className="text-sm font-bold text-gray-800 dark:text-slate-100 truncate pr-6 uppercase">
                {selectedProduct.name}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 dark:text-slate-500 hover:text-black dark:hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* CUERPO CON SCROLL */}
            <div className="overflow-y-auto overflow-x-hidden">
              <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                  {/* SECCIÓN IMÁGENES */}
                  <div className="space-y-3">
                    <div className="bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl h-48 flex items-center justify-center overflow-hidden">
                      <img
                        src={selectedImg}
                        alt={selectedProduct.name}
                        className="object-contain max-h-full p-2"
                      />
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                      {selectedProduct.image?.slice(0, 4).map((img, i) => (
                        <img
                          key={i}
                          src={img.url}
                          onClick={() => setSelectedImg(img.url)}
                          className={`h-12 w-12 min-w-[3rem] rounded-lg object-cover cursor-pointer border-2 transition-all ${selectedImg === img.url ? "border-blue-500" : "border-transparent opacity-70 dark:border-slate-700"
                            }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* SECCIÓN INFO PRODUCTO */}
                  <div className="flex flex-col">
                    <div className="mb-2">
                      <h2 className="text-lg font-black text-gray-900 dark:text-white leading-tight uppercase">
                        {selectedProduct.name}
                      </h2>

                      <div className="flex items-center gap-1 mt-1 scale-90 origin-left">
                        {selectedProduct.rating?.count > 0 ? (
                          <>
                            <span className="text-[10px] font-semibold text-gray-700 dark:text-slate-400">Calificación</span>
                            <RatingStars
                              value={selectedProduct.rating.average}
                              count={selectedProduct.rating.count}
                              size="text-[10px]"
                            />
                          </>
                        ) : (
                          <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold italic">
                            Compra y sé el primero en calificar
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mb-3">
                      {selectedProduct.hasDiscount ? (
                        <div className="flex flex-col">
                          <span className="text-sm line-through text-gray-400 dark:text-slate-500">
                            ${selectedProduct.price}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-black text-red-600 dark:text-red-500">
                              ${selectedProduct.finalPrice}
                            </span>
                            <span className="bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase">
                              Oferta
                            </span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-2xl font-black text-blue-600 dark:text-blue-400">
                          ${selectedProduct.price}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5 text-xs text-gray-600 dark:text-slate-400 mb-5">
                      <p>Marca: <span className="font-semibold text-gray-900 dark:text-slate-200">{selectedProduct.brand || 'N/A'}</span></p>

                      {selectedProduct.description && (
                        <div className="mt-3 text-[11px] text-gray-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg border border-slate-100 dark:border-slate-700">
                          <p className="font-bold text-gray-900 dark:text-slate-100 mb-1">Descripción</p>
                          <p className="line-clamp-3 italic">"{selectedProduct.description}"</p>
                        </div>
                      )}

                      <div className="mt-4">
                        <p className="flex items-center gap-1">
                          Vendido por: <span className="font-bold uppercase text-blue-700 dark:text-blue-400">{vendedor?.storeName}</span>
                        </p>

                        {selectedProduct.size?.length > 0 && (
                          <div className="mt-3">
                            <p className="text-[10px] font-bold text-gray-900 dark:text-slate-100 mb-1.5 uppercase">Tallas disponibles</p>
                            <div className="flex flex-wrap gap-1.5">
                              {selectedProduct.size.map((talla, i) => (
                                <span key={i} className="px-2 py-0.5 text-[10px] font-semibold border dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 uppercase">
                                  {talla}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <p className="mt-2">Stock: <span className={`font-semibold ${selectedProduct.stock > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {selectedProduct.stock} unidades
                      </span></p>
                      
                      <div className="mt-4 p-3 rounded-xl border border-blue-50 dark:border-blue-900/30 bg-blue-50/30 dark:bg-blue-900/10">
                        <p className="text-[10px] font-black text-blue-800 dark:text-blue-400 uppercase mb-2 flex items-center gap-1">
                          <ShoppingCart size={12} /> Información de entrega
                        </p>

                        {selectedProduct.shippingPolicy === "free" ? (
                          <div className="flex items-start gap-2">
                            <div className="bg-green-100 dark:bg-green-900/30 p-1 rounded-full">
                              <ShieldCheck size={14} className="text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-green-700 dark:text-green-400">¡Envío gratuito!</p>
                              <p className="text-[10px] text-gray-500 dark:text-slate-500 italic">Recíbelo sin costos adicionales.</p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start gap-2">
                            <div className="bg-amber-100 dark:bg-amber-900/30 p-1 rounded-full">
                              <MessageCircle size={14} className="text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-amber-700 dark:text-amber-400">Envío a coordinar</p>
                              {selectedProduct.shippingNote && (
                                <p className="text-[11px] text-amber-800 dark:text-amber-300 mt-1 italic bg-white/50 dark:bg-black/20 p-1.5 rounded border border-amber-100 dark:border-amber-900/50">
                                  "{selectedProduct.shippingNote}"
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-auto space-y-2">
                      <div className="flex items-center justify-between bg-gray-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-slate-700">
                        <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase">Cantidad</span>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                            className="w-6 h-6 flex items-center justify-center rounded bg-white dark:bg-slate-700 border dark:border-slate-600 text-xs shadow-sm hover:bg-gray-50 dark:hover:bg-slate-600 transition-transform active:scale-90 text-slate-800 dark:text-white"
                          >
                            −
                          </button>
                          <span className="text-xs font-bold w-4 text-center dark:text-white">{cantidad}</span>
                          <button
                            onClick={() => setCantidad(cantidad + 1)}
                            className="w-6 h-6 flex items-center justify-center rounded bg-white dark:bg-slate-700 border dark:border-slate-600 text-xs shadow-sm hover:bg-gray-50 dark:hover:bg-slate-600 transition-transform active:scale-90 text-slate-800 dark:text-white"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => agregarAlCarrito(selectedProduct._id, cantidad)}
                        disabled={selectedProduct.stock <= 0}
                        className="w-full bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white py-2.5 rounded-xl text-sm font-bold shadow-md transition-all active:scale-[0.98] disabled:bg-gray-300 dark:disabled:bg-slate-800"
                      >
                        {selectedProduct.stock > 0 ? 'Agregar al carrito' : 'Sin stock disponible'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* SECCIONES DE RESEÑAS Y PREGUNTAS */}
                <div className="border-t border-gray-100 dark:border-slate-800 pt-5 space-y-6">
                  <section>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Opiniones del producto</h4>
                    <div className="scale-95 origin-top-left bg-gray-50/50 dark:bg-slate-800/30 rounded-xl p-4 border dark:border-slate-800">
                      <ProductReviews productId={selectedProduct._id} />
                    </div>
                  </section>

                  <section>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 px-2">Dudas y Preguntas</h4>
                    <div className="scale-95 origin-top-left px-2">
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