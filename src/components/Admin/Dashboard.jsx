import React, { useEffect, useState } from "react";
import { 
  ShoppingBag, Users, DollarSign, TrendingUp, 
  TrendingDown, ArrowUpRight, MoreHorizontal, Calendar 
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';
import api from "../../api/axios";

// Datos ficticios para el gráfico (En el futuro vendrán de tu API)
const dataChart = [
  { name: 'Lun', ventas: 4000 },
  { name: 'Mar', ventas: 3000 },
  { name: 'Mie', ventas: 5000 },
  { name: 'Jue', ventas: 2780 },
  { name: 'Vie', ventas: 1890 },
  { name: 'Sab', ventas: 2390 },
  { name: 'Dom', ventas: 3490 },
];

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/all/admin/user");
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* SECCIÓN BIENVENIDA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 font-medium">Bienvenido, aquí tienes lo que sucede hoy.</p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-all">
          <Calendar size={18} /> Últimos 7 días
        </button>
      </div>

      {/* TARJETAS DE MÉTRICAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Ingresos Totales" 
          value="$12,845" 
          trend="+12.5%" 
          up={true} 
          icon={<DollarSign className="text-emerald-600" />} 
          bg="bg-emerald-50" 
        />
        <StatCard 
          title="Usuarios" 
          value={users.length} 
          trend="+3 nuevos" 
          up={true} 
          icon={<Users className="text-blue-600" />} 
          bg="bg-blue-50" 
        />
        <StatCard 
          title="Pedidos" 
          value="156" 
          trend="-2.4%" 
          up={false} 
          icon={<ShoppingBag className="text-orange-600" />} 
          bg="bg-orange-50" 
        />
        <StatCard 
          title="Tasa de Conversión" 
          value="3.2%" 
          trend="+0.8%" 
          up={true} 
          icon={<TrendingUp className="text-purple-600" />} 
          bg="bg-purple-50" 
        />
      </div>

      {/* GRÁFICOS Y ACTIVIDAD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Gráfico de Ventas Principal */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-800 text-lg">Rendimiento de Ventas</h3>
            <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal /></button>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataChart}>
                <defs>
                  <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} 
                />
                <Area type="monotone" dataKey="ventas" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorVentas)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lista de Usuarios Recientes */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 text-lg mb-6">Nuevos Vendedores</h3>
          <div className="space-y-6">
            {users.slice(0, 5).map((u) => (
              <div key={u._id} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                    {u.storeName?.charAt(0) || "S"}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 leading-none">{u.storeName || "Sin tienda"}</p>
                    <p className="text-xs text-slate-400 mt-1">{u.email}</p>
                  </div>
                </div>
                <button className="p-2 opacity-0 group-hover:opacity-100 bg-slate-50 rounded-lg transition-all text-slate-400 hover:text-blue-600">
                  <ArrowUpRight size={18} />
                </button>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 rounded-xl bg-slate-50 text-slate-600 text-sm font-bold hover:bg-slate-100 transition-colors">
            Ver todos los usuarios
          </button>
        </div>
      </div>
    </div>
  );
}

/** Componente de Tarjeta de Estadística **/
function StatCard({ title, value, trend, up, icon, bg }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 ${bg} rounded-2xl group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${up ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
          {up ? <TrendingUp size={12}/> : <TrendingDown size={12}/>}
          {trend}
        </div>
      </div>
      <div>
        <p className="text-slate-400 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-black text-slate-800 mt-1">{value}</h3>
      </div>
    </div>
  );
}

/** Pantalla de Carga (Skeleton) **/
function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse p-6">
      <div className="h-10 bg-slate-200 rounded-lg w-1/4"></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1,2,3,4].map(i => <div key={i} className="h-32 bg-slate-200 rounded-3xl"></div>)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 h-[400px] bg-slate-200 rounded-3xl"></div>
        <div className="h-[400px] bg-slate-200 rounded-3xl"></div>
      </div>
    </div>
  );
}