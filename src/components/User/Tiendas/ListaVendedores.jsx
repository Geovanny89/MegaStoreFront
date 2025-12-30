import { useEffect, useState } from "react";
import api from "../../../api/axios";
import { useNavigate } from "react-router-dom";
import { Store } from "lucide-react";

export default function ListaVendedores({ filtroCategoria }) {
  const [vendedores, setVendedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVendedores = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/vendedor/all");
        setVendedores(data);
      } catch (error) {
        console.error("Error cargando vendedores:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVendedores();
  }, []);

  const vendedoresFiltrados = !filtroCategoria || filtroCategoria === "Todas"
    ? vendedores
    : vendedores.filter(v => 
        v.storeCategory?.trim().toLowerCase() === filtroCategoria.trim().toLowerCase()
      );

  const verProductos = (vendedorId) => {
    navigate(`/user/tienda/${vendedorId}`);
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-500 font-medium">Cargando tiendas oficiales...</div>;
  }

  if (vendedoresFiltrados.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
        <Store className="mx-auto text-gray-300 mb-4" size={48} />
        <p className="text-gray-500 font-medium text-lg">
          Aún no hay tiendas en la categoría <span className="text-blue-600 font-bold">{filtroCategoria}</span>
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {vendedoresFiltrados.map((v) => (
        <div
          key={v._id}
          className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-blue-100 group"
        >
          <div className="flex flex-col items-center p-8 text-center">
            {/* Logo de la tienda con Badge */}
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-blue-100 rounded-[2rem] scale-110 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <img
                src={v.image || "https://via.placeholder.com/100"}
                alt={v.storeName}
                className="relative h-28 w-28 rounded-[2rem] object-cover shadow-md border-4 border-white transition-transform duration-500 group-hover:scale-105"
              />
              {v.storeCategory && (
                <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white text-[10px] px-3 py-1.5 rounded-xl font-black uppercase tracking-wider shadow-lg">
                  {v.storeCategory}
                </div>
              )}
            </div>

            {/* Información básica */}
            <h3 className="text-2xl font-black text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
              {v.storeName}
            </h3>
            
            <p className="text-[10px] text-gray-400 mb-8 uppercase tracking-[0.2em] font-black">
              Tienda Oficial Verificada
            </p>

            {/* Botón Estilo Tienda */}
            <button
              onClick={() => verProductos(v._id)}
              className="w-full bg-gray-900 hover:bg-blue-600 text-white py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 group/btn shadow-xl shadow-gray-200 active:scale-95"
            >
              Visitar Tienda
              <div className="bg-white/10 p-1.5 rounded-lg group-hover/btn:translate-x-1 transition-transform">
                <Store size={16} />
              </div>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}