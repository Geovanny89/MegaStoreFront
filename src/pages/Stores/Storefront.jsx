// import React, { useEffect, useState } from "react";
// import { useParams, useLocation, Outlet, useNavigate } from "react-router-dom";
// import api from "../../api/axios";
// import ProductosTienda from "../ProductosTienda";
// import NavbarTienda from "../../components/User/Tiendas/NabvarTienda";
// import { Store, ShieldCheck, ArrowLeft, Info, Package } from "lucide-react";
// import FooterStore from "./FooterStore";

// export default function Storefront() {
//   const { slug } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();

//   const [storeData, setStoreData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const isSubRoute = location.pathname !== `/${slug}`;
//   const path = location.pathname;

//   /* ===================== TÍTULO DINÁMICO ===================== */
//   const pageTitle = (() => {
//     if (path.endsWith("/carrito")) return "Carrito de Compras";
//     if (path.endsWith("/favoritos")) return "Mis Favoritos";
//     if (path.endsWith("/ordenes")) return "Mis Órdenes";
//     if (path.endsWith("/perfil")) return "Mi Perfil";
//     if (path.endsWith("/notificaciones")) return "Notificaciones";
//     return "Catálogo de Productos";
//   })();

//   /* ===================== OBTENER TIENDA ===================== */
//   useEffect(() => {
//     const fetchStore = async () => {
//       try {
//         const res = await api.get(`/store/${slug}`);
//         setStoreData(res.data);
//       } catch (error) {
//         console.error("Error cargando tienda:", error);
//         setStoreData(null);
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (slug) fetchStore();
//   }, [slug]);

//   /* ===================== LOADING ===================== */
//   if (loading) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
//         <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
//         <p className="mt-4 text-slate-600 font-bold animate-pulse">
//           Entrando a la tienda...
//         </p>
//       </div>
//     );
//   }

//   /* ===================== TIENDA NO EXISTE ===================== */
//   if (!storeData) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
//         <div className="bg-white p-10 rounded-[2rem] shadow-2xl text-center max-w-md border-t-8 border-red-500">
//           <div className="bg-red-50 text-red-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
//             <Store size={40} />
//           </div>
//           <h2 className="text-3xl font-black text-slate-800 tracking-tight">
//             ¡Ups!
//           </h2>
//           <p className="text-slate-500 mt-3 font-medium">
//             Esta tienda no existe o cambió de dirección.
//           </p>
//           <button
//             onClick={() => navigate("/")}
//             className="mt-8 w-full bg-gradient-to-r from-green-600 to-blue-500 text-white px-6 py-4 rounded-xl font-black shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
//           >
//             <ArrowLeft size={20} />
//             Volver al inicio
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-50">
//       {/* ===================== NAVBAR TIENDA ===================== */}
//       <NavbarTienda store={storeData.seller} />

//       {/* ===================== HERO ===================== */}
//       <div className="relative pt-20">
//         <div className="absolute inset-0 h-64 bg-gradient-to-r from-green-600 via-green-500 to-blue-400"></div>

//         <div className="relative max-w-7xl mx-auto px-6 pt-16">
//           <div className="bg-white/95 backdrop-blur-md rounded-[2.5rem] shadow-2xl border border-white/20 p-8 flex flex-col md:flex-row items-center gap-8">
//             {/* LOGO */}
//             <div className="relative">
//               <div className="p-1 bg-gradient-to-tr from-yellow-400 to-green-500 rounded-[2.8rem]">
//                 <img
//                   src={storeData.seller.image || "https://via.placeholder.com/150"}
//                   alt={storeData.seller.storeName}
//                   className="w-32 h-32 md:w-44 md:h-44 rounded-[2.5rem] object-cover border-4 border-white shadow-inner"
//                 />
//               </div>
//               <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-white p-2 rounded-2xl shadow-lg border-4 border-white">
//                 <ShieldCheck size={24} />
//               </div>
//             </div>

//             {/* INFO */}
//             <div className="flex-1 text-center md:text-left">
//               <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full mb-4">
//                 <Package size={16} />
//                 <span className="text-xs font-black uppercase tracking-widest">
//                   Tienda Verificada
//                 </span>
//               </div>

//               <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">
//                 {storeData.seller.storeName}
//               </h1>

//               <p className="mt-4 text-slate-500 font-medium max-w-xl">
//                 {storeData.seller.description ||
//                   "Bienvenidos a nuestra tienda oficial. Calidad y confianza garantizada."}
//               </p>
//             </div>

//             <div className="hidden lg:flex flex-col gap-3 min-w-[200px]">
//               <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
//                 <div className="flex items-center gap-2 text-green-600 font-black text-sm mb-1">
//                   <Info size={16} /> INFO
//                 </div>
//                 <p className="text-xs text-slate-400 font-bold uppercase">
//                   Vendedor verificado
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ===================== CONTENIDO ===================== */}
//       <main className="max-w-7xl mx-auto px-6 py-12">
//         {/* BOTÓN VOLVER */}
//         {isSubRoute && (
//           <button
//             onClick={() => navigate(`/${slug}`)}
//             className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-green-600 transition-colors"
//           >
//             <ArrowLeft size={18} />
//             Volver a la tienda
//           </button>
//         )}

//         {/* TÍTULO DINÁMICO */}
//         <div className="flex items-center gap-3 mb-8">
//           <div className="h-8 w-2 bg-green-500 rounded-full"></div>
//           <h3 className="text-2xl font-black text-slate-800 tracking-tight">
//             {pageTitle}
//           </h3>
//         </div>

//         <Outlet context={{ sellerId: storeData.seller._id }} />


//         {!isSubRoute && (
//           <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 p-8">
//             <ProductosTienda vendedorId={storeData.seller._id} />
//           </div>
//         )}
//       </main>

//       {/* ===================== FOOTER ===================== */}
//       <FooterStore />
//     </div>
//   );
// }
// import React, { useEffect, useState } from "react";
// import { useParams, useLocation, Outlet, useNavigate } from "react-router-dom";
// import api from "../../api/axios";
// import ProductosTienda from "../ProductosTienda";
// import NavbarTienda from "../../components/User/Tiendas/NabvarTienda";
// import { Store, ShieldCheck, ArrowLeft, Info, Package } from "lucide-react";
// import FooterStore from "./FooterStore";

// export default function Storefront() {
//   const { slug } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();

//   const [storeData, setStoreData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const isSubRoute = location.pathname !== `/${slug}`;
//   const path = location.pathname;

//   /* ===================== TÍTULO DINÁMICO ===================== */
//   const pageTitle = (() => {
//     if (path.endsWith("/carrito")) return "Carrito de Compras";
//     if (path.endsWith("/favoritos")) return "Mis Favoritos";
//     if (path.endsWith("/ordenes")) return "Mis Órdenes";
//     if (path.endsWith("/perfil")) return "Mi Perfil";
//     if (path.endsWith("/notificaciones")) return "Notificaciones";
//     return "Catálogo de Productos";
//   })();

//   /* ===================== OBTENER TIENDA ===================== */
//   useEffect(() => {
//     const fetchStore = async () => {
//       try {
//         const res = await api.get(`/store/${slug}`);
//         setStoreData(res.data);
//       } catch (error) {
//         console.error("Error cargando tienda:", error);
//         setStoreData(null);
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (slug) fetchStore();
//   }, [slug]);

//   /* ===================== LOADING ===================== */
//   if (loading) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
//         <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
//         <p className="mt-4 text-slate-600 font-bold animate-pulse">
//           Entrando a la tienda...
//         </p>
//       </div>
//     );
//   }

//   /* ===================== TIENDA NO EXISTE ===================== */
//   if (!storeData) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
//         <div className="bg-white p-10 rounded-[2rem] shadow-2xl text-center max-w-md border-t-8 border-red-500">
//           <div className="bg-red-50 text-red-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
//             <Store size={40} />
//           </div>
//           <h2 className="text-3xl font-black text-slate-800 tracking-tight">
//             ¡Ups!
//           </h2>
//           <p className="text-slate-500 mt-3 font-medium">
//             Esta tienda no existe o cambió de dirección.
//           </p>
//           <button
//             onClick={() => navigate("/")}
//             className="mt-8 w-full bg-gradient-to-r from-green-600 to-blue-500 text-white px-6 py-4 rounded-xl font-black shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
//           >
//             <ArrowLeft size={20} />
//             Volver al inicio
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-50">
//       {/* ===================== NAVBAR TIENDA ===================== */}
//       <NavbarTienda store={storeData.seller} />

//       {/* ===================== HERO ===================== */}
//       <div className="relative pt-20">
//         <div className="absolute inset-0 h-64 bg-gradient-to-r from-green-600 via-green-500 to-blue-400"></div>

//         <div className="relative max-w-7xl mx-auto px-6 pt-16">
//           <div className="bg-white/95 backdrop-blur-md rounded-[2.5rem] shadow-2xl border border-white/20 p-8 flex flex-col md:flex-row items-center gap-8">
//             {/* LOGO */}
//             <div className="relative">
//               <div className="p-1 bg-gradient-to-tr from-yellow-400 to-green-500 rounded-[2.8rem]">
//                 <img
//                   src={storeData.seller.image || "https://via.placeholder.com/150"}
//                   alt={storeData.seller.storeName}
//                   className="w-32 h-32 md:w-44 md:h-44 rounded-[2.5rem] object-cover border-4 border-white shadow-inner"
//                 />
//               </div>
//               <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-white p-2 rounded-2xl shadow-lg border-4 border-white">
//                 <ShieldCheck size={24} />
//               </div>
//             </div>

//             {/* INFO */}
//             <div className="flex-1 text-center md:text-left">
//               <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full mb-4">
//                 <Package size={16} />
//                 <span className="text-xs font-black uppercase tracking-widest">
//                   Tienda Verificada
//                 </span>
//               </div>

//               <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">
//                 {storeData.seller.storeName}
//               </h1>

//               <p className="mt-4 text-slate-500 font-medium max-w-xl">
//                 {storeData.seller.description ||
//                   "Bienvenidos a nuestra tienda oficial. Calidad y confianza garantizada."}
//               </p>
//             </div>

//             <div className="hidden lg:flex flex-col gap-3 min-w-[200px]">
//               <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
//                 <div className="flex items-center gap-2 text-green-600 font-black text-sm mb-1">
//                   <Info size={16} /> INFO
//                 </div>
//                 <p className="text-xs text-slate-400 font-bold uppercase">
//                   Vendedor verificado
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ===================== CONTENIDO ===================== */}
//       <main className="max-w-7xl mx-auto px-6 py-12">
//         {/* BOTÓN VOLVER */}
//         {isSubRoute && (
//           <button
//             onClick={() => navigate(`/${slug}`)}
//             className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-green-600 transition-colors"
//           >
//             <ArrowLeft size={18} />
//             Volver a la tienda
//           </button>
//         )}

//         {/* TÍTULO DINÁMICO */}
//         <div className="flex items-center gap-3 mb-8">
//           <div className="h-8 w-2 bg-green-500 rounded-full"></div>
//           <h3 className="text-2xl font-black text-slate-800 tracking-tight">
//             {pageTitle}
//           </h3>
//         </div>

//         <Outlet context={{ sellerId: storeData.seller._id }} />


//         {!isSubRoute && (
//           <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 p-8">
//             <ProductosTienda vendedorId={storeData.seller._id} />
//           </div>
//         )}
//       </main>

//       {/* ===================== FOOTER ===================== */}
//       <FooterStore />
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { useParams, useLocation, Outlet, useNavigate } from "react-router-dom";
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

  const isSubRoute = location.pathname !== `/${slug}`;
  const path = location.pathname;

  /* ===================== TÍTULO DINÁMICO ===================== */
  const pageTitle = (() => {
    if (path.endsWith("/carrito")) return "Carrito de Compras";
    if (path.endsWith("/favoritos")) return "Mis Favoritos";
    if (path.endsWith("/ordenes")) return "Mis Órdenes";
    if (path.endsWith("/perfil")) return "Mi Perfil";
    if (path.endsWith("/notificaciones")) return "Notificaciones";
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-600 font-bold animate-pulse">
          Entrando a la tienda...
        </p>
      </div>
    );
  }

  /* ===================== TIENDA NO EXISTE ===================== */
  if (!storeData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
        <div className="bg-white p-10 rounded-[2rem] shadow-2xl text-center max-w-md border-t-8 border-red-500">
          <div className="bg-red-50 text-red-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Store size={40} />
          </div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">
            ¡Ups!
          </h2>
          <p className="text-slate-500 mt-3 font-medium">
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

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ===================== NAVBAR ===================== */}
      <NavbarTienda store={storeData.seller} />

      {/* ===================== HERO ===================== */}
      <div className="relative pt-20">
        <div className="absolute inset-0 h-64 bg-gradient-to-r from-green-600 via-green-500 to-blue-400"></div>

        <div className="relative max-w-7xl mx-auto px-6 pt-16">
          <div className="bg-white/95 backdrop-blur-md rounded-[2.5rem] shadow-2xl border border-white/20 p-8 flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <div className="p-1 bg-gradient-to-tr from-yellow-400 to-green-500 rounded-[2.8rem]">
                <img
                  src={storeData.seller.image || "https://via.placeholder.com/150"}
                  alt={storeData.seller.storeName}
                  className="w-32 h-32 md:w-44 md:h-44 rounded-[2.5rem] object-cover border-4 border-white shadow-inner"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-white p-2 rounded-2xl shadow-lg border-4 border-white">
                <ShieldCheck size={24} />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full mb-4">
                <Package size={16} />
                <span className="text-xs font-black uppercase tracking-widest">
                  Tienda Verificada
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">
                {storeData.seller.storeName}
              </h1>

              <p className="mt-4 text-slate-500 font-medium max-w-xl">
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
            className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-green-600 transition-colors"
          >
            <ArrowLeft size={18} />
            Volver a la tienda
          </button>
        )}

        {/* TÍTULO DINÁMICO */}
        <div className="flex items-center gap-3 mb-8">
          <div className="h-8 w-2 bg-green-500 rounded-full"></div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">
            {pageTitle}
          </h3>
        </div>


        {/* SUBRUTAS */}
        <Outlet context={{ sellerId: storeData.seller._id }} />

        {/* PRODUCTOS SOLO EN HOME */}
        {!isSubRoute && (
          <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 p-8 mt-10">
            <Productosvendedor vendedorId={storeData.seller._id} />
          </div>
        )}
      </main>


      <FooterStore />
    </div>
  );
}
