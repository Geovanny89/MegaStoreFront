import { useEffect, useState } from "react";
import api from "../api/axios";
import { Store, BadgeCheck } from "lucide-react";

export default function Tienda({ 
  setVendedorSeleccionado, 
  filtroCategoria = "Todas", 
  soloAvanzados = false,
  vendedoresData = null // 👈 NUEVA PROP: Recibe los datos ya ordenados del padre
}) {
  const [vendedores, setVendedores] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ==================== FETCH / DATA SYNC ==================== */
  useEffect(() => {
    // 🔥 Si TodasTiendas nos envía los datos (ya ordenados), los usamos
    if (vendedoresData) {
      setVendedores(vendedoresData);
      setLoading(false);
    } else {
      // Si no hay datos externos (comportamiento normal en Home), pedimos a la API
      const fetchVendedores = async () => {
        try {
          setLoading(true);
          const res = await api.get("/vendedor/all");
          setVendedores(res.data || []);
        } catch (error) {
          console.error("Error cargando tiendas:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchVendedores();
    }
  }, [vendedoresData]); // Se dispara cuando cambian los datos externos

  /* ==================== HELPERS ==================== */
  const obtenerNombrePlan = (vendedor) => {
    const plan = vendedor.subscriptionPlan;
    if (!plan) return "";
    if (typeof plan === "string") return plan;
    if (typeof plan === "object") {
      return plan.nombre || plan.name || "";
    }
    return "";
  };

  /* ==================== FILTRO ==================== */
  // IMPORTANTE: El .filter no altera el orden que ya traen los vendedores
  const vendedoresAMostrar = vendedores.filter(v => {
    // Filtro por categoría
    const coincideCategoria =
      filtroCategoria === "Todas"
        ? true
        : v.storeCategory?.toLowerCase() === filtroCategoria.toLowerCase();

    // Filtro por plan avanzado (usado solo si soloAvanzados es true)
    const nombrePlan = obtenerNombrePlan(v).toLowerCase();
    const esAvanzado = soloAvanzados
      ? nombrePlan === "avanzado"
      : true;

    return coincideCategoria && esAvanzado;
  });

  /* ==================== LOADING ==================== */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        <p className="mt-4 text-gray-500 font-medium">Cargando tiendas...</p>
      </div>
    );
  }

  /* ==================== EMPTY ==================== */
  if (vendedoresAMostrar.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
        <Store className="mx-auto text-gray-300 mb-4" size={48} />
        <p className="text-gray-500 font-medium text-lg">
          No se encontraron tiendas en{" "}
          <span className="text-blue-600 font-bold">{filtroCategoria}</span>
        </p>
      </div>
    );
  }

  /* ==================== UI ==================== */
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {vendedoresAMostrar.map((v) => {
        const nombrePlan = obtenerNombrePlan(v).toLowerCase();
        const esAvanzado = nombrePlan === "avanzado";

        return (
          <div
            key={v._id}
            className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden transition-all hover:scale-[1.02] hover:shadow-xl hover:border-blue-200"
          >
            <div className="flex flex-col items-center p-6 text-center relative">
              {/* BADGE PREMIUM */}
              {esAvanzado && (
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-amber-200">
                  <BadgeCheck size={12} />
                  Premium
                </div>
              )}

              {/* LOGO */}
              <div className="relative mb-4 mt-2">
                <img
                  src={v.image || "https://via.placeholder.com/100"}
                  alt={v.storeName}
                  className="h-24 w-24 rounded-2xl object-cover shadow-lg border border-gray-100 transition-transform hover:scale-110"
                />

                {v.storeCategory && (
                  <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white text-[10px] px-2 py-1 rounded-lg font-bold shadow-md">
                    {v.storeCategory}
                  </div>
                )}
              </div>

              {/* INFO */}
              <h3 className="text-xl font-black text-gray-800 mb-1 hover:text-blue-600 transition-colors">
                {v.storeName}
              </h3>

              <p className="text-xs text-gray-400 mb-6 uppercase tracking-widest font-bold">
                Tienda Oficial
              </p>

              {/* BOTÓN */}
              <button
                onClick={() => setVendedorSeleccionado(v)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
              >
                Ver productos
                <Store size={14} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}