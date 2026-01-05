
import { useState } from "react";
import Products from "../../components/Products/products.jsx"; // Ajustada la ruta
import Tienda from "../Tienda.jsx"; // Componente que modificamos antes
import ProductosTienda from "../ProductosTienda.jsx";
import {
  ShieldCheck, Truck, Headphones, CreditCard, ChevronRight,
  Laptop, Shirt, Hammer, ShoppingCart, Home as HomeIcon, Heart,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

export default function HomeComprador() {
  const [vendedorSeleccionado, setVendedorSeleccionado] = useState(null);
  const [categoriaActiva, setCategoriaActiva] = useState("Todas");

  // Definición de categorías con los mismos estilos del Home original
  const categorias = [
    { name: "Todas", icon: <ShoppingCart size={28} />, gradient: "from-gray-50 to-gray-200", text: "text-gray-600" },
    { name: "Tecnología", icon: <Laptop size={28} />, gradient: "from-blue-50 to-blue-200", text: "text-blue-600" },
    { name: "Moda", icon: <Shirt size={28} />, gradient: "from-pink-50 to-pink-200", text: "text-pink-600" },
    { name: "Ferretería", icon: <Hammer size={28} />, gradient: "from-orange-50 to-orange-200", text: "text-orange-600" },
    { name: "Supermercado", icon: <ShoppingCart size={28} />, gradient: "from-green-50 to-green-200", text: "text-green-600" },
    { name: "Hogar", icon: <HomeIcon size={28} />, gradient: "from-purple-50 to-purple-200", text: "text-purple-600" },
    { name: "Belleza", icon: <Heart size={28} />, gradient: "from-red-50 to-red-200", text: "text-red-600" },
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-6 pb-20 font-sans">

      {/* 1. HERO SECTION (Banner Principal) */}
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
                className={`relative flex flex-col items-center justify-center min-w-[150px] h-[170px] rounded-[3rem] transition-all duration-500 group ${categoriaActiva === cat.name
                    ? "bg-white shadow-2xl shadow-blue-200/60 border-2 border-blue-500 transform -translate-y-3"
                    : "bg-white border border-gray-100 hover:border-blue-200 hover:shadow-xl hover:-translate-y-1"
                  }`}
              >
                <div className={`p-5 rounded-[2rem] mb-4 bg-gradient-to-br ${cat.gradient} ${cat.text} transition-all duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                  {cat.icon}
                </div>
                <span className={`text-sm font-black uppercase tracking-tighter ${categoriaActiva === cat.name ? "text-blue-600" : "text-gray-500"}`}>
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

      {/* 4. TIENDAS PREMIUM (Filtradas) */}
      {!vendedorSeleccionado && (
        <section id="tiendas" className="mb-24 scroll-mt-20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4 px-2">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-1 w-8 bg-blue-600 rounded-full"></div>
                <span className="text-blue-600 font-black text-xs uppercase tracking-widest">Tiendas Destacadas</span>
              </div>
              <h2 className="text-4xl font-black text-gray-900 leading-none">
                {categoriaActiva === "Todas" ? "Tiendas Premium" : `${categoriaActiva} Premium`}
              </h2>
            </div>
            {/* ENLACE AL DIRECTORIO QUE CREAMOS ANTES */}
            <Link to="/user/tienda" className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-colors">
              Ver todas las tiendas <ChevronRight size={18} />
            </Link>
          </div>

          {/* Busca esta parte en tu HomeComprador */}
          <Tienda
            setVendedorSeleccionado={setVendedorSeleccionado}
            filtroCategoria={categoriaActiva}
            soloPremium={true} // <--- CAMBIAR ESTO (antes decía soloAvanzados)
          />
        </section>
      )}

      {/* 5. VISTA DE PRODUCTOS DE UNA TIENDA SELECCIONADA */}
      {vendedorSeleccionado && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <ProductosTienda
            vendedorId={vendedorSeleccionado._id}
            volver={() => setVendedorSeleccionado(null)}
          />
        </div>
      )}

      {/* 6. PRODUCTOS DESTACADOS */}
      {!vendedorSeleccionado && (
        <section id="productos" className="mb-24">
          <h2 className="text-3xl font-black text-gray-900 mb-10 px-2 flex items-center gap-4">
            Productos Destacados <div className="h-px flex-1 bg-gray-100"></div>
          </h2>
          <Products />
        </section>
      )}

      {/* 7. CALL TO ACTION FINAL
      {!vendedorSeleccionado && (
        <div className="bg-[#111827] rounded-[3.5rem] p-10 md:p-20 text-center text-white mb-24 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Tu negocio en Cúcuta merece crecer</h2>
            <p className="text-gray-400 mb-10 max-w-2xl mx-auto text-lg leading-relaxed">
              Únete a nuestra plataforma y llega a miles de compradores locales hoy mismo.
            </p>
            <Link to="/register-vendedor" className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-[2rem] font-black text-lg transition-all inline-block shadow-2xl shadow-blue-600/40 transform hover:scale-105">
              Registrar mi Tienda
            </Link>
          </div>
        </div>
      )} */}
    </div>
  );
}

// Subcomponente para la barra de confianza
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