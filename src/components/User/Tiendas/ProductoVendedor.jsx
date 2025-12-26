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

export default function Productosvendedor() {
  const { vendedorId } = useParams();
  const navigate = useNavigate();
  
  const [vendedor, setVendedor] = useState(null);
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
      try {
        const { data } = await api.get(`/vendedor/${vendedorId}`);
        setVendedor(data.vendedor);
        setProductos(data.productos || []);
      } catch (error) {
        alert("Error al cargar la tienda");
      }
    };
    fetchVendedor();
  }, [vendedorId]);

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
      setSelectedProduct(res.data);
      setSelectedImg(res.data.image?.[0] || "");
      setCantidad(1);
      setModalOpen(true);
    } catch (error) { alert("Error al cargar detalle"); } 
    finally { setLoadingProduct(null); }
  };

  if (!vendedor) return <div className="flex justify-center items-center h-screen animate-pulse text-gray-400">Cargando...</div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-10 font-sans overflow-x-hidden">
      {/* 1. HERO CON DEGRADADO */}
      <div className="relative h-40 md:h-48 bg-gradient-to-r from-[#00b09b] to-[#96c93d] flex items-end">
        <div className="max-w-7xl mx-auto w-full px-4 md:px-6 relative -bottom-20 md:-bottom-16">
          {/* 2. TARJETA DE PERFIL */}
          <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] p-5 md:p-8 shadow-xl border border-white flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 text-center md:text-left">
              <div className="relative">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-[1.2rem] md:rounded-[2rem] border-4 border-yellow-400 overflow-hidden shadow-lg bg-white">
                  <img 
                    src={vendedor.image || "https://via.placeholder.com/150"} 
                    className="w-full h-full object-cover" 
                    alt="Logo" 
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-yellow-400 p-1 rounded-lg border-2 border-white shadow-md text-white">
                  <ShieldCheck size={16} />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                   <div className="flex items-center gap-1.5 bg-green-50 text-green-600 px-3 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-wider border border-green-100">
                     <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                     Verificada
                   </div>
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-slate-900 mt-1 tracking-tight">{vendedor.storeName}</h1>
                <p className="text-gray-500 text-xs md:text-sm mt-1 max-w-xs md:max-w-md font-medium">Calidad y confianza garantizada.</p>
              </div>
            </div>
            <div className="hidden lg:flex flex-col items-end">
               <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl shadow-sm"><Info className="text-blue-500" size={18}/></div>
                  <div>
                    <p className="text-[10px] font-bold text-blue-600 uppercase">Info</p>
                    <p className="text-xs font-black text-slate-700">OFICIAL</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 mt-28 md:mt-32">
        <div className="flex items-center gap-2 mb-6 md:mb-8 border-l-4 border-green-500 pl-4">
          <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">Catálogo</h2>
        </div>

        {/* 3. CONTENEDOR PRINCIPAL */}
        <div className="bg-white rounded-[2rem] md:rounded-[3rem] shadow-sm border border-gray-100 p-4 md:p-8 min-h-[500px]">
          {/* HEADER DEL CATÁLOGO */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 md:mb-10 pb-6 border-b border-gray-50">
            <div className="flex items-center gap-3 w-full sm:w-auto">
               <button onClick={() => navigate(-1)} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all border border-gray-200">
                 <ChevronLeft size={18} className="text-gray-600" />
               </button>
               <div className="flex items-center gap-2">
                 <img src={vendedor.image} className="w-8 h-8 rounded-full border shadow-sm" alt="" />
                 <div>
                   <p className="text-xs font-black text-slate-800 leading-none">{vendedor.storeName}</p>
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Tienda</p>
                 </div>
               </div>
            </div>
            
            <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-100 w-full sm:w-auto">
              <span className="text-[10px] font-bold text-gray-400 pl-2 uppercase">Filtrar:</span>
              <select
                className="flex-1 bg-white border border-gray-200 text-[10px] md:text-xs font-bold rounded-lg px-3 py-1.5 outline-none"
                value={categoriaFiltro}
                onChange={(e) => { setCategoriaFiltro(e.target.value); setCurrentPage(1); }}
              >
                <option value="">Todas</option>
                {categorias.map((c) => (<option key={c} value={c}>{c}</option>))}
              </select>
            </div>
          </div>

          {productosFiltrados.length === 0 ? (
            <div className="text-center py-20 text-gray-400 font-medium">No hay productos.</div>
          ) : (
            <>
              {/* GRID DE PRODUCTOS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                {productosActuales.map((p) => (
                  <div key={p._id} className="group flex flex-col bg-white border border-gray-100 rounded-[1.8rem] md:rounded-[2.5rem] p-3 md:p-4 hover:shadow-xl transition-all duration-300">
                    <div className="relative aspect-square bg-[#fcfcfc] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden mb-4">
                      <img src={p.image?.[0]} className="w-full h-full object-contain p-4 md:p-6 group-hover:scale-105 transition-transform" alt={p.name} />
                      <button 
                        onClick={() => handleToggleFavorite(p)}
                        className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur rounded-xl shadow-sm text-gray-400"
                      >
                        <Heart size={16} fill={favorites.some((f) => f._id === p._id) ? "#ef4444" : "none"} className={favorites.some((f) => f._id === p._id) ? "text-red-500" : ""} />
                      </button>
                    </div>
                    
                    <div className="px-1 pb-1 flex-1 flex flex-col">
                      <p className="text-[9px] font-black text-blue-600 uppercase tracking-wider mb-1">{p.tipo?.name || 'PRODUCTO'}</p>
                      <h3 className="text-sm md:text-base font-black text-slate-800 line-clamp-1 mb-1 uppercase tracking-tight">{p.name}</h3>
                      
                      <div className="mt-auto flex items-center justify-between mb-4">
                        <span className="text-xl md:text-2xl font-black text-slate-900">${p.price}</span>
                        <div className={`px-2 py-0.5 rounded-md text-[8px] font-black ${p.stock > 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
                          STOCK: {p.stock}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => verProducto(p._id)}
                          className="flex-1 bg-gray-100 text-slate-700 py-2.5 rounded-xl text-[9px] font-black uppercase flex items-center justify-center gap-1"
                        >
                          <Info size={12}/> Detalles
                        </button>
                        <button 
                          onClick={() => agregarAlCarrito(p._id, 1)}
                          disabled={p.stock <= 0}
                          className="flex-[1.5] bg-blue-600 text-white py-2.5 rounded-xl text-[9px] font-black uppercase flex items-center justify-center gap-1 shadow-lg shadow-blue-100"
                        >
                          <ShoppingCart size={12}/> Comprar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* PAGINACIÓN */}
              <div className="flex flex-wrap justify-center items-center mt-12 gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-500 text-[10px] font-bold disabled:opacity-50"
                >
                  Anterior
                </button>
                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all ${currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-50 text-gray-400"}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-500 text-[10px] font-bold disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* MODAL RESPONSIVO */}
      {modalOpen && selectedProduct && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 md:p-4">
          <div className="bg-white w-full max-w-5xl rounded-[1.5rem] md:rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[95vh] md:max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50/50">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-blue-600 uppercase">Detalle</span>
                <h3 className="text-sm md:text-lg font-bold text-gray-800 line-clamp-1">{selectedProduct.name}</h3>
              </div>
              <button onClick={() => setModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-600">
                <X size={16} />
              </button>
            </div>

            <div className="overflow-y-auto p-4 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                  <div className="space-y-4">
                    <div className="bg-gray-50 border border-gray-100 rounded-[1.2rem] h-[250px] md:h-[400px] flex items-center justify-center overflow-hidden p-4">
                      <img src={selectedImg} className="max-h-full object-contain" alt="Selected" />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                      {selectedProduct.image?.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          onClick={() => setSelectedImg(img)}
                          className={`w-14 h-14 md:w-20 md:h-20 flex-shrink-0 rounded-lg object-cover cursor-pointer border-2 transition-all 
                            ${selectedImg === img ? "border-blue-500" : "border-transparent opacity-60"}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col">
                      <div className="flex items-center gap-2 mb-2">
                        <RatingStars value={selectedProduct.rating?.average || 0} count={selectedProduct.rating?.count || 0} size="text-[10px]" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase">{selectedProduct.brand}</span>
                      </div>
                      <h2 className="text-xl md:text-3xl font-black text-slate-900 leading-tight mb-2 md:mb-4">{selectedProduct.name}</h2>
                      <p className="text-2xl md:text-4xl font-black text-blue-600 mb-4 md:mb-6">${selectedProduct.price}</p>
                      
                      <div className="bg-slate-50 rounded-xl p-4 md:p-5 space-y-3 border border-slate-100">
                        <p className="text-xs md:text-sm text-slate-600 leading-relaxed italic">"{selectedProduct.description || 'Sin descripción'}"</p>
                        <div className="pt-3 border-t border-slate-200 grid grid-cols-2 gap-2 text-[10px] md:text-xs">
                          <p><span className="text-slate-400 font-medium">Tienda:</span> <br/> <strong className="text-slate-700">{vendedor.storeName}</strong></p>
                          <p><span className="text-slate-400 font-medium">Stock:</span> <br/> <strong className="text-slate-700">{selectedProduct.stock} uds.</strong></p>
                        </div>
                      </div>

                    <div className="mt-6 space-y-3">
                      <div className="flex items-center gap-4 bg-white border border-slate-200 p-1.5 rounded-xl w-full justify-between md:justify-start md:w-fit">
                        <span className="text-xs font-bold px-2">Cantidad</span>
                        <div className="flex items-center gap-3">
                          <button onClick={() => setCantidad(Math.max(1, cantidad - 1))} className="w-7 h-7 rounded-lg bg-slate-100 font-bold">-</button>
                          <span className="w-6 text-center font-black text-xs">{cantidad}</span>
                          <button onClick={() => setCantidad(cantidad + 1)} className="w-7 h-7 rounded-lg bg-slate-100 font-bold">+</button>
                        </div>
                      </div>
                      <button
                        onClick={() => agregarAlCarrito(selectedProduct._id, cantidad)}
                        className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-black text-sm md:text-lg shadow-xl shadow-blue-100 active:scale-95 transition-transform"
                      >
                        Añadir al Carrito
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-10 md:mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-slate-50/50 rounded-2xl p-4 md:p-8 border border-slate-100">
                    <h3 className="text-lg font-black text-slate-900 mb-4">Reseñas</h3>
                    <ProductReviews productId={selectedProduct._id} />
                  </div>
                  <div className="bg-white rounded-2xl p-4 md:p-8 border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-black text-slate-900 mb-4">Preguntas</h3>
                    <ProductQuestions productId={selectedProduct._id} />
                  </div>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}