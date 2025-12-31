import { useEffect, useState } from "react";
import api from "../api/axios";
import { Store, BadgeCheck, AlertCircle } from "lucide-react";

export default function Tienda({ 
  setVendedorSeleccionado, 
  filtroCategoria = "Todas", 
  soloPremium = false,
  vendedoresData = null 
}) {
  const [vendedores, setVendedores] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ==================== FETCH / DATA SYNC ==================== */
  useEffect(() => {
    if (vendedoresData) {
      setVendedores(vendedoresData);
      setLoading(false);
    } else {
      const fetchVendedores = async () => {
        try {
          setLoading(true);
          const res = await api.get("/vendedor/all");
          setVendedores(res.data || []);
          console.log("mis tiendas", res)
        } catch (error) {
          console.error("Error cargando tiendas:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchVendedores();
    }
  }, [vendedoresData]);

  /* ==================== HELPERS ==================== */
  const obtenerNombrePlan = (vendedor) => {
    const plan = vendedor.subscriptionPlan || vendedor.planId;
    if (!plan) return "";
    if (typeof plan === "string") return plan;
    if (typeof plan === "object") {
      return plan.nombre || plan.name || "";
    }
    return "";
  };

 /* ==================== FILTRO CORREGIDO ==================== */
const vendedoresAMostrar = vendedores.filter(v => {
  // 1. Ajuste de Activo: 
  // Si el campo 'active' no existe, lo tomamos como true para que no desaparezca.
  const estaActivo = v.active !== undefined ? v.active : true;
  const tieneStatusActivo = v.status ? (v.status === 'activo' || v.status === 'active') : true;

  // 2. Filtro por categoría
  const coincideCategoria =
    filtroCategoria === "Todas"
      ? true
      : v.storeCategory?.toLowerCase() === filtroCategoria.toLowerCase();

  // 3. Filtro por plan Premium
  const nombrePlan = obtenerNombrePlan(v).toLowerCase();
  
  // Tu log muestra planes como "Emprendedor". 
  // Si 'soloPremium' es true, solo mostrará "premium" o "avanzado".
  const esPremiumParaFiltro = soloPremium 
    ? (nombrePlan === "premium" || nombrePlan === "avanzado") 
    : true;

  return estaActivo && tieneStatusActivo && coincideCategoria && esPremiumParaFiltro;
});
  /* ==================== UI DE CARGA (DISEÑO MODERNO) ==================== */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        <p className="mt-4 text-gray-500 font-medium">Cargando marketplace...</p>
      </div>
    );
  }

  /* ==================== UI VACÍA (DISEÑO MODERNO) ==================== */
  if (vendedoresAMostrar.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
        <AlertCircle className="mx-auto text-gray-300 mb-4" size={48} />
        <p className="text-gray-500 font-medium text-lg">
          No se encontraron tiendas{" "}
          {soloPremium ? "Premium" : ""} en{" "}
          <span className="text-blue-600 font-bold">{filtroCategoria}</span>
        </p>
      </div>
    );
  }

  /* ==================== GRID PRINCIPAL ==================== */
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {vendedoresAMostrar.map((v) => {
        const nombrePlan = obtenerNombrePlan(v).toLowerCase();
        // Definimos quién lleva la corona de Premium (Premium o Avanzado)
        const mostrarBadge = nombrePlan === "premium" || nombrePlan === "avanzado";

        return (
          <div
            key={v._id}
            className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden transition-all hover:scale-[1.02] hover:shadow-xl hover:border-blue-200"
          >
            <div className="flex flex-col items-center p-6 text-center relative">
              
              {/* BADGE PREMIUM */}
              {mostrarBadge && (
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-amber-200">
                  <BadgeCheck size={12} />
                  Premium
                </div>
              )}

              {/* LOGO TIENDA */}
              <div className="relative mb-4 mt-2">
                <img
                  src={v.image || "https://via.placeholder.com/150"}
                  alt={v.storeName}
                  className="h-24 w-24 rounded-2xl object-cover shadow-lg border border-gray-100 transition-transform hover:scale-110"
                />

                {v.storeCategory && (
                  <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white text-[10px] px-2 py-1 rounded-lg font-bold shadow-md">
                    {v.storeCategory}
                  </div>
                )}
              </div>

              {/* INFO TIENDA */}
              <h3 className="text-xl font-black text-gray-800 mb-1 hover:text-blue-600 transition-colors">
                {v.storeName}
              </h3>

              <p className="text-xs text-gray-400 mb-6 uppercase tracking-widest font-bold">
                Tienda Oficial
              </p>

              {/* BOTÓN DE ACCIÓN */}
              <button
                onClick={() => setVendedorSeleccionado(v)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 group"
              >
                Ver productos
                <Store size={14} className="group-hover:rotate-12 transition-transform" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}