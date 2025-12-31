import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import api from "../../api/axios";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import {
  DollarSign, TrendingUp, RefreshCcw, Copy, Check, Store, Download,
  ShoppingBag, Users, ArrowUpRight, ArrowDownRight, Clock
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
    XLSX.writeFile(wb, `Reporte_Ventas_${data.seller?.storeName || 'Tienda'}.xlsx`);
  };

  const handleCopy = () => {
    const storeUrl = `${window.location.origin}/tienda/${data?.seller?.slug}`;
    navigator.clipboard.writeText(storeUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50">
        <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-600 font-semibold">Sincronizando con tu tienda...</p>
      </div>
    );
  }

  const planName = data?.seller?.subscriptionPlan?.name || data?.seller?.subscriptionPlan?.nombre || "Emprendedor";

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-900 p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto">
        
        {/* HEADER */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`text-white text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-sm ${
                planName.toLowerCase() === 'premium' 
                  ? "bg-gradient-to-r from-amber-500 to-orange-600 shadow-amber-200" 
                  : "bg-blue-600 shadow-blue-200"
              }`}>
                Plan {planName}
              </span>
              <span className="text-slate-400 text-xs font-medium flex items-center gap-1">
                <Clock size={12} /> Actualizado ahora
              </span>
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">
              Panel de <span className="text-blue-600">{data?.seller?.storeName}</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={fetchDashboard} 
              className="p-3 bg-white border border-slate-200 rounded-2xl hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
              title="Refrescar datos"
            >
              <RefreshCcw size={20} />
            </button>
            <button 
              onClick={exportToExcel}
              className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
            >
              <Download size={18} />
              <span>Reporte Mensual</span>
            </button>
          </div>
        </header>

        {/* ENLACE PÚBLICO */}
        <section className="bg-white border border-slate-200 rounded-[32px] p-6 mb-10 relative overflow-hidden shadow-sm">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                <Store size={24} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">Tu vitrina online está lista</h3>
                <p className="text-slate-500 text-xs font-medium">Copia el enlace y compártelo en tu biografía de Instagram.</p>
              </div>
            </div>
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl p-1.5 w-full md:w-auto">
              <code className="px-4 text-blue-600 font-bold text-sm truncate">
                {window.location.origin}/tienda/{data?.seller?.slug}
              </code>
              <button 
                onClick={handleCopy}
                className={`ml-2 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all ${
                  copied ? "bg-emerald-500 text-white" : "bg-white text-slate-900 shadow-sm border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {copied ? "Copiado!" : "Copiar"}
              </button>
            </div>
          </div>
        </section>

        {/* TARJETAS DE ESTADÍSTICAS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard 
            title="Ventas del Mes" 
            value={`$${data?.summary?.totalMonth?.toLocaleString() || '0'}`}
            trend={`${data?.summary?.salesTrend || '0'}%`} 
            isUp={data?.summary?.salesTrend >= 0} 
            icon={<DollarSign />} 
            color="blue" 
          />
          <StatCard 
            title="Pedidos Totales" 
            value={data?.summary?.orderCount || '0'}
            trend="En tiempo real" 
            isUp={true} 
            icon={<ShoppingBag />} 
            color="emerald" 
          />
        
          <StatCard 
            title="Productos" 
            value={data?.summary?.productCount || '0'}
            trend="Publicados" 
            isUp={true} 
            icon={<TrendingUp />} 
            color="amber" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* GRÁFICO PRINCIPAL */}
          <div className="lg:col-span-2 bg-white rounded-[32px] p-8 shadow-sm border border-slate-200/60">
            <div className="mb-8">
              <h3 className="text-xl font-black text-slate-900">Rendimiento Comercial</h3>
              <p className="text-slate-500 text-sm font-medium">Ingresos brutos de los últimos 7 días</p>
            </div>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.dailySales || []}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} tickFormatter={(v) => `$${v}`} />
                  <Tooltip content={<CustomTooltip />} cursor={{stroke: '#2563eb', strokeWidth: 2}} />
                  <Area type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={4} fill="url(#colorSales)" animationDuration={1500} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* TOP PRODUCTOS CON FIX DE IMAGEN */}
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-200/60">
            <h3 className="text-xl font-black text-slate-900 mb-8">Más Vendidos</h3>
            <div className="space-y-7">
              {data?.topProducts?.length > 0 ? (
                data.topProducts.map((prod, i) => (
                  <div key={i} className="flex items-center gap-4 group cursor-pointer">
                    <div className="relative">
                      <img 
                        src={prod.image || "/placeholder-product.png"} 
                        alt={prod.name} 
                        className="w-14 h-14 rounded-2xl object-cover bg-slate-50 border border-slate-100 group-hover:scale-105 transition-transform" 
                        // FALLBACK: Si Cloudinary falla, usamos una imagen por defecto
                        onError={(e) => {
                          e.target.onerror = null; 
                          e.target.src = "https://via.placeholder.com/150?text=Producto";
                        }}
                      />
                      <span className="absolute -top-2 -left-2 w-6 h-6 bg-slate-900 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">
                        {i + 1}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-black text-slate-800 truncate uppercase tracking-tight">{prod.name}</h4>
                      <div className="flex items-center gap-2">
                         <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">{prod.salesCount} ventas</span>
                      </div>
                    </div>
                    <p className="text-sm font-black text-slate-900">${Number(prod.price)?.toLocaleString()}</p>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                    <ShoppingBag size={32} />
                  </div>
                  <p className="text-slate-400 font-bold text-sm">Sin ventas registradas</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, trend, isUp, icon, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    violet: "bg-violet-50 text-violet-600"
  };

  return (
    <div className="bg-white p-6 rounded-[32px] border border-slate-200/60 hover:border-blue-200 transition-all group shadow-sm">
      <div className="flex justify-between items-start mb-5">
        <div className={`p-4 rounded-2xl transition-transform group-hover:scale-110 ${colors[color]}`}>{icon}</div>
        <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black tracking-tight ${isUp ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
          {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {trend}
        </div>
      </div>
      <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.1em] mb-1">{title}</p>
      <h2 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h2>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-white/10 animate-in fade-in zoom-in-95">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-xl font-black text-blue-400">${payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};