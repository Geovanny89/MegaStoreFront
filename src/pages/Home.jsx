import React, { useEffect, useState, Suspense, lazy, useMemo, memo } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ShieldCheck, Truck, Headphones, CreditCard, ChevronRight,
  Laptop, Shirt, Hammer, ShoppingCart, Home as HomeIcon, Heart,
  ArrowRight,
  LayoutGrid,
  Brush,
  Utensils,
  Baby,
  Dog,
  Car,
  FileText,
  Palette,
  Briefcase,
  Store,
  X
} from "lucide-react";
import Logo from "../assets/Logo31.png"
import baner from "../assets/baner.webp"

// Lazy load componentes pesados
const Products = lazy(() => import("../components/Products/products.jsx"));
const Tienda = lazy(() => import("./Tienda.jsx"));
const ProductosTienda = lazy(() => import("./ProductosTienda.jsx"));

// 1. Memoizamos TrustItem para evitar re-renders innecesarios
const TrustItem = memo(({ icon, title, desc }) => (
  <div className="flex-shrink-0 w-[250px] md:w-auto snap-center bg-white dark:bg-[#020617] rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center transition-all hover:shadow-xl hover:border-blue-200">
    <div className="mb-3">{icon}</div>
    <h4 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-1">{title}</h4>
    <p className="text-gray-500 text-sm">{desc}</p>
  </div>
));

export default function Home() {
  const [vendedorSeleccionado, setVendedorSeleccionado] = useState(null);
  const [categoriaActiva, setCategoriaActiva] = useState("Todas");
  const [showPromoModal, setShowPromoModal] = useState(false);
  const location = useLocation();

  // Lógica para resetear estados al volver al inicio
  useEffect(() => {
    if (location.pathname === "/") {
      setVendedorSeleccionado(null);
      setCategoriaActiva("Todas");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.pathname, location.key]);

  // Lógica para el Modal Publicitario (Aparece 1 vez por sesión)
  useEffect(() => {
    const hasSeenPromo = sessionStorage.getItem("hasSeenKdicePromo");
    if (!hasSeenPromo) {
      // Aumentamos ligeramente el tiempo a 2s para no bloquear la carga inicial crítica
      const timer = setTimeout(() => {
        setShowPromoModal(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const cerrarModal = () => {
    setShowPromoModal(false);
    sessionStorage.setItem("hasSeenKdicePromo", "true");
  };

  // 2. Usamos useMemo para que el array de categorías no se recree en cada render
  const categorias = useMemo(() => [
    { name: "Todas", icon: <LayoutGrid size={28} />, gradient: "from-gray-50 to-gray-200 dark:from-gray-800 dark:to-gray-700", text: "text-gray-600" },
    { name: "Tecnología y Electrónica", icon: <Laptop size={28} />, gradient: "from-gray-50 to-gray-200 dark:from-gray-800 dark:to-gray-700", text: "text-blue-600" },
    { name: "Moda y Accesorios", icon: <Shirt size={28} />, gradient: "from-gray-50 to-gray-200 dark:from-gray-800 dark:to-gray-700", text: "text-pink-600" },
    { name: "Hogar y Muebles", icon: <HomeIcon size={28} />, gradient: "from-gray-50 to-gray-200 dark:from-gray-800 dark:to-gray-700", text: "text-purple-600" },
    { name: "Salud y Belleza", icon: <Brush size={28} />, gradient: "from-gray-50 to-gray-200 dark:from-gray-800 dark:to-gray-700", text: "text-rose-600" },
    { name: "Deportes y Fitness", icon: <Heart size={28} />, gradient: "from-gray-50 to-gray-200 dark:from-gray-800 dark:to-gray-700", text: "text-red-600" },
    { name: "Supermercado y Alimentos", icon: <ShoppingCart size={28} />, gradient: "from-gray-50 to-gray-200 dark:from-gray-800 dark:to-gray-700", text: "text-green-600" },
    { name: "Restaurantes y Gastronomía", icon: <Utensils size={28} />, gradient: "from-gray-50 to-gray-200 dark:from-gray-800 dark:to-gray-700", text: "text-orange-600" },
    { name: "Juguetes y Bebés", icon: <Baby size={28} />, gradient: "from-gray-50 to-gray-200 dark:from-gray-800 dark:to-gray-700", text: "text-yellow-600" },
    { name: "Mascotas", icon: <Dog size={28} />, gradient: "from-gray-50 to-gray-200 dark:from-gray-800 dark:to-gray-700", text: "text-amber-600" },
    { name: "Ferretería y Construcción", icon: <Hammer size={28} />, gradient: "from-gray-50 to-gray-200 dark:from-gray-800 dark:to-gray-700", text: "text-stone-600" },
    { name: "Automotriz", icon: <Car size={28} />, gradient: "from-gray-50 to-gray-200 dark:from-gray-800 dark:to-gray-700", text: "text-slate-600" },
    { name: "Papelería y Oficina", icon: <FileText size={28} />, gradient: "from-gray-50 to-gray-200 dark:from-gray-800 dark:to-gray-700", text: "text-indigo-600" },
    { name: "Arte y Artesanías", icon: <Palette size={28} />, gradient: "from-gray-50 to-gray-200 dark:from-gray-800 dark:to-gray-700", text: "text-violet-600" },
    { name: "Servicios Profesionales", icon: <Briefcase size={28} />, gradient: "from-gray-50 to-gray-200 dark:from-gray-800 dark:to-gray-700", text: "text-cyan-600" },
  ], []);

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-6 pb-20 font-sans text-gray-900 dark:text-gray-100">

      {/* 1. HERO SECTION - OPTIMIZADA */}
     <div
  className={`relative w-full h-[500px] rounded-[3rem] overflow-hidden shadow-2xl mb-16 group
  ${vendedorSeleccionado ? "hidden" : ""}`}
>
<img
  src={baner}
  alt="Marketplace Banner"
  width="1200"
  height="800"
  fetchpriority="high"
  decoding="async"
  className="absolute inset-0 w-full h-full object-cover"
/>

  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex flex-col justify-center px-8 md:px-20">
    <div className="inline-flex items-center gap-2 bg-blue-600/20 backdrop-blur-md border border-blue-500/30 text-blue-400 px-4 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-6 w-fit">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
      </span>
      El marketplace que impulsa negocios
    </div>

    <h1 className="text-white text-5xl md:text-7xl font-black leading-[1.1] max-w-2xl mb-8">
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
        Tus tiendas.
      </span>
    </h1>

    <div className="flex flex-wrap gap-4">
      <a
        href="#tiendas"
        className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-bold transition-all transform hover:scale-105 shadow-lg shadow-blue-600/30 flex items-center gap-2"
      >
        Explorar Tiendas <ArrowRight size={20} />
      </a>

      <Link
        to="/register-vendedor"
        className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-10 py-4 rounded-2xl font-bold border border-white/20 transition-all"
      >
        Vender aquí
      </Link>
    </div>
  </div>
</div>


      {/* 2. SECCIÓN DE CATEGORÍAS */}
      {!vendedorSeleccionado && (
        <section className="mb-20">
          <div className="flex items-end justify-between mb-10 px-2">
            <div>
              <h3 className="text-3xl font-black text-gray-900 dark:text-gray-100">Busca por Sector</h3>
              <p className="text-gray-500 font-medium">Los mejores comercios organizados para ti</p>
            </div>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide px-2">
            {categorias.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setCategoriaActiva(cat.name)}
                className={`relative flex flex-col items-center justify-center min-w-[160px] h-[180px] rounded-[3rem] transition-all duration-500 group snap-center
                ${categoriaActiva === cat.name
                    ? "bg-white dark:bg-[#0f172a] shadow-2xl shadow-blue-200/60 dark:shadow-none border-2 border-blue-500 transform -translate-y-3"
                    : "bg-white dark:bg-[#020617] border border-gray-100 dark:border-gray-800 hover:border-blue-200"
                  }`}
              >
                <div className={`p-5 rounded-[2rem] mb-4 bg-gradient-to-br ${cat.gradient} ${cat.text} transition-all duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                  {cat.icon}
                </div>
                <span className="text-[10px] px-2 text-center font-black uppercase tracking-tighter leading-tight">
                  {cat.name}
                </span>
                {categoriaActiva === cat.name && (
                  <div className="absolute -bottom-2 w-10 h-1.5 bg-blue-500 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* 3. BARRA DE CONFIANZA */}
      {!vendedorSeleccionado && (
        <section className="mb-16 px-2">
          <div className="flex overflow-x-auto pb-4 gap-4 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-4 md:overflow-visible">
            <TrustItem icon={<ShieldCheck size={24} className="text-blue-600" />} title="Compra Segura" desc="Garantía total" />
            <TrustItem icon={<Truck size={24} className="text-blue-600" />} title="Envíos Locales" desc="Entrega rápida" />
            <TrustItem icon={<CreditCard size={24} className="text-blue-600" />} title="Pagos Fáciles" desc="Todo medio de pago" />
            <TrustItem icon={<Headphones size={24} className="text-blue-600" />} title="Soporte 24/7" desc="Atención inmediata" />
          </div>
        </section>
      )}

      {/* 4. SECCIÓN DE TIENDAS (Lazy Loaded) */}
      {!vendedorSeleccionado && (
        <section id="tiendas" className="mb-24 scroll-mt-20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4 px-2">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-1 w-8 bg-blue-600 rounded-full"></div>
                <span className="text-blue-600 font-black text-xs uppercase tracking-widest">Exclusivo</span>
              </div>
              <h2 className="text-4xl font-black leading-none text-gray-900 dark:text-gray-100">
                {categoriaActiva === "Todas" ? "Tiendas Destacadas" : categoriaActiva}
              </h2>
            </div>
            <Link to="/tiendas" className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-colors">
              Ver el directorio <ChevronRight size={18} />
            </Link>
          </div>
          <Suspense fallback={<div className="h-40 flex items-center justify-center">Cargando tiendas...</div>}>
            <Tienda setVendedorSeleccionado={setVendedorSeleccionado} filtroCategoria={categoriaActiva} soloPremium={true} esCarrusel={true} limite={12} />
          </Suspense>
        </section>
      )}

      {/* 5. PRODUCTOS DE TIENDA SELECCIONADA */}
      {vendedorSeleccionado && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Suspense fallback={<div className="h-40 flex items-center justify-center">Cargando catálogo...</div>}>
            <ProductosTienda vendedorId={vendedorSeleccionado._id} volver={() => setVendedorSeleccionado(null)} />
          </Suspense>
        </div>
      )}

      {/* 6. PRODUCTOS DESTACADOS GENERALES */}
      {!vendedorSeleccionado && (
        <section id="productos" className="mb-24">
          <h2 className="text-3xl font-black mb-10 px-2 flex items-center gap-4 text-gray-900 dark:text-gray-100">
            Productos <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800"></div>
          </h2>
          <Suspense fallback={<div className="h-40 flex items-center justify-center">Cargando productos...</div>}>
            <Products />
          </Suspense>
        </section>
      )}

      {/* 7. CALL TO ACTION FINAL */}
      {!vendedorSeleccionado && (
        <div className="bg-[#111827] rounded-[3.5rem] p-10 md:p-20 text-center text-white mb-24 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black mb-6">¿Tu negocio aún no está aquí?</h2>
            <p className="text-gray-400 mb-10 max-w-2xl mx-auto text-lg leading-relaxed">
              Únete a la red comercial más grande. Digitaliza tu tienda y aumenta tus ventas hoy mismo.
            </p>
            <Link to="/register-vendedor" className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white px-12 py-5 rounded-[2rem] font-black text-lg transition-all duration-300 hover:scale-[1.02]">
              Empezar ahora
            </Link>
          </div>
        </div>
      )}

      {/* 8. MODAL PUBLICITARIO - SIN SCROLL Y OPTIMIZADO */}
      {showPromoModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative bg-gradient-to-br from-blue-600 to-purple-700 w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 border-2 border-white/40 flex flex-col">

            <button
              onClick={cerrarModal}
              className="absolute top-4 right-4 z-20 bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors"
            >
              <X className="text-white" size={18} />
            </button>

            <div className="p-5 sm:p-10 text-center text-white flex flex-col items-center gap-3 sm:gap-5">
              <h3 className="text-2xl sm:text-4xl font-black leading-tight drop-shadow-lg">
                ¡Tu Venta <span className="text-yellow-300">100%</span> para ti!
              </h3>

              <p className="text-sm sm:text-lg font-bold text-green-300 uppercase tracking-wide">
                CERO COMISIONES
              </p>

              <img
                src={Logo}
                alt="K-Dice"
                width="256"
                height="128"
                loading="lazy"
                className="
    w-40 sm:w-56
    max-h-[100px] sm:max-h-[140px]
    object-contain
    drop-shadow-2xl
    my-2 sm:my-4
    transition-transform
    hover:scale-105
  "
              />


              <p className="text-xs sm:text-base leading-relaxed opacity-90 max-w-[280px] sm:max-w-full">
                ¡Es hora de que tu esfuerzo valga el 100%! Quédate con cada centavo. **5 días GRATIS**.
              </p>

              <Link
                to="/register-vendedor"
                onClick={cerrarModal}
                className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-300 text-blue-900 px-6 py-3.5 sm:px-10 sm:py-4 rounded-2xl font-black text-base sm:text-xl transition-all shadow-lg active:scale-95"
              >
                ¡Quiero mis 5 días GRATIS!
              </Link>

              <p className="text-white/60 text-[10px] sm:text-xs">
                Sin tarjeta de crédito. Sin compromiso.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}