import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../api/axios";
import { FiEdit2, FiSearch, FiMail, FiUser, FiShoppingBag } from "react-icons/fi";

export default function AdminUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/all/admin/user");
        setUsers(res.data);
      } catch (err) {
        console.error("Error al cargar usuarios:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Función para renderizar el badge del rol
  const renderRoleBadge = (role) => {
    const isSeller = role === 'seller';
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
        isSeller 
          ? "bg-amber-100 text-amber-700 border border-amber-200" 
          : "bg-blue-100 text-blue-700 border border-blue-200"
      }`}>
        {isSeller ? <FiShoppingBag size={12} /> : <FiUser size={12} />}
        {isSeller ? "Vendedor" : "Cliente"}
      </span>
    );
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="p-4 sm:p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* ENCABEZADO */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Comunidad Marketplace</h1>
            <p className="text-slate-500">Gestión de roles y perfiles registrados</p>
          </div>

          <div className="relative group">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              className="pl-10 pr-4 py-2.5 w-full md:w-80 bg-white border border-slate-200 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* TABLA */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Usuario</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Email</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 text-center">Rol</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-white shadow-sm ${
                          user.rol === 'seller' ? 'bg-amber-500' : 'bg-indigo-500'
                        }`}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-slate-700">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <FiMail size={14} className="text-slate-400" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {renderRoleBadge(user.rol)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <Link
                        to={`/admin/usuarios/${user._id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-indigo-500 hover:text-indigo-600 text-slate-700 text-xs font-black rounded-xl transition-all shadow-sm"
                      >
                        <FiEdit2 size={12} />
                        DETALLES
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
            <span className="text-xs font-bold text-slate-400">Total: {filteredUsers.length} registros</span>
          </div>
        </div>
      </div>
    </div>
  );
}