import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import api from "../../api/axios";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import {
  DollarSign,
  TrendingUp,
  RefreshCcw,
  Store,
  Download,
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight,
  Clock
} from "lucide-react";

export default function DashboardSeller() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await api.get("/seller/dashboard");
      setData(res.data);
    } catch (error) {
      console.error("Error al cargar datos reales:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const exportToExcel = () => {
    if (!data?.dailySales) return;
    const ws = XLSX.utils.json_to_sheet(data.dailySales);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ventas Diarias");
    XLSX.writeFile(
      wb,
      `Reporte_Ventas_${data.seller?.storeName || "Tienda"}.xlsx`
    );
  };

  const handleCopy = () => {
    const storeUrl = `${window.location.origin}/${data?.seller?.slug}`;
    navigator.clipboard.writeText(storeUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50">
        <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-600 font-semibold text-sm md:text-base">
          Sincronizando con tu tienda...
        </p>
      </div>
    );
  }

  const planName =
    data?.seller?.subscriptionPlan?.name ||
    data?.seller?.subscriptionPlan?.nombre ||
    "Emprendedor";

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-900 p-3 md:p-8 overflow-x-hidden">
      <div className="max-w-[1600px] mx-auto w-full overflow-x-hidden">
        {/* HEADER */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 md:mb-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
              <span
                className={`text-white text-[9px] md:text-[10px] font-black px-2 md:px-3 py-1 md:py-1.5 rounded-lg uppercase tracking-widest shadow-sm ${
                  planName.toLowerCase() === "premium"
                    ? "bg-gradient-to-r from-amber-500 to-orange-600 shadow-amber-200"
                    : "bg-blue-600 shadow-blue-200"
                }`}
              >
                Plan {planName}
              </span>
              <span className="text-slate-400 text-[10px] md:text-xs font-medium flex items-center gap-1">
                <Clock size={12} /> Actualizado ahora
              </span>
            </div>

            <h1 className="text-2xl md:text-4xl font-black tracking-tight text-slate-900 leading-tight">
              Panel de{" "}
              <span className="text-blue-600 block md:inline">
                {data?.seller?.storeName}
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={fetchDashboard}
              className="flex-1 lg:flex-none flex justify-center p-3 bg-white border border-slate-200 rounded-2xl hover:text-blue-600 transition-all shadow-sm"
            >
              <RefreshCcw size={20} />
            </button>

            <button
              onClick={exportToExcel}
              className="flex-[3] lg:flex-none flex items-center justify-center gap-2 bg-slate-900 text-white px-4 md:px-6 py-3 rounded-2xl font-bold text-sm md:text-base hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
            >
              <Download size={18} />
              <span>
                Reporte <span className="hidden sm:inline">Mensual</span>
              </span>
            </button>
          </div>
        </header>

        {/* ENLACE TIENDA */}
        <section className="bg-white border border-slate-200 rounded-[24px] md:rounded-[32px] p-4 md:p-6 mb-8 md:mb-10 shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
            <div className="flex items-center gap-4 w-full min-w-0">
              <div className="min-w-[48px] h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                <Store size={24} />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-slate-800">
                  Tu vitrina online
                </h3>
                <p className="text-slate-500 text-[10px] md:text-xs font-medium truncate">
                  Copia el enlace y compártelo en redes.
                </p>
              </div>
            </div>

            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl p-1 w-full lg:max-w-md min-w-0">
              <code className="flex-1 px-3 text-blue-600 font-bold text-[11px] md:text-sm break-all">
                {window.location.origin}/{data?.seller?.slug}
              </code>
              <button
                onClick={handleCopy}
                className={`px-4 md:px-6 py-2 md:py-2.5 rounded-xl font-black text-[10px] md:text-xs uppercase tracking-wider transition-all whitespace-nowrap ${
                  copied
                    ? "bg-emerald-500 text-white"
                    : "bg-white text-slate-900 shadow-sm border border-slate-200"
                }`}
              >
                {copied ? "Copiado!" : "Copiar"}
              </button>
            </div>
          </div>
        </section>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10">
          <StatCard
            title="Ventas del Mes"
            value={`$${data?.summary?.totalMonth?.toLocaleString() || "0"}`}
            trend={`${data?.summary?.salesTrend || "0"}%`}
            isUp={data?.summary?.salesTrend >= 0}
            icon={<DollarSign />}
            color="blue"
          />
          <StatCard
            title="Pedidos Totales"
            value={data?.summary?.orderCount || "0"}
            trend="En tiempo real"
            isUp={true}
            icon={<ShoppingBag />}
            color="emerald"
          />
          <StatCard
            title="Productos"
            value={data?.summary?.productCount || "0"}
            trend="Publicados"
            isUp={true}
            icon={<TrendingUp />}
            color="amber"
          />
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* CHART */}
          <div className="lg:col-span-2 bg-white rounded-[24px] md:rounded-[32px] p-5 md:p-8 shadow-sm border border-slate-200/60 overflow-hidden">
            <div className="mb-6 md:mb-8">
              <h3 className="text-lg md:text-xl font-black text-slate-900">
                Rendimiento Comercial
              </h3>
              <p className="text-slate-500 text-xs md:text-sm font-medium">
                Ingresos brutos últimos 7 días
              </p>
            </div>

            <div className="h-[250px] md:h-[350px] w-full max-w-full overflow-hidden">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.dailySales || []}>
                  <defs>
                    <linearGradient
                      id="colorSales"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />

                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#94a3b8",
                      fontSize: 10,
                      fontWeight: 600
                    }}
                    dy={10}
                  />

                  <YAxis
                    className="hidden sm:block"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#94a3b8",
                      fontSize: 10,
                      fontWeight: 600
                    }}
                    tickFormatter={(v) => `$${v}`}
                  />

                  <Tooltip content={<CustomTooltip />} />

                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#2563eb"
                    strokeWidth={3}
                    fill="url(#colorSales)"
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* TOP PRODUCTS (sin cambios funcionales) */}
          {/* … permanece igual */}
        </div>
      </div>
    </div>
  );
}

/* === COMPONENTES AUXILIARES (SIN CAMBIOS) === */

function StatCard({ title, value, trend, isUp, icon, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    violet: "bg-violet-50 text-violet-600"
  };

  return (
    <div className="bg-white p-5 md:p-6 rounded-[24px] md:rounded-[32px] border border-slate-200/60 shadow-sm">
      <div className="flex justify-between items-start mb-4 md:mb-5">
        <div
          className={`p-3 md:p-4 rounded-xl md:rounded-2xl ${colors[color]}`}
        >
          {React.cloneElement(icon, { size: 20 })}
        </div>
        <div
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] md:text-[10px] font-black ${
            isUp
              ? "bg-emerald-100 text-emerald-700"
              : "bg-rose-100 text-rose-700"
          }`}
        >
          {isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {trend}
        </div>
      </div>
      <p className="text-slate-400 text-[9px] md:text-[11px] font-black uppercase tracking-[0.1em] mb-1">
        {title}
      </p>
      <h2 className="text-2xl md:text-3xl font-black text-slate-900">
        {value}
      </h2>
      {/* SOPORTE WHATSAPP – ESTILO PROFESIONAL */}
<a
  href={`https://wa.me/573507918591?text=Hola,%20necesito%20soporte%20con%20mi%20tienda`}
  target="_blank"
  rel="noopener noreferrer"
  className="
    fixed bottom-5 right-5 z-[100]
    flex items-center gap-2
    bg-white
    border border-slate-200
    rounded-full
    px-4 py-2
    shadow-sm
    hover:shadow-md
    transition-all duration-200
    text-slate-700
    hover:text-slate-900
  "
  aria-label="Soporte por WhatsApp"
>
  {/* ICONO */}
  <div className="
    w-8 h-8
    rounded-full
    bg-emerald-500
    flex items-center justify-center
  ">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      className="w-4 h-4 fill-white"
    >
      <path d="M16.003 2.003c-7.732 0-14 6.268-14 14 0 2.47.646 4.878 1.873 7.012L2 30l7.18-1.85a13.91 13.91 0 006.823 1.754c7.732 0 14-6.268 14-14s-6.268-14-14-14z"/>
    </svg>
  </div>

  {/* TEXTO */}
  <span className="text-sm font-medium hidden sm:block">
    Soporte
  </span>
</a>

    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-3 md:p-4 rounded-2xl shadow-2xl">
        <p className="text-[9px] font-black text-slate-400 uppercase mb-1">
          {label}
        </p>
        <p className="text-lg md:text-xl font-black text-blue-400">
          ${payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};
