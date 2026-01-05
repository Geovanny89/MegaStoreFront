import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { Heart, ChevronLeft, ShoppingCart, Info, Store } from "lucide-react";
import { useFavorites } from "../context/FavoriteContext";
import ProductQuestions from "../components/Questions/ProductQuestions";
import RatingStars from "../components/Ratings/RatingStars";
import ProductReviews from "../components/User/Calificaciones/ProductReviews";

export default function ProductosTienda({ vendedorId, volver, user }) {
  const [vendedor, setVendedor] = useState(null);
  const [productos, setProductos] = useState([]);
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [tiendaVencida, setTiendaVencida] = useState(false); // Estado para manejar trial vencido

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
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    <div className="flex flex-col justify-center items-center h-screen bg-gray-50 text-gray-500 font-medium">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      Cargando tienda...
    </div>
  );

  // 2. Pantalla de Tienda Inactiva (Trial Vencido)
  if (tiendaVencida) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md text-center space-y-6">
        <div className="w-24 h-24 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <Store size={48} />
        </div>
        <h1 className="text-3xl font-black text-gray-900">{vendedor?.storeName || "Tienda Inactiva"}</h1>
        <p className="text-gray-500 font-medium leading-relaxed">
          Esta tienda no cuenta con una suscripción activa en este momento. Sus productos estarán disponibles nuevamente una vez se renueve el plan.
        </p>
        <button
          onClick={volver}
          className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg"
        >
          Explorar otras tiendas
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      {/* HEADER DE TIENDA */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={volver}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="flex items-center gap-3">
              <img src={vendedor.image} className="w-12 h-12 rounded-full border object-cover shadow-sm" alt="Logo" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">{vendedor.storeName}</h1>
                <p className="text-[10px] text-blue-600 flex items-center gap-1 uppercase tracking-wider font-bold bg-blue-50 px-2 py-0.5 rounded">
                  Tienda Verificada
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 font-medium">Filtrar:</span>
            <select
              className="bg-gray-50 border border-gray-200 text-sm rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500/20"
              value={categoriaFiltro}
              onChange={(e) => { setCategoriaFiltro(e.target.value); setCurrentPage(1); }}
            >
              <option value="">Todas las categorías</option>
              {categorias.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8">
        {productosFiltrados.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed text-gray-400">
            No hay productos disponibles por ahora.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {productosActuales.map((p) => (
                <div key={p._id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                  <div className="relative aspect-square bg-gray-50 flex justify-center items-center overflow-hidden">
                    <img
                      src={p.image?.[0]?.url || p.image?.[1]?.url}
                      alt={p.name}
                      className="h-full w-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                    />
                    <button
                      onClick={() => handleToggleFavorite(p)}
                      disabled={loadingId === p._id}
                      className={`absolute top-3 right-3 rounded-full p-2.5 shadow-md transition-all 
                        ${favorites.some((f) => f._id === p._id) ? "bg-red-500 text-white scale-110" : "bg-white/90 backdrop-blur text-gray-600 hover:text-red-500"}`}
                    >
                      <Heart className="h-5 w-5" fill={favorites.some((f) => f._id === p._id) ? "white" : "transparent"} />
                    </button>
                  </div>

                  <div className="p-5">
                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{p.tipo?.name || 'Producto'}</span>
                    <h2 className="text-base font-bold text-gray-800 line-clamp-1 mt-1">{p.name}</h2>
                    
                    <div className="flex items-center justify-between mt-4">
                      <p className="text-xl font-black text-slate-900">${p.price}</p>
                      <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${p.stock > 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
                        {p.stock > 0 ? `STOCK: ${p.stock}` : 'SIN STOCK'}
                      </span>
                    </div>

                    <div className="mt-5 flex gap-2">
                      <button
                        onClick={() => verProducto(p._id)}
                        disabled={loadingProduct === p._id}
                        className="flex-1 bg-slate-100 text-slate-700 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                      >
                        {loadingProduct === p._id ? "..." : <><Info size={14} /> Detalles</>}
                      </button>
                      <button
                        onClick={() => agregarAlCarrito(p._id, 1)}
                        disabled={loadingId === p._id || p.stock <= 0}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold text-white transition-all flex items-center justify-center gap-2
                          ${loadingId === p._id ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100"}`}
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
              <div className="flex justify-center mt-12 gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-xl border bg-white disabled:opacity-50 font-bold text-sm"
                >
                  Anterior
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`w-10 h-10 rounded-xl border text-sm font-bold transition-all ${currentPage === i + 1 ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-white hover:bg-gray-50 text-gray-600"}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-xl border bg-white disabled:opacity-50 font-bold text-sm"
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* MODAL DETALLE */}
      {modalOpen && selectedProduct && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-5xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-8 py-5 border-b bg-gray-50/50">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Detalle del Producto</span>
                <h3 className="text-lg font-bold text-gray-800 line-clamp-1">{selectedProduct.name}</h3>
              </div>
              <button onClick={() => setModalOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors text-gray-500">
                ✕
              </button>
            </div>

            <div className="overflow-y-auto custom-scrollbar">
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <div className="bg-gray-50 border border-gray-100 rounded-[1.5rem] h-[400px] flex items-center justify-center overflow-hidden p-6">
                      <img src={selectedImg} className="max-h-full object-contain hover:scale-105 transition-transform duration-500" alt="Selected" />
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {selectedProduct.image?.map((imgObj, i) => (
                        <img
                          key={i}
                          src={imgObj.url}
                          onClick={() => setSelectedImg(imgObj.url)}
                          className={`w-20 h-20 rounded-xl object-cover cursor-pointer border-2 transition-all 
                            ${selectedImg === imgObj.url ? "border-blue-500 ring-4 ring-blue-50" : "border-transparent opacity-70 hover:opacity-100"}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <RatingStars value={selectedProduct.rating?.average || 0} count={selectedProduct.rating?.count || 0} size="text-sm" />
                      </div>
                      <h2 className="text-3xl font-black text-slate-900 leading-tight mb-4">{selectedProduct.name}</h2>
                      <p className="text-4xl font-black text-blue-600 mb-6">${selectedProduct.price}</p>
                      <div className="bg-slate-50 rounded-2xl p-5 space-y-3 border border-slate-100">
                        <p className="text-sm text-slate-600 leading-relaxed italic">"{selectedProduct.description || 'Sin descripción disponible'}"</p>
                      </div>
                    </div>

                    <div className="mt-8 space-y-4">
                      <div className="flex items-center gap-4 bg-white border border-slate-200 p-2 rounded-2xl w-fit">
                        <span className="text-sm font-bold px-3">Cantidad</span>
                        <div className="flex items-center gap-3">
                          <button onClick={() => setCantidad(Math.max(1, cantidad - 1))} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold">-</button>
                          <span className="w-8 text-center font-black">{cantidad}</span>
                          <button onClick={() => setCantidad(cantidad + 1)} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold">+</button>
                        </div>
                      </div>
                      <button
                        onClick={() => agregarAlCarrito(selectedProduct._id, cantidad)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-lg transition-all shadow-xl shadow-blue-100 active:scale-[0.98]"
                      >
                        Añadir a mi Carrito
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="bg-slate-50/50 rounded-3xl p-8 border border-slate-100">
                    <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">Experiencias de Clientes</h3>
                    <ProductReviews productId={selectedProduct._id} />
                  </div>
                  <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                    <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">Consultas sobre el Producto</h3>
                    <ProductQuestions productId={selectedProduct._id} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}