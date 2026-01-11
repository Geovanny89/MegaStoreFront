import { useEffect, useState } from "react";
import Products from "../components/Products/products.jsx";
import Tienda from "./Tienda.jsx";
import ProductosTienda from "./ProductosTienda.jsx";
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
import { Link, useLocation } from "react-router-dom";

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
      const timer = setTimeout(() => {
        setShowPromoModal(true);
      }, 1500); // Aparece 1.5 segundos después de cargar
      return () => clearTimeout(timer);
    }
  }, []);

  const cerrarModal = () => {
    setShowPromoModal(false);
    sessionStorage.setItem("hasSeenKdicePromo", "true");
  };

  const categorias = [
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
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-6 pb-20 font-sans text-gray-900 dark:text-gray-100">

      {/* 1. HERO SECTION */}
      {!vendedorSeleccionado && (
        <div className="relative w-full h-[500px] rounded-[3rem] overflow-hidden shadow-2xl mb-16 group">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            alt="Marketplace Banner"
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
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Tus tiendas.</span>
            </h1>
            <div className="flex flex-wrap gap-4">
              <a href="#tiendas" className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-bold transition-all transform hover:scale-105 shadow-lg shadow-blue-600/30 flex items-center gap-2">
                Explorar Tiendas <ArrowRight size={20} />
              </a>
              <Link to="/register" className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-10 py-4 rounded-2xl font-bold border border-white/20 transition-all">
                Vender aquí
              </Link>
            </div>
          </div>
        </div>
      )}

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

      {/* 4. SECCIÓN DE TIENDAS */}
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
          <Tienda setVendedorSeleccionado={setVendedorSeleccionado} filtroCategoria={categoriaActiva} soloPremium={true} esCarrusel={true} limite={12} />
        </section>
      )}

      {/* 5. PRODUCTOS DE TIENDA SELECCIONADA */}
      {vendedorSeleccionado && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <ProductosTienda vendedorId={vendedorSeleccionado._id} volver={() => setVendedorSeleccionado(null)} />
        </div>
      )}

      {/* 6. PRODUCTOS DESTACADOS GENERALES */}
      {!vendedorSeleccionado && (
        <section id="productos" className="mb-24">
          <h2 className="text-3xl font-black mb-10 px-2 flex items-center gap-4 text-gray-900 dark:text-gray-100">
            Productos <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800"></div>
          </h2>
          <Products />
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
            <Link to="/register" className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white px-12 py-5 rounded-[2rem] font-black text-lg transition-all duration-300 hover:scale-[1.02]">
              Empezar ahora
            </Link>
          </div>
        </div>
      )}

      {/* 8. MODAL PUBLICITARIO (K-DICE PROMO) */}
      {showPromoModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            
            <button onClick={cerrarModal} className="absolute top-6 right-6 z-20 bg-black/5 hover:bg-black/10 dark:bg-white/10 p-2 rounded-full transition-colors">
              <X className="text-slate-800 dark:text-white" size={20} />
            </button>

            <div className="relative h-44 bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-10 -translate-y-10 blur-3xl"></div>
              </div>
              <Store size={80} className="text-white/20 absolute -left-4 -bottom-4 rotate-12" />
              <div className="relative text-center">
                <div className="bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-black uppercase tracking-[0.3em] py-1 px-4 rounded-full mb-3 inline-block">
                  Oferta de Lanzamiento
                </div>
                <h3 className="text-white text-3xl font-black">¡Impulsa tu Negocio!</h3>
              </div>
            </div>

            <div className="p-8 md:p-10 text-center">
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4 text-left bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-800/50">
                  <div className="bg-blue-600 text-white p-2 rounded-xl mt-1"><ShieldCheck size={20}/></div>
                  <div>
                    <p className="font-black text-blue-900 dark:text-blue-100 leading-tight">Prueba 5 días GRATIS</p>
                    <p className="text-xs text-blue-700 dark:text-blue-300 font-medium mt-1">Regístrate y prueba todas las funciones sin costo.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 text-left bg-green-50 dark:bg-green-900/20 p-4 rounded-2xl border border-green-100 dark:border-green-800/50">
                  <div className="bg-green-600 text-white p-2 rounded-xl mt-1"><CreditCard size={20}/></div>
                  <div>
                    <p className="font-black text-green-900 dark:text-green-100 leading-tight">50% DCTO por 2 meses</p>
                    <p className="text-xs text-green-700 dark:text-green-300 font-medium mt-1">Aprovecha el descuento especial en tu suscripción.</p>
                  </div>
                </div>

                <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-2xl">
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">🚀 CERO COMISIONES</p>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-200">
                    Pago directo <span className="font-bold">Vendedor ➔ Cliente</span>. ¡Toda la ganancia es tuya!
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Link to="/register-vendedor" onClick={cerrarModal} className="w-full bg-blue-600 hover:bg-slate-900 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-blue-100 dark:shadow-none flex items-center justify-center gap-2 uppercase tracking-widest text-sm">
                  Registrarse ahora <ArrowRight size={18} />
                </Link>
                <button onClick={cerrarModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold transition-colors">
                  Quizás más tarde
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TrustItem({ icon, title, desc }) {
  return (
    <div className="flex-none w-[260px] md:w-full snap-center bg-white dark:bg-[#0f172a] p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
      <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-2xl flex-shrink-0">{icon}</div>
      <div className="text-left">
        <h5 className="font-bold text-gray-900 dark:text-gray-100 text-sm">{title}</h5>
        <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">{desc}</p>
      </div>
    </div>
  );
}