import React, { useEffect, useState } from "react";
import {
  BarChart2,
  ShoppingBag,
  Users,
  DollarSign,
} from "lucide-react";
import api from "../../api/axios"; // AJUSTA el path según tu estructura

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
      <div className="p-6 text-center text-gray-600">
        Cargando datos del dashboard...
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50 text-gray-900">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Panel de Control</h1>
        <p className="text-gray-500 text-sm mt-1">
          Resumen general de actividad y métricas clave.
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        {/* Ventas – Azul */}
        <div className="bg-white shadow-sm p-5 rounded-xl border border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-blue-600 font-medium text-sm">Ventas Totales</p>
              <h3 className="text-3xl font-bold mt-1 text-blue-700">$12,450</h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Productos – Naranja */}
        <div className="bg-white shadow-sm p-5 rounded-xl border border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-orange-500 font-medium text-sm">Productos Activos</p>
              <h3 className="text-3xl font-bold mt-1 text-orange-600">245</h3>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Usuarios – ROJO (DINÁMICO) */}
        <div className="bg-white shadow-sm p-5 rounded-xl border border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-red-500 font-medium text-sm">Usuarios Registrados</p>
              <h3 className="text-3xl font-bold mt-1 text-red-600">
                {users.length}
              </h3>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <Users className="w-6 h-6 text-red-500" />
            </div>
          </div>
        </div>

        {/* Visitas Hoy – Verde */}
        <div className="bg-white shadow-sm p-5 rounded-xl border border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-green-500 font-medium text-sm">Visitas Hoy</p>
              <h3 className="text-3xl font-bold mt-1 text-green-600">
                1,532
              </h3>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <BarChart2 className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

      </div>

      {/* GRAFICA FUTURA */}
      <div className="bg-white shadow-sm p-6 rounded-xl border border-gray-100">
        <h2 className="text-lg font-semibold mb-4">Actividad Reciente</h2>

        <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
          Gráfica próximamente
        </div>
      </div>
    </div>
  );
}
