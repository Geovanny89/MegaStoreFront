import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { Heart, ChevronLeft, ShoppingCart, Info, Store, Truck, MessageCircle, ShieldCheck } from "lucide-react";
import { useFavorites } from "../context/FavoriteContext";
import ProductQuestions from "../components/Questions/ProductQuestions";
import RatingStars from "../components/Ratings/RatingStars";
import ProductReviews from "../components/User/Calificaciones/ProductReviews";
import { useNavigate } from "react-router-dom";

export default function ProductosTienda({ vendedorId, volver, user }) {
  const [vendedor, setVendedor] = useState(null);
  const [productos, setProductos] = useState([]);
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [tiendaVencida, setTiendaVencida] = useState(false); // Estado para manejar trial vencido
  const navigate = useNavigate();


  // Estados de Carga y UI
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedImg, setSelectedImg] = useState("");
  const [cantidad, setCantidad] = useState(1);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const productosPorPagina = 8;

  const { favorites, addFavorite, removeFavorite } = useFavorites();

  useEffect(() => {
    const fetchDatosVendedor = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/vendedor/${vendedorId}`);

        // Verificamos si el backend envió la bandera de vencida o productos vacíos
        if (data.statusTienda === "vencida") {
          setTiendaVencida(true);
          setVendedor(data.vendedor);
          setProductos([]);
        } else {
          setVendedor(data.vendedor);
          setProductos(data.productos || []);
          setTiendaVencida(false);
        }
      } catch (error) {
        console.error(error);
        // Si el backend responde con error 403, también marcamos como vencida
        if (error.response?.status === 403) {
          setTiendaVencida(true);
        } else {
          alert("Error al cargar la tienda");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDatosVendedor();
  }, [vendedorId]);

  // Lógica de Filtrado y Paginación
  const categorias = [...new Set(productos.map((p) => p.tipo?.name).filter(Boolean))];

  const productosFiltrados = categoriaFiltro
    ? productos.filter((p) => p.tipo?.name === categoriaFiltro)
    : productos;

  const indexLast = currentPage * productosPorPagina;
  const indexFirst = indexLast - productosPorPagina;
  const productosActuales = productosFiltrados.slice(indexFirst, indexLast);
  const totalPages = Math.ceil(productosFiltrados.length / productosPorPagina);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    ;
  };

  const handleToggleFavorite = async (product) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Inicia sesión para usar favoritos");
      return;
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
      alert("Error al actualizar favoritos");
    } finally {
      setLoadingId(null);
    }
  };

  const agregarAlCarrito = async (productId, quantity = 1) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Inicia sesión para comprar");
      return;
    }
    try {
      setLoadingId(productId);
      await api.post("/user/car", { productId, quantity });
      window.dispatchEvent(new Event("cartUpdated"));
      alert("Producto agregado al carrito ✔");
    } catch (error) {
      alert("Error al agregar al carrito ❌");
    } finally {
      setLoadingId(null);
    }
  };

  const verProducto = async (id) => {
    try {
      setLoadingProduct(id);
      const res = await api.get(`/product/${id}`);
      console.log("producto", res.data)
      setSelectedProduct(res.data);
      setSelectedImg(res.data.image?.[0]?.url || "");
      setCantidad(1);
      setModalOpen(true);
    } catch (error) {
      alert("Error al cargar detalle del producto");
    } finally {
      setLoadingProduct(null);
    }
  };

  // 1. Pantalla de Carga
  if (loading) return (
    <div className="flex flex-col justify-center items-center h-screen
                  bg-gray-50 dark:bg-[#020617]
                  text-gray-500 dark:text-gray-400
                  font-medium">
      <div className="w-12 h-12 border-4
                    border-blue-600 border-t-transparent
                    rounded-full animate-spin mb-4"></div>
      Cargando tienda...
    </div>
  );


  // 2. Pantalla de Tienda Inactiva (Trial Vencido)
  if (tiendaVencida) return (
    <div className="min-h-screen
                  bg-white dark:bg-[#020617]
                  flex flex-col items-center justify-center p-6">

      <div className="max-w-md text-center space-y-6">

        <div className="w-24 h-24
                      bg-amber-50 dark:bg-amber-900/30
                      text-amber-500 dark:text-amber-400
                      rounded-full flex items-center justify-center
                      mx-auto shadow-inner">
          <Store size={48} />
        </div>

        <h1 className="text-3xl font-black
                     text-gray-900 dark:text-gray-100">
          {vendedor?.storeName || "Tienda Inactiva"}
        </h1>

        <p className="text-gray-500 dark:text-gray-400
                    font-medium leading-relaxed">
          Esta tienda no cuenta con una suscripción activa en este momento.
          Sus productos estarán disponibles nuevamente una vez se renueve el plan.
        </p>

        <button
          onClick={volver}
          className="w-full bg-blue-600 text-white
                   py-4 rounded-2xl font-bold
                   hover:bg-blue-700 transition-all shadow-lg"
        >
          Explorar otras tiendas
        </button>
      </div>
    </div>
  );


  return (
    <div className="min-h-screen
                bg-gray-50/50 dark:bg-[#020617]
                pb-12">

      {/* HEADER DE TIENDA */}
      <div className="
  bg-white dark:bg-[#020617]
  border-b border-gray-200 dark:border-gray-800
  sticky top-0 z-10
  shadow-sm dark:shadow-none
">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              Filtrar:
            </span>

            <select
              className="
          bg-gray-50 dark:bg-gray-900
          border border-gray-200 dark:border-gray-700
          text-sm text-gray-800 dark:text-gray-200
          rounded-xl px-4 py-2 outline-none
          focus:ring-2 focus:ring-blue-500/20
        "
              value={categoriaFiltro}
              onChange={(e) => {
                setCategoriaFiltro(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">Todas las categorías</option>
              {categorias.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* BOTÓN IR A LA TIENDA */}
          {vendedor?.slug && (
            <button
              onClick={() =>
                navigate(`/${vendedor.slug}`, {
                  state: { from: "marketplace" }
                })
              }
              className="
          flex items-center gap-2
          bg-blue-600 hover:bg-blue-700
          text-white
          px-5 py-2 rounded-xl
          text-sm font-bold
          shadow-md shadow-blue-200/50
          dark:shadow-none
          transition-all
        "
            >
              <Store size={16} />
              Ir a la tienda
            </button>
          )}
        </div>
      </div>


      <div className="
  text-center py-20
  bg-white dark:bg-[#020617]
  rounded-3xl
  border border-dashed border-gray-200 dark:border-gray-800
  text-gray-400 dark:text-gray-500
">
        {productosFiltrados.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed text-gray-400">
            No hay productos disponibles por ahora.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {productosActuales.map((p) => (
                <div key={p._id} className="
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
                  <div className="relative aspect-square bg-gray-50 flex justify-center items-center overflow-hidden">
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
    h-full w-full
    object-contain
    p-4
    transition-transform duration-500
    group-hover:scale-110
    dark:brightness-95
  "
                    />

                    <button
                      onClick={() => handleToggleFavorite(p)}
                      disabled={loadingId === p._id}
                      className={`
    absolute top-3 right-3
    rounded-full p-2.5
    shadow-md transition-all
    backdrop-blur
    ${favorites.some((f) => f._id === p._id)
                          ? "bg-red-500 text-white scale-110 shadow-red-300/40"
                          : `
          bg-white/90 dark:bg-gray-900/80
          text-gray-600 dark:text-gray-300
          hover:text-red-500
        `
                        }
  `}
                    >

                      <Heart className="h-5 w-5" fill={favorites.some((f) => f._id === p._id) ? "white" : "transparent"} />
                    </button>
                  </div>
                  <div className="p-5 dark:bg-[#020617]">
                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">
                      {p.tipo?.name || "Producto"}
                    </span>

                    <h2 className="text-base font-bold text-gray-800 dark:text-gray-100 line-clamp-1 mt-1">
                      {p.name}
                    </h2>

                    <div className="flex items-center justify-between mt-4">
                      {p.hasDiscount ? (
                        <div className="flex flex-col">
                          <span className="text-sm line-through text-gray-400 dark:text-gray-500">
                            ${p.price}
                          </span>
                          <span className="text-xl font-black text-red-600">
                            ${p.finalPrice}
                          </span>
                        </div>
                      ) : (
                        <p className="text-xl font-black text-slate-900 dark:text-white">
                          ${p.price}
                        </p>
                      )}

                      <span
                        className={`text-[10px] px-2 py-1 rounded-full font-bold
        ${p.stock > 0
                            ? "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                          }
      `}
                      >
                        {p.stock > 0 ? `STOCK: ${p.stock}` : "SIN STOCK"}
                      </span>
                    </div>

                    <div className="mt-3">
                      <div className="mt-1 flex items-center gap-1">
                        {p.shippingPolicy?.trim().toLowerCase() === "free" ? (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-green-600 dark:text-green-400">
                            <Truck size={12} /> Envío Gratis
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[11px] font-medium text-gray-500 dark:text-gray-400 italic">
                            <Truck size={12} /> Envío a coordinar
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-5 flex gap-2">
                      <button
                        onClick={() => verProducto(p._id)}
                        disabled={loadingProduct === p._id}
                        className="
        flex-1
        bg-slate-100 dark:bg-gray-800
        text-slate-700 dark:text-gray-200
        py-2.5 rounded-xl
        text-xs font-bold
        hover:bg-slate-200 dark:hover:bg-gray-700
        transition-colors
        flex items-center justify-center gap-2
      "
                      >
                        {loadingProduct === p._id ? "..." : <><Info size={14} /> Detalles</>}
                      </button>

                      <button
                        onClick={() => agregarAlCarrito(p._id, 1)}
                        disabled={loadingId === p._id || p.stock <= 0}
                        className={`
        flex-1 py-2.5 rounded-xl text-xs font-bold
        text-white
        transition-all
        flex items-center justify-center gap-2
        ${loadingId === p._id
                            ? "bg-blue-300 dark:bg-blue-500/50"
                            : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100 dark:shadow-none"
                          }
      `}
                      >
                        {loadingId === p._id ? "..." : <><ShoppingCart size={14} /> Comprar</>}
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>

            {/* PAGINACIÓN */}
            {totalPages > 1 && (
              <div className="flex flex-wrap justify-center items-center mt-14 gap-3 px-4">
                {/* BOTÓN ANTERIOR */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-gray-200 bg-white text-gray-700 font-bold text-sm transition-all hover:bg-gray-50 active:scale-95 disabled:opacity-30 disabled:pointer-events-none shadow-sm"
                >
                  <span className="text-lg">←</span>
                  <span className="hidden sm:inline">Anterior</span>
                </button>

                {/* NÚMEROS DE PÁGINA */}
                <div className="flex flex-wrap justify-center gap-2">
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    const isActive = currentPage === pageNum;

                    return (
                      <button
                        key={i}
                        onClick={() => handlePageChange(pageNum)}
                        className={`
              w-10 h-10 sm:w-11 sm:h-11 rounded-2xl border font-bold text-sm transition-all duration-300
              ${isActive
                            ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200 scale-110 z-10"
                            : "bg-white text-gray-500 border-gray-100 hover:border-blue-300 hover:text-blue-600 shadow-sm"
                          }
            `}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                {/* BOTÓN SIGUIENTE */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-gray-200 bg-white text-gray-700 font-bold text-sm transition-all hover:bg-gray-50 active:scale-95 disabled:opacity-30 disabled:pointer-events-none shadow-sm"
                >
                  <span className="hidden sm:inline">Siguiente</span>
                  <span className="text-lg">→</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* MODAL DETALLE */}
      {/* MODAL DETALLE */}
      {modalOpen && selectedProduct && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden relative flex flex-col max-h-[85vh]">

            {/* HEADER COMPACTO */}
            <div className="flex items-center justify-between px-5 py-3 border-b bg-gray-50/50">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Detalle del Producto</span>
                <h3 className="text-sm font-bold text-gray-800 truncate max-w-[400px]">
                  {selectedProduct.name}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-black hover:bg-gray-100 transition-colors"
              >
                <span className="text-xl">✕</span>
              </button>
            </div>

            {/* CUERPO CON SCROLL */}
            <div className="overflow-y-auto overflow-x-hidden custom-scrollbar">
              <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                  {/* SECCIÓN IMÁGENES */}
                  <div className="space-y-3">
                    <div className="bg-gray-50 border border-gray-100 rounded-xl h-48 flex items-center justify-center overflow-hidden">
                      <img
                        src={selectedImg}
                        alt={selectedProduct.name}
                        className="object-contain max-h-full p-2 hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                      {selectedProduct.image?.map((imgObj, i) => (
                        <img
                          key={i}
                          src={imgObj.url}
                          onClick={() => setSelectedImg(imgObj.url)}
                          className={`h-12 w-12 min-w-[3rem] rounded-lg object-cover cursor-pointer border-2 transition-all 
                    ${selectedImg === imgObj.url ? "border-blue-500 ring-2 ring-blue-50" : "border-transparent opacity-70 hover:opacity-100"}`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* SECCIÓN INFO PRODUCTO */}
                  <div className="flex flex-col justify-between">
                    <div>
                      <h2 className="text-lg font-black text-gray-900 leading-tight mb-1">
                        {selectedProduct.name}
                      </h2>

                      {/* --- SECCIÓN DE RATINGS ACTUALIZADA --- */}
                      <div className="flex items-center gap-1 mb-2 scale-90 origin-left">
                        {selectedProduct.rating?.count > 0 ? (
                          <>
                            <span className="text-[10px] font-semibold text-gray-700">Calificación</span>
                            <RatingStars
                              value={selectedProduct.rating.average}
                              count={selectedProduct.rating.count}
                              size="text-[10px]"
                            />
                          </>
                        ) : (
                          <span className="text-[10px] text-blue-600 font-semibold italic">
                            Compra y sé el primero en calificar
                          </span>
                        )}
                      </div>
                      {/* -------------------------------------- */}

                      {selectedProduct.hasDiscount && selectedProduct.discount ? (
                        <div className="mb-3">
                          {/* Precio original */}
                          <p className="text-sm line-through text-gray-400">${selectedProduct.price}</p>

                          {/* Precio con descuento */}
                          <p className="text-2xl font-black text-red-600">${selectedProduct.finalPrice}</p>

                          {/* Mensaje de vigencia del descuento */}
                          <p className="text-[11px] text-green-700 font-semibold mt-1">
                            Oferta válida del {new Date(selectedProduct.discount.startDate).toLocaleDateString()} al {new Date(selectedProduct.discount.endDate).toLocaleDateString()}
                          </p>
                        </div>
                      ) : (
                        <p className="text-xl font-black text-blue-600 mb-3">${selectedProduct.price}</p>
                      )}

                      <div className="space-y-1.5 text-xs text-gray-600 mb-4">
                        <p>Marca: <span className="font-semibold">{selectedProduct.brand || 'N/A'}</span></p>
                        <p>Vendido por: <span className="font-bold uppercase text-blue-700">{vendedor?.storeName}</span></p>
                        <p>Stock: <span className={`font-semibold ${selectedProduct.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {selectedProduct.stock} unidades
                        </span></p>
                        <div className="mb-4">
                          <p className="text-2xl font-black text-blue-600">${selectedProduct.price}</p>
                          <div className="mt-2">
                            {selectedProduct.shippingPolicy === "free" ? (
                              <div className="flex items-center gap-1.5 text-green-700 bg-green-50 px-2 py-1 rounded-md w-fit border border-green-100">
                                <ShieldCheck size={14} />
                                <span className="text-xs font-bold uppercase">Envío Gratis</span>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <div className="flex items-center gap-1.5 text-amber-700 bg-amber-50 px-2 py-1 rounded-md w-fit border border-amber-100">
                                  <MessageCircle size={14} />
                                  <span className="text-xs font-bold uppercase">Envío a coordinar</span>
                                </div>
                                {selectedProduct.shippingNote && (
                                  <div className="bg-gray-50 border-l-2 border-amber-400 p-2 mt-1">
                                    <p className="text-[11px] text-gray-600 leading-tight">
                                      <span className="font-bold text-gray-800">Nota del vendedor: </span>
                                      "{selectedProduct.shippingNote}"
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        {selectedProduct.description && (
                          <div className="mt-3 bg-slate-50 p-3 rounded-lg border border-slate-100 text-gray-700">
                            <p className="font-bold text-gray-900 mb-0.5">Descripción</p>
                            <p className="italic leading-relaxed line-clamp-3">"{selectedProduct.description}"</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* BOTONES DE ACCIÓN */}
                    <div className="mt-auto space-y-2">
                      <div className="flex items-center justify-between bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Cantidad</span>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                            className="w-6 h-6 flex items-center justify-center rounded bg-white border text-xs shadow-sm hover:bg-gray-50 active:scale-90 transition-transform"
                          >
                            −
                          </button>
                          <span className="text-xs font-bold w-4 text-center">{cantidad}</span>
                          <button
                            onClick={() => setCantidad(cantidad + 1)}
                            className="w-6 h-6 flex items-center justify-center rounded bg-white border text-xs shadow-sm hover:bg-gray-50 active:scale-90 transition-transform"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => agregarAlCarrito(selectedProduct._id, cantidad)}
                        disabled={selectedProduct.stock <= 0}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-bold shadow-md transition-all active:scale-[0.97] disabled:bg-gray-300"
                      >
                        {selectedProduct.stock > 0 ? 'Agregar al carrito' : 'Sin stock'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* SECCIONES EXTRA */}
                <div className="border-t border-gray-100 pt-5 space-y-6">
                  <section>
                    <h4 className="text-sm font-bold text-gray-900 mb-3">Experiencias de Clientes</h4>
                    <div className="scale-95 origin-top-left bg-gray-50/50 rounded-xl p-4 border border-gray-50">
                      <ProductReviews productId={selectedProduct._id} />
                    </div>
                  </section>

                  <section>
                    <h4 className="text-sm font-bold text-gray-900 mb-3">Consultas</h4>
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
