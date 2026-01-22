import { useEffect, useState } from "react";
import Products from "../../components/Products/products.jsx";
import Tienda from "../Tienda.jsx";
import ProductosTienda from "../ProductosTienda.jsx";
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

export default function HomeComprador() {
  const [vendedorSeleccionado, setVendedorSeleccionado] = useState(null);
  const [categoriaActiva, setCategoriaActiva] = useState("Todas");
  const [paginaTiendas, setPaginaTiendas] = useState(0);
const [hasNextPage, setHasNextPage] = useState(false);


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
  
useEffect(() => {
  setPaginaTiendas(0);
  setHasNextPage(false);
}, [categoriaActiva]);

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-6 pb-20 font-sans
                    text-gray-900 dark:text-gray-100">
    
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
                  <h3 className="text-3xl font-black text-gray-900 dark:text-gray-100">
                    Busca por Sector</h3>
                  <p className="text-gray-500 font-medium">Los mejores comercios organizados para ti</p>
                </div>
              </div>
    
              <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide px-2">
                {categorias.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setCategoriaActiva(cat.name)}
                    className={`relative flex flex-col items-center justify-center min-w-[160px] h-[180px]
    rounded-[3rem] transition-all duration-500 group snap-center
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
              {/* Contenedor con scroll horizontal en móvil, grid normal en PC */}
              <div className="flex overflow-x-auto pb-4 gap-4 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-4 md:overflow-visible">
                <TrustItem
                  icon={<ShieldCheck size={24} className="text-blue-600" />}
                  title="Compra Segura"
                  desc="Garantía total"
                />
                <TrustItem
                  icon={<Truck size={24} className="text-blue-600" />}
                  title="Envíos Locales"
                  desc="Entrega rápida"
                />
                <TrustItem
                  icon={<CreditCard size={24} className="text-blue-600" />}
                  title="Pagos Fáciles"
                  desc="Todo medio de pago"
                />
                <TrustItem
                  icon={<Headphones size={24} className="text-blue-600" />}
                  title="Soporte 24/7"
                  desc="Atención inmediata"
                />
              </div>
            </section>
          )}
    
          {/* 4. SECCIÓN DE TIENDAS (TRIAL + PREMIUM) */}
          {!vendedorSeleccionado && (
            <section id="tiendas" className="mb-24 scroll-mt-20">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4 px-2">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-1 w-8 bg-blue-600 rounded-full"></div>
                    <span className="text-blue-600 font-black text-xs uppercase tracking-widest">
                      Exclusivo
                    </span>
                  </div>
    
                  <h2 className="text-4xl font-black leading-none
                           text-gray-900 dark:text-gray-100">
                    {categoriaActiva === "Todas"
                      ? "Tiendas Destacadas"
                      : categoriaActiva}
                  </h2>
                </div>
    
                <Link
                  to="/tiendas"
                  className="bg-gray-100 dark:bg-gray-800
                       hover:bg-gray-200 dark:hover:bg-gray-700
                       text-gray-700 dark:text-gray-200
                       px-6 py-3 rounded-2xl font-bold
                       flex items-center gap-2 transition-colors"
                >
                  Ver el directorio <ChevronRight size={18} />
                </Link>
              </div>
    
             <Tienda
  setVendedorSeleccionado={setVendedorSeleccionado}
  filtroCategoria={categoriaActiva}
  soloPremium
  limite={6}
  pagina={paginaTiendas}
  onHasNextPage={setHasNextPage}
/>
<div className="flex justify-center items-center gap-4 mt-10">

  {/* Anterior */}
  <button
    onClick={() => setPaginaTiendas(p => Math.max(p - 1, 0))}
    disabled={paginaTiendas === 0}
    className="
      px-5 py-2 rounded-full text-sm font-bold
      bg-gray-100 dark:bg-gray-800
      text-gray-700 dark:text-gray-300
      hover:bg-gray-200 dark:hover:bg-gray-700
      disabled:opacity-40 disabled:cursor-not-allowed
      transition
    "
  >
    Anterior
  </button>

  {/* Página actual */}
  <span className="
    min-w-[80px] text-center text-sm font-bold
    text-gray-600 dark:text-gray-400
  ">
    Página {paginaTiendas + 1}
  </span>

  {/* Siguiente */}
  <button
    onClick={() => setPaginaTiendas(p => p + 1)}
    disabled={!hasNextPage}
    className={`
      px-5 py-2 rounded-full text-sm font-bold
      transition
      ${hasNextPage
        ? "bg-blue-600 text-white hover:bg-blue-700"
        : "bg-blue-600/40 text-white/70 cursor-not-allowed"
      }
    `}
  >
    Siguiente
  </button>

</div>

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
              <h2
                className="text-3xl font-black mb-10 px-2
                     flex items-center gap-4
                     text-gray-900 dark:text-gray-100"
              >
                Productos
                <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800"></div>
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
                <Link to="/planes" className="
        inline-flex items-center justify-center
        bg-blue-600 hover:bg-blue-500
        text-white px-12 py-5
        rounded-[2rem] font-black text-lg
        transition-all duration-300
        ring-1 ring-blue-400/30
        hover:ring-blue-400/60
        hover:scale-[1.02] active:scale-[0.98]
      ">
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
    <div className="flex-none w-[220px] md:w-full snap-center
                    bg-white dark:bg-gray-950 
                    p-4 md:p-6 rounded-[2rem] 
                    border border-gray-100 dark:border-gray-800 
                    flex items-center gap-3 md:gap-4 
                    hover:shadow-lg transition-all">
      <div className="bg-blue-50 dark:bg-blue-900/30 p-2 md:p-3 rounded-xl flex-shrink-0">
        {/* Ajustamos el tamaño del icono para móvil */}
        <div className="scale-90 md:scale-100">
          {icon}
        </div>
      </div>
      <div className="min-w-0"> {/* Evita que el texto rompa el layout */}
        <h5 className="font-bold text-gray-900 dark:text-gray-100 text-xs md:text-sm truncate">
          {title}
        </h5>
        <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 truncate">
          {desc}
        </p>
      </div>
    </div>
  );
}