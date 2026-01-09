import React, { useEffect, useState } from "react";
import { useParams, useLocation, Outlet, useNavigate, useSearchParams } from "react-router-dom";
import api from "../../api/axios";
// import ProductosTienda from "../ProductosTienda";
import NavbarTienda from "../../components/User/Tiendas/NabvarTienda";
import BannerCarousel from "../../components/Vendedor/BannerCarousel/BannerCarousel";
import { Store, ShieldCheck, ArrowLeft, Info, Package } from "lucide-react";
import FooterStore from "./FooterStore";
import Productosvendedor from "../../components/User/Tiendas/ProductoVendedor";

export default function Storefront() {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [storeData, setStoreData] = useState(null);
  const [banners, setBanners] = useState([]); // ✅ NUEVO
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const isSubRoute = location.pathname !== `/${slug}`;
  const path = location.pathname;

  /* ===================== TÍTULO DINÁMICO ===================== */
  const pageTitle = (() => {
    if (path.endsWith("/carrito")) return " ";
    if (path.endsWith("/favoritos")) return " ";
    if (path.endsWith("/ordenes")) return " ";
    if (path.endsWith("/perfil")) return " ";
    if (path.endsWith("/notificaciones")) return "";
    return "Catálogo de Productos";
  })();

  /* ===================== OBTENER TIENDA ===================== */
  useEffect(() => {
    const fetchStore = async () => {
      try {
        const res = await api.get(`/store/${slug}`);
        setStoreData(res.data);
      } catch (error) {
        console.error("Error cargando tienda:", error);
        setStoreData(null);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchStore();
  }, [slug]);

  /* ===================== OBTENER BANNERS ===================== */
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await api.get(`/banner/${slug}`);
        setBanners(res.data.banners || []);
      } catch (error) {
        console.error("Error cargando banners:", error);
        setBanners([]);
      }
    };

    if (slug) fetchBanners();
  }, [slug]);

  /* ===================== LOADING ===================== */
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors">
        <div className="w-12 h-12 border-4 border-green-200 dark:border-slate-800 border-t-green-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-600 dark:text-slate-400 font-bold animate-pulse">
          Entrando a la tienda...
        </p>
      </div>
    );
  }

  /* ===================== TIENDA NO EXISTE ===================== */
  if (!storeData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 px-4 transition-colors">
        <div className="bg-white dark:bg-slate-900 p-10 rounded-[2rem] shadow-2xl text-center max-w-md border-t-8 border-red-500">
          <div className="bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Store size={40} />
          </div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
            ¡Ups!
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-3 font-medium">
            Esta tienda no existe o cambió de dirección.
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-8 w-full bg-gradient-to-r from-green-600 to-blue-500 text-white px-6 py-4 rounded-xl font-black shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft size={20} />
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  const fromMarketplace = location.state?.from === "marketplace";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* ===================== NAVBAR ===================== */}
      <NavbarTienda
        storeName={storeData.seller.storeName}
        fromMarketplace={fromMarketplace}
      />

      {/* ===================== HERO ===================== */}
      <div className="relative pt-20">
        <div className="absolute inset-0 h-64 bg-gradient-to-r from-green-600 via-green-500 to-blue-400 dark:from-green-900 dark:via-green-800 dark:to-blue-900 opacity-90"></div>

        <div className="relative max-w-7xl mx-auto px-6 pt-16">
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-slate-800 p-8 flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <div className="p-1 bg-gradient-to-tr from-yellow-400 to-green-500 rounded-[2.8rem]">
                <img
                  src={storeData.seller.image || "https://via.placeholder.com/150"}
                  alt={storeData.seller.storeName}
                  className="w-32 h-32 md:w-44 md:h-44 rounded-[2.5rem] object-cover border-4 border-white dark:border-slate-800 shadow-inner"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-white p-2 rounded-2xl shadow-lg border-4 border-white dark:border-slate-800">
                <ShieldCheck size={24} />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-1.5 rounded-full mb-4">
                <Package size={16} />
                <span className="text-xs font-black uppercase tracking-widest">
                  Tienda Verificada
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter transition-colors">
                {storeData.seller.storeName}
              </h1>

              <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium max-w-xl">
                {storeData.seller.description ||
                  "Bienvenidos a nuestra tienda oficial. Calidad y confianza garantizada."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ===================== CONTENIDO ===================== */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* BANNERS SOLO EN HOME */}
        {!isSubRoute && banners.length > 0 && (
          <BannerCarousel banners={banners} />
        )}

        {/* BOTÓN VOLVER */}
        {isSubRoute && (
          <button
            onClick={() => navigate(`/${slug}`)}
            className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
          >
            <ArrowLeft size={18} />
            Volver a la tienda
          </button>
        )}

        {/* TÍTULO DINÁMICO */}
        <div className="flex items-center gap-3 mb-8">
          <div className="h-8 w-2 bg-green-500 rounded-full"></div>
          <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight transition-colors">
            {pageTitle}
          </h3>
        </div>

        {/* SUBRUTAS */}
        <Outlet context={{ sellerId: storeData.seller._id }} />

        {/* PRODUCTOS SOLO EN HOME */}
        {!isSubRoute && (
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-xl border border-slate-100 dark:border-slate-800 p-8 mt-10 transition-colors">
            <Productosvendedor 
              vendedorId={storeData.seller._id} 
              search={query}
            />
          </div>
        )}
      </main>

      <FooterStore />
    </div>
  );
}