import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { Heart, ChevronLeft, ShoppingCart, Info } from "lucide-react";
import { useFavorites } from "../context/FavoriteContext";
import ProductQuestions from "../components/Questions/ProductQuestions";
import RatingStars from "../components/Ratings/RatingStars";
import ProductReviews from "../components/User/Calificaciones/ProductReviews";

export default function ProductosTienda({ vendedorId, volver, user }) {
  const [vendedor, setVendedor] = useState(null);
  const [productos, setProductos] = useState([]);
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  
  // Estados de Carga y UI
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
        const { data } = await api.get(`/vendedor/${vendedorId}`);
        setVendedor(data.vendedor);
        setProductos(data.productos || []);
      } catch (error) {
        console.error(error);
        alert("Error al cargar la tienda");
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
      setSelectedImg(res.data.image?.[0] || "");
      setCantidad(1);
      setModalOpen(true);
    } catch (error) {
      alert("Error al cargar detalle del producto");
    } finally {
      setLoadingProduct(null);
    }
  };

  if (!vendedor) return (
    <div className="flex justify-center items-center h-64 text-gray-500 animate-pulse font-medium">
      Cargando tienda...
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      {/* HEADER DE TIENDA PROFESIONAL */}
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
                <p className="text-xs text-gray-500 flex items-center gap-1 uppercase tracking-wider font-semibold">
                  Tienda Oficial
                </p>
              </div>
            </div>
          </div>

          {/* FILTRO CATEGORÍAS */}
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
            No se encontraron productos en esta categoría.
          </div>
        ) : (
          <>
            {/* GRID PRODUCTOS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {productosActuales.map((p) => (
                <div key={p._id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                  <div className="relative aspect-square bg-gray-50 flex justify-center items-center overflow-hidden">
                    <img
                      src={p.image?.[1] || p.image?.[0]}
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
                    <p className="text-xs text-gray-500 mt-1 uppercase font-medium">{p.brand || 'Genérico'}</p>
                    
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
                        {loadingProduct === p._id ? "..." : <><Info size={14}/> Detalles</>}
                      </button>
                      <button
                        onClick={() => agregarAlCarrito(p._id, 1)}
                        disabled={loadingId === p._id || p.stock <= 0}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold text-white transition-all flex items-center justify-center gap-2
                          ${loadingId === p._id ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100"}`}
                      >
                        {loadingId === p._id ? "..." : <><ShoppingCart size={14}/> Comprar</>}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* PAGINACIÓN PROFESIONAL */}
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
          </>
        )}
      </div>

      {/* MODAL PROFESIONAL (Reseñas y Preguntas) */}
      {modalOpen && selectedProduct && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-5xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* HEADER MODAL */}
            <div className="flex items-center justify-between px-8 py-5 border-b bg-gray-50/50">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Detalle del Producto</span>
                <h3 className="text-lg font-bold text-gray-800 line-clamp-1">{selectedProduct.name}</h3>
              </div>
              <button onClick={() => setModalOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors text-gray-500">
                ✕
              </button>
            </div>

            {/* CUERPO SCROLLABLE */}
            <div className="overflow-y-auto custom-scrollbar">
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* VISUALS */}
                  <div className="space-y-4">
                    <div className="bg-gray-50 border border-gray-100 rounded-[1.5rem] h-[400px] flex items-center justify-center overflow-hidden p-6">
                      <img src={selectedImg} className="max-h-full object-contain hover:scale-105 transition-transform duration-500" alt="Selected" />
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {selectedProduct.image?.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          onClick={() => setSelectedImg(img)}
                          className={`w-20 h-20 rounded-xl object-cover cursor-pointer border-2 transition-all 
                            ${selectedImg === img ? "border-blue-500 ring-4 ring-blue-50" : "border-transparent opacity-70 hover:opacity-100"}`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* INFO COMPRA */}
                  <div className="flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <RatingStars value={selectedProduct.rating?.average || 0} count={selectedProduct.rating?.count || 0} size="text-sm" />
                        <span className="text-gray-300">|</span>
                        <span className="text-xs font-bold text-gray-500 uppercase">{selectedProduct.brand}</span>
                      </div>
                      <h2 className="text-3xl font-black text-slate-900 leading-tight mb-4">{selectedProduct.name}</h2>
                      <p className="text-4xl font-black text-blue-600 mb-6">${selectedProduct.price}</p>
                      
                      <div className="bg-slate-50 rounded-2xl p-5 space-y-3 border border-slate-100">
                        <p className="text-sm text-slate-600 leading-relaxed italic">"{selectedProduct.description || 'Sin descripción disponible'}"</p>
                        <div className="pt-3 border-t border-slate-200 grid grid-cols-2 gap-4 text-xs">
                          <p><span className="text-slate-400 font-medium">Vendio por:</span> <br/> <strong className="text-slate-700">{selectedProduct.vendedor?.storeName}</strong></p>
                          <p><span className="text-slate-400 font-medium">Disponibles:</span> <br/> <strong className="text-slate-700">{selectedProduct.stock} Unidades</strong></p>
                        </div>
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
                    <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                       Experiencias de Clientes
                    </h3>
                    <ProductReviews productId={selectedProduct._id} />
                  </div>
                  <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                    <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                      Consultas sobre el Producto
                    </h3>
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