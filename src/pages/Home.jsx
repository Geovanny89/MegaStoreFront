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
  Briefcase
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  const [vendedorSeleccionado, setVendedorSeleccionado] = useState(null);
  const [categoriaActiva, setCategoriaActiva] = useState("Todas");
  useEffect(() => {
    sessionStorage.setItem("entryOrigin", "global");
  }, []);
 
  const categorias = [
    { name: "Todas", icon: <LayoutGrid size={28} />, gradient: "from-gray-50 to-gray-200", text: "text-gray-600" },
    { name: "Tecnología y Electrónica", icon: <Laptop size={28} />, gradient: "from-blue-50 to-blue-200", text: "text-blue-600" },
    { name: "Moda y Accesorios", icon: <Shirt size={28} />, gradient: "from-pink-50 to-pink-200", text: "text-pink-600" },
    { name: "Hogar y Muebles", icon: <HomeIcon size={28} />, gradient: "from-purple-50 to-purple-200", text: "text-purple-600" },
    { name: "Salud y Belleza", icon: <Brush size={28} />, gradient: "from-rose-50 to-rose-200", text: "text-rose-600" },
    { name: "Deportes y Fitness", icon: <Heart size={28} />, gradient: "from-red-50 to-red-200", text: "text-red-600" },
    { name: "Supermercado y Alimentos", icon: <ShoppingCart size={28} />, gradient: "from-green-50 to-green-200", text: "text-green-600" },
    { name: "Restaurantes y Gastronomía", icon: <Utensils size={28} />, gradient: "from-orange-50 to-orange-200", text: "text-orange-600" },
    { name: "Juguetes y Bebés", icon: <Baby size={28} />, gradient: "from-yellow-50 to-yellow-200", text: "text-yellow-600" },
    { name: "Mascotas", icon: <Dog size={28} />, gradient: "from-amber-50 to-amber-200", text: "text-amber-600" },
    { name: "Ferretería y Construcción", icon: <Hammer size={28} />, gradient: "from-stone-50 to-stone-200", text: "text-stone-600" },
    { name: "Automotriz", icon: <Car size={28} />, gradient: "from-slate-50 to-slate-200", text: "text-slate-600" },
    { name: "Papelería y Oficina", icon: <FileText size={28} />, gradient: "from-indigo-50 to-indigo-200", text: "text-indigo-600" },
    { name: "Arte y Artesanías", icon: <Palette size={28} />, gradient: "from-violet-50 to-violet-200", text: "text-violet-600" },
    { name: "Servicios Profesionales", icon: <Briefcase size={28} />, gradient: "from-cyan-50 to-cyan-200", text: "text-cyan-600" },
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-6 pb-20 font-sans">
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
              <Link to="/register-vendedor" className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-10 py-4 rounded-2xl font-bold border border-white/20 transition-all">
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
              <h3 className="text-3xl font-black text-gray-900 tracking-tight">Busca por Sector</h3>
              <p className="text-gray-500 font-medium">Los mejores comercios organizados para ti</p>
            </div>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide px-2">
            {categorias.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setCategoriaActiva(cat.name)}
                className={`relative flex flex-col items-center justify-center min-w-[160px] h-[180px] rounded-[3rem] transition-all duration-500 group snap-center ${categoriaActiva === cat.name
                    ? "bg-white shadow-2xl shadow-blue-200/60 border-2 border-blue-500 transform -translate-y-3"
                    : "bg-white border border-gray-100 hover:border-blue-200"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          <TrustItem icon={<ShieldCheck size={28} className="text-blue-600" />} title="Compra Segura" desc="Protección garantizada" />
          <TrustItem icon={<Truck size={28} className="text-blue-600" />} title="Envíos Locales" desc="Entregas el mismo día" />
          <TrustItem icon={<CreditCard size={28} className="text-blue-600" />} title="Pagos Fáciles" desc="Múltiples métodos" />
          <TrustItem icon={<Headphones size={28} className="text-blue-600" />} title="Soporte 24/7" desc="Siempre disponibles" />
        </div>
      )}

      {/* 4. SECCIÓN DE TIENDAS (TRIAL + PREMIUM) */}
      {!vendedorSeleccionado && (
        <section id="tiendas" className="mb-24 scroll-mt-20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4 px-2">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-1 w-8 bg-blue-600 rounded-full"></div>
                <span className="text-blue-600 font-black text-xs uppercase tracking-widest">Exclusivo</span>
              </div>
              <h2 className="text-4xl font-black text-gray-900 leading-none">
                {categoriaActiva === "Todas" ? "Tiendas Destacadas" : `${categoriaActiva}`}
              </h2>
            </div>
            <Link to="/tiendas" className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-colors">
              Ver el directorio <ChevronRight size={18} />
            </Link>
          </div>

          <Tienda
            setVendedorSeleccionado={setVendedorSeleccionado}
            filtroCategoria={categoriaActiva === "Todas" ? "Todas" : categoriaActiva}
            soloPremium={true} 
          />
        </section>
      )}

      {/* 5. PRODUCTOS DE TIENDA SELECCIONADA */}
      {vendedorSeleccionado && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <ProductosTienda
            vendedorId={vendedorSeleccionado._id}
            volver={() => setVendedorSeleccionado(null)}
          />
        </div>
      )}

      {/* 6. PRODUCTOS DESTACADOS GENERALES */}
      {!vendedorSeleccionado && (
        <section id="productos" className="mb-24">
          <h2 className="text-3xl font-black text-gray-900 mb-10 px-2 flex items-center gap-4">
            Nuevos Productos <div className="h-px flex-1 bg-gray-100"></div>
          </h2>
          <Products />
        </section>
      )}

      {/* 7. CALL TO ACTION */}
      {!vendedorSeleccionado && (
        <div className="bg-[#111827] rounded-[3.5rem] p-10 md:p-20 text-center text-white mb-24 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-600/10 rounded-full blur-[80px]"></div>

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black mb-6">¿Tu negocio aún no está aquí?</h2>
            <p className="text-gray-400 mb-10 max-w-2xl mx-auto text-lg leading-relaxed">
              Únete a la red comercial más grande. Digitaliza tu tienda y aumenta tus ventas hoy mismo.
            </p>
            <Link to="/planes" className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-[2rem] font-black text-lg transition-all inline-block shadow-2xl shadow-blue-600/40 transform hover:scale-105">
              Empezar ahora
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function TrustItem({ icon, title, desc }) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-50 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all flex items-center gap-6 group">
      <div className="bg-blue-50 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>
      <div>
        <h5 className="font-black text-gray-900 text-sm uppercase tracking-tight">{title}</h5>
        <p className="text-xs text-gray-500 font-medium">{desc}</p>
      </div>
    </div>
  );
}