import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; 
import Tienda from "../../pages/Tienda"; 

import api from "../../api/axios";
import { ChevronLeft, ChevronRight, Search, Store, ArrowLeft } from "lucide-react";
import ProductosTienda from "../../pages/ProductosTienda";

export default function TodasTiendas() {
  const [tiendas, setTiendas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Este es el estado que controlará si vemos el directorio o la tienda específica
  const [vendedorSeleccionado, setVendedorSeleccionado] = useState(null);

  // --- ESTADOS DE PAGINACIÓN ---
  const [paginaActual, setPaginaActual] = useState(1);
  const tiendasPorPagina = 12;

  useEffect(() => {
    fetchTiendas();
  }, []);

  const fetchTiendas = async () => {
    try {
      setLoading(true);
      const res = await api.get("/vendedor/all");

      /* ==================== LÓGICA DE ORDENAMIENTO PRIORITARIO ==================== */
      const ordenadas = [...res.data].sort((a, b) => {
        const planA = a.subscriptionPlan?.nombre?.toLowerCase() || a.planId?.nombre?.toLowerCase() || "";
        const planB = b.subscriptionPlan?.nombre?.toLowerCase() || b.planId?.nombre?.toLowerCase() || "";
        
        const esTopA = (planA === "premium" || planA === "avanzado") ? 1 : 0;
        const esTopB = (planB === "premium" || planB === "avanzado") ? 1 : 0;
        
        if (esTopA !== esTopB) return esTopB - esTopA;
        return a.storeName.localeCompare(b.storeName);
      });

      setTiendas(ordenadas);
    } catch (error) {
      console.error("Error cargando el directorio:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- LÓGICA DE FILTRADO ---
  const tiendasFiltradas = tiendas.filter((t) =>
    t.storeName?.toLowerCase().includes(busqueda.toLowerCase())
  );

  // --- LÓGICA DE PAGINACIÓN ---
  const ultimoIndice = paginaActual * tiendasPorPagina;
  const primerIndice = ultimoIndice - tiendasPorPagina;
  const tiendasPaginadas = tiendasFiltradas.slice(primerIndice, ultimoIndice);
  const totalPaginas = Math.ceil(tiendasFiltradas.length / tiendasPorPagina);

  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const manejarBusqueda = (e) => {
    setBusqueda(e.target.value);
    setPaginaActual(1);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-500 font-medium">Cargando directorio oficial...</p>
      </div>
    );
  }

  /* ==================== RENDERIZADO CONDICIONAL ==================== */
  // Si el usuario hizo clic en una tienda, mostramos sus productos
  if (vendedorSeleccionado) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-10 font-sans animate-in fade-in slide-in-from-bottom-4 duration-700">
        <ProductosTienda
          vendedorId={vendedorSeleccionado._id}
          volver={() => setVendedorSeleccionado(null)} // Función para regresar al listado
        />
      </div>
    );
  }

  // Si no hay vendedor seleccionado, mostramos el Directorio normal
  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-10 font-sans">
      
      {/* 1. BOTÓN VOLVER AL HOME */}
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 font-bold mb-8 transition-colors group"
      >
        <div className="p-2 rounded-xl bg-gray-100 group-hover:bg-blue-50 transition-colors">
            <ArrowLeft size={20} />
        </div>
        Volver al Inicio
      </Link>

      {/* 2. CABECERA */}
      <div className="mb-12 border-b border-gray-100 pb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
  <div>
    <div className="flex items-center gap-3 mb-2">
      <div className="h-1 w-10 bg-blue-600 dark:bg-blue-500 rounded-full"></div>
      <span className="text-blue-600 dark:text-blue-400 font-black text-xs uppercase tracking-widest">
        Marketplace
      </span>
    </div>

    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4
      text-gray-900 dark:text-gray-100">
      Directorio de Tiendas
    </h1>

    <p className="text-lg max-w-xl font-medium
      text-gray-500 dark:text-gray-400">
      Explora y encuentra tus comercios favoritos.
    </p>
  </div>

  <div className="relative w-full md:w-96">
    <Search
      className="absolute left-4 top-1/2 -translate-y-1/2
      text-gray-400 dark:text-gray-500"
      size={20}
    />

    <input
      type="text"
      placeholder="Buscar tienda por nombre..."
      value={busqueda}
      onChange={manejarBusqueda}
      className="
        w-full pl-12 pr-4 py-4 rounded-2xl font-medium shadow-sm
        transition-all outline-none

        bg-gray-50 dark:bg-[#0f172a]
        border border-gray-200 dark:border-gray-700

        text-gray-900 dark:text-gray-100
        placeholder-gray-400 dark:placeholder-gray-500

        focus:ring-2 focus:ring-blue-500
        focus:border-transparent
      "
    />
  </div>
</div>

      </div>

      {/* 3. RESULTADOS */}
      <section className="min-h-[400px]">
        {tiendasFiltradas.length > 0 ? (
          <Tienda
            vendedoresData={tiendasPaginadas} 
            setVendedorSeleccionado={setVendedorSeleccionado} // Se activa al dar clic en el botón de la card
            soloPremium={false} 
          />
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
            <Store className="mx-auto text-gray-300 mb-4" size={64} />
            <h3 className="text-xl font-bold text-gray-700">No encontramos resultados</h3>
            <p className="text-gray-500">Intenta con otro nombre o revisa la ortografía.</p>
          </div>
        )}
      </section>

      {/* 4. PAGINACIÓN */}
      {totalPaginas > 1 && (
        <div className="mt-16 flex justify-center items-center gap-2">
          <button
            onClick={() => cambiarPagina(paginaActual - 1)}
            disabled={paginaActual === 1}
            className={`p-3 rounded-xl border ${paginaActual === 1 ? 'text-gray-300 border-gray-100' : 'text-blue-600 border-blue-100 hover:bg-blue-50 transition-colors'}`}
          >
            <ChevronLeft size={24} />
          </button>

          <div className="flex gap-2 hidden sm:flex">
            {[...Array(totalPaginas)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => cambiarPagina(index + 1)}
                className={`w-12 h-12 rounded-xl font-bold transition-all ${
                  paginaActual === index + 1
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                    : "bg-white text-gray-600 border border-gray-100 hover:border-blue-300"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => cambiarPagina(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
            className={`p-3 rounded-xl border ${paginaActual === totalPaginas ? 'text-gray-300 border-gray-100' : 'text-blue-600 border-blue-100 hover:bg-blue-50 transition-colors'}`}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </div>
  );
}