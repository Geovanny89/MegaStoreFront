import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area
} from "recharts";
import {
  DollarSign,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  LayoutDashboard,
  RefreshCcw
} from "lucide-react";

export default function DashboardSeller() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

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
        
        {/* ================= HEADER ================= */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 bg-blue-600 rounded-lg">
                <LayoutDashboard size={18} className="text-white" />
              </div>
              <span className="text-sm font-bold text-blue-600 uppercase tracking-wider">Seller Central</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Dashboard de Ventas
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

        {/* ================= KPIs ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KpiCard
            title="Ventas de Hoy"
            value={`$${data.summary.today.toLocaleString()}`}
            icon={<DollarSign size={20} />}
            trend="+12.5%"
            color="blue"
          />
          <KpiCard
            title="Últimos 7 días"
            value={`$${data.summary.week.toLocaleString()}`}
            icon={<TrendingUp size={20} />}
            trend="+5.2%"
            color="emerald"
          />
          <KpiCard
            title="Ventas del Mes"
            value={`$${data.summary.month.toLocaleString()}`}
            icon={<Calendar size={20} />}
            trend="+18.3%"
            color="violet"
          />
        </div>

        {/* ================= GRÁFICA PROFESIONAL ================= */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Rendimiento Comercial</h3>
              <p className="text-xs text-slate-400 font-medium">Ingresos brutos por día</p>
            </div>
            <select className="bg-slate-50 border-none text-xs font-bold rounded-lg px-3 py-2 text-slate-600 focus:ring-2 focus:ring-blue-500">
              <StatusBadge status="Últimos 30 días" />
              <option>Últimos 7 días</option>
              <option>Este mes</option>
            </select>
          </div>

          <div className="p-6">
            <div className="w-full h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.dailySales}>
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

/* ================= COMPONENTES INTERNOS ================= */

function KpiCard({ title, value, icon, trend, color }) {
  const themes = {
    blue: "bg-blue-600 shadow-blue-100 text-blue-600",
    emerald: "bg-emerald-600 shadow-emerald-100 text-emerald-600",
    violet: "bg-violet-600 shadow-violet-100 text-violet-600"
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl bg-slate-50 group-hover:bg-white group-hover:scale-110 transition-transform ${themes[color].split(' ')[2]}`}>
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

function StatusBadge({ status }) {
  return <option>{status}</option>;
}