import { useEffect, useState } from "react";
import api from "../api/axios";
import { Store } from "lucide-react";

// 1. Recibimos filtroCategoria como prop
export default function Tienda({ setVendedorSeleccionado, filtroCategoria }) {
  const [vendedores, setVendedores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendedores = async () => {
      try {
        setLoading(true);
        const res = await api.get("/vendedor/all");
        setVendedores(res.data);
      } catch (e) {
        console.error("Error cargando tiendas:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchVendedores();
  }, []);

  // 2. LÓGICA DE FILTRADO:
  // Si la categoría es "Todas", mostramos todos. 
  // Si no, comparamos el storeCategory del vendedor con el filtro seleccionado.
  // Filtro mejorado en Tienda.jsx
const vendedoresFiltrados = filtroCategoria === "Todas" 
  ? vendedores 
  : vendedores.filter(v => 
      v.storeCategory?.trim().toLowerCase() === filtroCategoria.trim().toLowerCase()
    );
  if (loading) return <div className="text-center py-10 text-gray-500">Cargando tiendas oficiales...</div>;

  // Si después de filtrar no hay tiendas en esa categoría
  if (vendedoresFiltrados.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
        <Store className="mx-auto text-gray-300 mb-4" size={48} />
        <p className="text-gray-500 font-medium text-lg">
          Aún no hay tiendas en la categoría <span className="text-blue-600 font-bold">{filtroCategoria}</span>
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"> 
      {vendedoresFiltrados.map((v) => (
        <div
          key={v._id}
          className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden transition-all transform hover:scale-[1.02] hover:shadow-xl hover:border-blue-200"
        >
          <div className="flex flex-col items-center p-6 text-center">
            {/* Logo de la tienda */}
            <div className="relative mb-4">
              <img
                src={v.image || "https://via.placeholder.com/100"}
                alt={v.storeName}
                className="h-24 w-24 rounded-2xl object-cover shadow-lg border border-gray-100"
              />
              {/* Badge de categoría en la foto */}
              <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white text-[10px] px-2 py-1 rounded-lg font-bold shadow-md">
                {v.storeCategory}
              </div>
            </div>

            {/* Nombre de la tienda */}
            <h3 className="text-xl font-black text-gray-800 mb-1">
              {v.storeName}
            </h3>
            <p className="text-xs text-gray-400 mb-6 uppercase tracking-widest font-bold">Tienda Verificada</p>
            
            {/* Botón */}
            <button
              onClick={() => setVendedorSeleccionado(v)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 group"
            >
              Ver productos
              <div className="bg-white/20 p-1 rounded-lg group-hover:translate-x-1 transition-transform">
                <Store size={14} />
              </div>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}