import { useEffect, useState } from "react";
import api from "../api/axios";
import { Store, BadgeCheck, AlertCircle } from "lucide-react";

export default function Tienda({
  setVendedorSeleccionado,
  filtroCategoria = "Todas",
  soloPremium = false,
  vendedoresData = null,
  esCarrusel = false, // Nueva prop para activar scroll horizontal
  limite = null, // Nueva prop para limitar cantidad de tiendas
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

  /* ==================== FILTRO LOGIC ==================== */
  let vendedoresAMostrar = vendedores.filter((v) => {
    // 1. Estado de actividad
    const estaActivo = v.active !== undefined ? v.active : true;
    const tieneStatusActivo = v.status
      ? v.status === "activo" || v.status === "active"
      : true;

    // 2. Filtro por categoría
    const coincideCategoria =
      filtroCategoria === "Todas"
        ? true
        : v.storeCategory?.toLowerCase() === filtroCategoria.toLowerCase();

    // 3. Ajuste de Planes
    const nombrePlan = obtenerNombrePlan(v).toLowerCase();
    const esPlanAceptado =
      nombrePlan === "premium" ||
      nombrePlan === "avanzado" ||
      nombrePlan === "emprendedor";

    const cumpleFiltroPlan = soloPremium ? esPlanAceptado : true;

    return (
      estaActivo && tieneStatusActivo && coincideCategoria && cumpleFiltroPlan
    );
  });

  // Aplicar límite si existe
  if (limite) {
    vendedoresAMostrar = vendedoresAMostrar.slice(0, limite);
  }

  /* ==================== UI ESTADOS (LOADING / VACÍO) ==================== */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        <p className="mt-4 text-gray-500 font-medium">
          Cargando marketplace...
        </p>
      </div>
    );
  }

  if (vendedoresAMostrar.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
        <AlertCircle className="mx-auto text-gray-300 mb-4" size={48} />
        <p className="text-gray-500 font-medium text-lg">
          No se encontraron tiendas {soloPremium ? "Destacadas" : ""} en{" "}
          <span className="text-blue-600 font-bold">{filtroCategoria}</span>
        </p>
      </div>
    );
  }

  /* ==================== RENDER PRINCIPAL ==================== */
  return (
    <div
      className={`
        ${
          esCarrusel
            ? "flex overflow-x-auto pb-8 gap-6 snap-x snap-mandatory scrollbar-hide px-2"
            : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        }
      `}
    >
      {vendedoresAMostrar.map((v) => {
        const nombrePlan = obtenerNombrePlan(v).toLowerCase();
        const mostrarBadge =
          nombrePlan === "premium" || nombrePlan === "avanzado";

        return (
          <div
            key={v._id}
            className={`
  ${esCarrusel ? "flex-none w-[280px] sm:w-[320px] snap-center" : "w-full"}
  bg-white dark:bg-[#020617]
  rounded-[2.5rem]
  shadow-sm dark:shadow-none
  border border-gray-100 dark:border-gray-800
  overflow-hidden
  transition-all duration-300
  hover:shadow-xl hover:border-blue-200
  ${!esCarrusel ? "hover:scale-[1.02]" : "hover:ring-2 hover:ring-blue-400/30"}
`}
          >
            <div
              className="flex flex-col items-center p-8 text-center relative
                text-gray-900 dark:text-gray-100"
            >
              {/* BADGE PREMIUM */}
              {mostrarBadge && (
                <div className="absolute top-6 right-6 flex items-center gap-1 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-amber-200 shadow-sm">
                  <BadgeCheck size={12} />
                  Premium
                </div>
              )}

              {/* LOGO TIENDA */}
              <div className="relative mb-5 mt-2">
                <div
                  className="p-1 bg-white dark:bg-gray-900
                rounded-3xl shadow-md dark:shadow-none
                border border-gray-50 dark:border-gray-800"
                >
                  <img
                    src={v.image || "https://via.placeholder.com/150"}
                    alt={v.storeName}
                    className="h-24 w-24 rounded-[1.2rem] object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>

                {v.storeCategory && (
                  <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white text-[10px] px-3 py-1 rounded-full font-black shadow-lg border-2 border-white uppercase tracking-tighter">
                    {v.storeCategory}
                  </div>
                )}
              </div>

              {/* INFO TIENDA */}
              <h3
                className="text-xl font-black text-gray-900 dark:text-gray-100
               mb-1 hover:text-blue-600 transition-colors line-clamp-1"
              >
                {v.storeName}
              </h3>

              <p
                className="text-[10px] text-gray-400 dark:text-gray-500
              mb-8 uppercase tracking-[0.2em] font-black"
              >
                Tienda Oficial
              </p>

              {/* BOTÓN DE ACCIÓN */}
              <button
                onClick={() => setVendedorSeleccionado(v)}
                className="
    w-full
    bg-blue-600 hover:bg-blue-700
    dark:bg-blue-500 dark:hover:bg-blue-600
    text-white
    py-3
    rounded-[1.5rem]
    font-bold
    transition-all duration-300
    flex items-center justify-center gap-2
    shadow-md shadow-blue-500/20
    dark:shadow-blue-400/10
    active:scale-95
  "
              >
                <span className="text-sm">Explorar productos</span>
                <Store
                  size={16}
                  className="group-hover:rotate-12 transition-transform"
                />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
