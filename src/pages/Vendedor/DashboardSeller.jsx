import React, { useEffect, useState } from "react";
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
  Calendar,
  ArrowUpRight,
  LayoutDashboard,
  RefreshCcw,
  Copy,
  Check,
  ExternalLink,
  Store
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
      console.error("Error dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // FUNCIÓN DE COPIADO CORREGIDA
  const handleCopy = () => {
    const slug = data?.seller?.slug;
    if (!slug) return;

    const storeUrl = `${window.location.origin}/tienda/${slug}`;

    navigator.clipboard.writeText(storeUrl)
      .then(() => {
        setCopied(true);
        // El texto cambiará a "¡Copiado!" por 2 segundos
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Error al copiar al portapapeles:", err);
      });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] space-y-4">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium animate-pulse">Preparando tus estadísticas...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 bg-blue-600 rounded-lg">
                <LayoutDashboard size={18} className="text-white" />
              </div>
              <span className="text-sm font-bold text-blue-600 uppercase tracking-wider">Seller Central</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Dashboard de {data?.seller?.storeName || "Ventas"}
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              Monitoriza el crecimiento de tu negocio en tiempo real.
            </p>
          </div>
          
          <button 
            onClick={fetchDashboard}
            className="flex items-center justify-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
          >
            <RefreshCcw size={16} /> Actualizar datos
          </button>
        </div>

        {/* ENLACE DE TIENDA PERSONALIZADA */}
        <div className="bg-white border-2 border-blue-50 rounded-3xl p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:border-blue-100">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-100">
              <Store size={28} />
            </div>
            <div>
              <h4 className="text-base font-black text-slate-900 tracking-tight">Tu Tienda Virtual</h4>
              <p className="text-sm text-slate-500 font-medium mb-1">Comparte este enlace con tus clientes:</p>
              <code className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                {window.location.origin}/tienda/{data?.seller?.slug}
              </code>
            </div>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <button 
              onClick={handleCopy}
              disabled={copied}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-2xl text-sm font-black transition-all duration-300 ${
                copied 
                  ? "bg-emerald-500 text-white scale-105 shadow-lg shadow-emerald-100" 
                  : "bg-slate-900 text-white hover:bg-slate-800 active:scale-95"
              }`}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              <span>{copied ? "¡Copiado!" : "Copiar Enlace"}</span>
            </button>
            
            <a 
              href={`/tienda/${data?.seller?.slug}`}
              target="_blank"
              rel="noreferrer"
              className="p-3 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 hover:text-blue-600 transition-all shadow-sm"
              title="Ir a mi tienda"
            >
              <ExternalLink size={22} />
            </a>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KpiCard
            title="Ventas de Hoy"
            value={`$${data?.summary?.today?.toLocaleString() || 0}`}
            icon={<DollarSign size={20} />}
            trend="+12.5%"
            color="blue"
          />
          <KpiCard
            title="Últimos 7 días"
            value={`$${data?.summary?.week?.toLocaleString() || 0}`}
            icon={<TrendingUp size={20} />}
            trend="+5.2%"
            color="emerald"
          />
          <KpiCard
            title="Ventas del Mes"
            value={`$${data?.summary?.month?.toLocaleString() || 0}`}
            icon={<Calendar size={20} />}
            trend="+18.3%"
            color="violet"
          />
        </div>

        {/* GRÁFICA */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Rendimiento Comercial</h3>
              <p className="text-xs text-slate-400 font-medium">Ingresos brutos por día</p>
            </div>
          </div>

          <div className="p-6">
            <div className="w-full h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.dailySales || []}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}}
                  />
                  <Tooltip 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '12px'}}
                    formatter={(value) => [`$${value.toLocaleString()}`, "Ventas"]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#3b82f6" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorTotal)" 
                    dot={{ r: 6, fill: '#3b82f6', strokeWidth: 3, stroke: '#fff' }}
                    activeDot={{ r: 8, strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, icon, trend, color }) {
  const themes = {
    blue: "text-blue-600 bg-blue-600",
    emerald: "text-emerald-600 bg-emerald-600",
    violet: "text-violet-600 bg-violet-600"
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl bg-slate-50 group-hover:bg-white group-hover:scale-110 transition-transform ${themes[color].split(' ')[0]}`}>
          {icon}
        </div>
        <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg text-[10px] font-black">
          <ArrowUpRight size={12} />
          {trend}
        </div>
      </div>
      <div>
        <p className="text-sm font-bold text-slate-500 uppercase tracking-tight mb-1">{title}</p>
        <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
          {value}
        </h2>
      </div>
    </div>
  );
}