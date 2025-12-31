import React, { useEffect, useState } from "react";
import {
  ShoppingBag,
  Users,
  DollarSign,
} from "lucide-react";
import api from "../../api/axios"; 

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
      console.error("Error al obtener usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 font-medium">Cargando métricas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50 text-gray-900">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Panel de Control</h1>
        <p className="text-gray-500 text-sm mt-1">
          Resumen general de actividad y métricas clave del marketplace.
        </p>
      </div>

      {/* STATS CARDS - Ahora en grid de 3 columnas para que se vea balanceado */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        {/* Ventas – Azul */}
        <div className="bg-white shadow-sm p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-blue-600 font-bold text-xs uppercase tracking-wider">Ventas Totales</p>
              <h3 className="text-3xl font-black mt-2 text-slate-800">$12,450</h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Productos – Naranja */}
        <div className="bg-white shadow-sm p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-orange-500 font-bold text-xs uppercase tracking-wider">Productos Activos</p>
              <h3 className="text-3xl font-black mt-2 text-slate-800">245</h3>
            </div>
            <div className="p-3 bg-orange-50 rounded-xl">
              <ShoppingBag className="w-6 h-6 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Usuarios – Rojo */}
        <div className="bg-white shadow-sm p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-red-500 font-bold text-xs uppercase tracking-wider">Usuarios Registrados</p>
              <h3 className="text-3xl font-black mt-2 text-slate-800">
                {users.length}
              </h3>
            </div>
            <div className="p-3 bg-red-50 rounded-xl">
              <Users className="w-6 h-6 text-red-500" />
            </div>
          </div>
        </div>

      </div>

      {/* SECCIÓN INFERIOR */}
      <div className="bg-white shadow-sm p-8 rounded-2xl border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">Actividad Reciente</h2>
          <span className="text-xs font-medium text-gray-400">Próxima actualización: Gráficas de ventas</span>
        </div>

        <div className="w-full h-64 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400">
          <div className="p-4 bg-white rounded-full shadow-sm mb-3">
             <BarChart2 className="w-8 h-8 text-slate-300" />
          </div>
          <p className="text-sm font-medium">El módulo de gráficas se activará tras procesar más datos.</p>
        </div>
      </div>
    </div>
  );
}