import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import api from "../../api/axios";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar
} from "recharts";
import {
  DollarSign, TrendingUp, Calendar, ArrowUpRight, LayoutDashboard,
  RefreshCcw, Copy, Check, ExternalLink, Store, Download,
  ShoppingBag, Users, Package, ArrowDownRight, Clock
} from "lucide-react";

export default function DashboardSeller() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await api.get("/seller/dashboard");
      setData(res.data);
    } catch (error) {
      console.error("Error dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleCopy = () => {
    const slug = data?.seller?.slug;
    if (!slug) return;
    const storeUrl = `${window.location.origin}/tienda/${slug}`;
    navigator.clipboard.writeText(storeUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
          <LayoutDashboard className="absolute text-blue-600" size={24} />
        </div>
        <p className="mt-4 text-slate-600 font-semibold animate-pulse">Cargando ecosistema de ventas...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-900 font-sans selection:bg-blue-100">
      {/* SIDEBAR/TOPBAR NAVIGATION SIMULATION */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-8">
        
        {/* HEADER ESTRATÉGICO */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-widest">
                Partner Pro
              </span>
              <span className="text-slate-400 text-sm font-medium flex items-center gap-1">
                <Clock size={14} /> Actualizado: hace un momento
              </span>
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">
              Bienvenido, <span className="text-blue-600">{data?.seller?.storeName}</span>
            </h1>
            <p className="text-slate-500 mt-1 text-lg font-medium">Aquí tienes el pulso de tu tienda hoy.</p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={fetchDashboard}
              className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:shadow-lg transition-all active:scale-95"
            >
              <RefreshCcw size={20} />
            </button>
            <button 
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 hover:shadow-xl shadow-blue-200 transition-all active:scale-95"
            >
              <Download size={18} />
              <span>Exportar Reporte</span>
            </button>
          </div>
        </header>

        {/* TIENDA LINK CARD - DISEÑO GLASSMORPISM */}
        <section className="relative overflow-hidden bg-slate-900 rounded-[32px] p-8 mb-10 text-white shadow-2xl shadow-blue-900/20">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-blue-500/20 backdrop-blur-xl border border-blue-400/30 rounded-2xl flex items-center justify-center text-blue-400">
                <Store size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold">Tu escaparate está activo</h3>
                <p className="text-slate-400 text-sm">Gestiona la visibilidad y el alcance de tu tienda virtual.</p>
              </div>
            </div>
            <div className="flex items-center bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-2 w-full md:w-auto">
              <code className="px-4 text-blue-300 font-mono text-sm truncate">
                {window.location.origin}/tienda/{data?.seller?.slug}
              </code>
              <button 
                onClick={handleCopy}
                className={`ml-4 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                  copied ? "bg-emerald-500 text-white" : "bg-white text-slate-900 hover:bg-blue-50"
                }`}
              >
                {copied ? <Check size={18} className="mx-auto" /> : "Copiar"}
              </button>
            </div>
          </div>
          {/* Decoración abstracta */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] -mr-32 -mt-32"></div>
        </section>

        {/* KPI GRID - MÉTRICAS DE ALTO IMPACTO */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard 
            title="Ingresos Totales" 
            value={`$${data?.summary?.month?.toLocaleString()}`}
            trend="+24%" 
            isUp={true} 
            icon={<DollarSign />} 
            color="blue" 
          />
          <StatCard 
            title="Pedidos Nuevos" 
            value="42"
            trend="+12%" 
            isUp={true} 
            icon={<ShoppingBag />} 
            color="emerald" 
          />
          <StatCard 
            title="Tasa de Conversión" 
            value="3.2%"
            trend="-2%" 
            isUp={false} 
            icon={<TrendingUp />} 
            color="amber" 
          />
          <StatCard 
            title="Clientes Activos" 
            value="1,284"
            trend="+8%" 
            isUp={true} 
            icon={<Users />} 
            color="violet" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* GRÁFICA PRINCIPAL */}
          <div className="lg:col-span-2 bg-white rounded-[32px] p-8 shadow-sm border border-slate-200/60">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Análisis de Ingresos</h3>
                <p className="text-slate-400 text-sm font-medium">Rendimiento de ventas diarias</p>
              </div>
              <select className="bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-600 px-4 py-2 outline-none ring-1 ring-slate-200">
                <option>Últimos 30 días</option>
                <option>Últimos 7 días</option>
              </select>
            </div>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.dailySales || []}>
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}}
                    dy={15}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    cursor={{ stroke: '#2563eb', strokeWidth: 2 }}
                    content={<CustomTooltip />}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#2563eb" 
                    strokeWidth={4}
                    fill="url(#chartGradient)"
                    dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 8, strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* LISTA DE ACTIVIDAD O PRODUCTOS TOP */}
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-200/60">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Productos Destacados</h3>
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map((_, i) => (
                <div key={i} className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex-shrink-0 group-hover:bg-blue-50 transition-colors"></div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">Producto Premium #{i + 1}</h4>
                    <p className="text-xs text-slate-400">124 ventas este mes</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-900">$450.00</p>
                    <p className="text-[10px] font-bold text-emerald-500">+12%</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-4 bg-slate-50 text-slate-600 rounded-2xl text-sm font-bold hover:bg-slate-100 transition-colors">
              Ver inventario completo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// COMPONENTES AUXILIARES PARA LIMPIEZA DE CÓDIGO
function StatCard({ title, value, trend, isUp, icon, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    violet: "bg-violet-50 text-violet-600"
  };

  return (
    <div className="bg-white p-6 rounded-[28px] border border-slate-200/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${colors[color]}`}>
          {React.cloneElement(icon, { size: 24 })}
        </div>
        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black ${
          isUp ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
        }`}>
          {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {trend}
        </div>
      </div>
      <div>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
        <h2 className="text-3xl font-black text-slate-900 tracking-tighter">{value}</h2>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-md">
        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">{label}</p>
        <p className="text-xl font-black text-blue-400">${payload[0].value.toLocaleString()}</p>
        <p className="text-[10px] text-emerald-400 font-bold mt-1 flex items-center gap-1">
          <TrendingUp size={10} /> Rendimiento óptimo
        </p>
      </div>
    );
  }
  return null;
};