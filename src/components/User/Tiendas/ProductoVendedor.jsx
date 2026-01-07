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

export default function Productosvendedor({ vendedorId: propVendedorId }) {
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
      // Si no hay ID de ninguna fuente, no hacemos la petición
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
      const prod = res.data;
      console.log("producto",res)
      console.log("productos",res.data)

      setSelectedProduct(prod);

      // Corrección: Acceder a la URL del primer objeto del array image
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

  if (!vendedor) return <div className="flex justify-center items-center h-screen animate-pulse text-gray-400">Cargando...</div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-10 font-sans overflow-x-hidden">

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
  {productosActuales.map((p) => (
    <div key={p._id} className="group flex flex-col bg-white border border-gray-100 rounded-[1.8rem] md:rounded-[2.5rem] p-3 md:p-4 hover:shadow-xl transition-all duration-300">
      
      <div className="relative aspect-square bg-[#fcfcfc] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden mb-4">
        {/* --- BADGE DE DESCUENTO --- */}
        {p.hasDiscount && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-full shadow-lg z-10">
            {p.discount?.type === "percentage" ? `-${p.discount.value}%` : `-$${p.discount.value}`}
          </span>
        )}

        <img
          src={p.image?.[0]?.url || "https://via.placeholder.com/300?text=Sin+Imagen"}
          className="w-full h-full object-contain p-4 md:p-6 group-hover:scale-105 transition-transform"
          alt={p.name}
          onError={(e) => { e.target.src = "https://via.placeholder.com/300?text=Error+Imagen"; }}
        />
        
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

        {/* --- LÓGICA DE PRECIOS CON DESCUENTO --- */}
        <div className="mt-auto flex items-center justify-between mb-4">
          {p.hasDiscount ? (
            <div className="flex flex-col">
              <span className="text-[10px] line-through text-gray-400 leading-none">${p.price}</span>
              <span className="text-xl md:text-2xl font-black text-red-600">${p.finalPrice}</span>
            </div>
          ) : (
            <span className="text-xl md:text-2xl font-black text-slate-900">${p.price}</span>
          )}

          <div className={`px-2 py-0.5 rounded-md text-[8px] font-black ${p.stock > 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
            STOCK: {p.stock}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => verProducto(p._id)}
            className="flex-1 bg-gray-100 text-slate-700 py-2.5 rounded-xl text-[9px] font-black uppercase flex items-center justify-center gap-1"
          >
            <Info size={12} /> Detalles
          </button>
          <button
            onClick={() => agregarAlCarrito(p._id, 1)}
            disabled={p.stock <= 0}
            className="flex-[1.5] bg-blue-600 text-white py-2.5 rounded-xl text-[9px] font-black uppercase flex items-center justify-center gap-1 shadow-lg shadow-blue-100 disabled:bg-gray-300"
          >
            <ShoppingCart size={12} /> Comprar
          </button>
        </div>
      </div>
    </div>
  ))}
</div>

      {/* MODAL RESPONSIVO */}
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

      {/* CUERPO CON SCROLL */}
      <div className="overflow-y-auto overflow-x-hidden">
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

            {/* SECCIÓN IMÁGENES */}
            <div className="space-y-3">
              <div className="bg-gray-50 border border-gray-100 rounded-xl h-48 flex items-center justify-center overflow-hidden">
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
                    className={`h-12 w-12 min-w-[3rem] rounded-lg object-cover cursor-pointer border-2 transition-all ${
                      selectedImg === img.url ? "border-blue-500" : "border-transparent opacity-70"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* SECCIÓN INFO PRODUCTO */}
            <div className="flex flex-col">
              <div className="mb-2">
                <h2 className="text-lg font-black text-gray-900 leading-tight">
                  {selectedProduct.name}
                </h2>

                <div className="flex items-center gap-1 mt-1 scale-90 origin-left">
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
              </div>

              {/* --- LÓGICA DE PRECIOS ACTUALIZADA CON DESCUENTOS --- */}
              <div className="mb-3">
                {selectedProduct.hasDiscount ? (
                  <div className="flex flex-col">
                    <span className="text-sm line-through text-gray-400">
                      ${selectedProduct.price}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black text-red-600">
                        ${selectedProduct.finalPrice}
                      </span>
                      <span className="bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase">
                        Oferta
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-2xl font-black text-blue-600">
                    ${selectedProduct.price}
                  </p>
                )}
              </div>

              <div className="space-y-1.5 text-xs text-gray-600 mb-5">
                <p>Marca: <span className="font-semibold">{selectedProduct.brand || 'N/A'}</span></p>

                {selectedProduct.description && (
                  <div className="mt-3 text-[11px] text-gray-700 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <p className="font-bold text-gray-900 mb-1">Descripción</p>
                    <p className="line-clamp-3">"{selectedProduct.description}"</p>
                  </div>
                )}

                <div className="mt-4">
                  <p className="flex items-center gap-1">
                    Vendido por: <span className="font-bold uppercase text-blue-700">{vendedor?.storeName}</span>
                  </p>
                  
                  {selectedProduct.size?.length > 0 && (
                    <div className="mt-3">
                      <p className="text-[10px] font-bold text-gray-900 mb-1.5 uppercase">Tallas disponibles</p>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedProduct.size.map((talla, i) => (
                          <span key={i} className="px-2 py-0.5 text-[10px] font-semibold border rounded bg-white uppercase">
                            {talla}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <p className="mt-2">Stock: <span className={`font-semibold ${selectedProduct.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {selectedProduct.stock} unidades
                </span></p>
              </div>

              {/* ACCIONES */}
              <div className="mt-auto space-y-2">
                <div className="flex items-center justify-between bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Cantidad</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                      className="w-6 h-6 flex items-center justify-center rounded bg-white border text-xs shadow-sm hover:bg-gray-50 transition-transform active:scale-90"
                    >
                      −
                    </button>
                    <span className="text-xs font-bold w-4 text-center">{cantidad}</span>
                    <button
                      onClick={() => setCantidad(cantidad + 1)}
                      className="w-6 h-6 flex items-center justify-center rounded bg-white border text-xs shadow-sm hover:bg-gray-50 transition-transform active:scale-90"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => agregarAlCarrito(selectedProduct._id, cantidad)}
                  disabled={selectedProduct.stock <= 0}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-bold shadow-md transition-all active:scale-[0.98] disabled:bg-gray-300"
                >
                  {selectedProduct.stock > 0 ? 'Agregar al carrito' : 'Sin stock disponible'}
                </button>
              </div>
            </div>
          </div>

          {/* SECCIONES DE RESEÑAS Y PREGUNTAS */}
          <div className="border-t border-gray-100 pt-5 space-y-6">
            <section>
              <h4 className="text-sm font-bold text-gray-900 mb-3">Opiniones</h4>
              <div className="scale-95 origin-top-left bg-gray-50/50 rounded-xl p-4">
                <ProductReviews productId={selectedProduct._id} />
              </div>
            </section>

            <section>
              <h4 className="text-sm font-bold text-gray-900 mb-3">Preguntas</h4>
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