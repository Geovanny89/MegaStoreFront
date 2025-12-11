import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { Users, Edit3, Trash2 } from "lucide-react";

export default function HomeAdmin() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/all/admin/user");
      setUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este usuario?")) return;
    try {
      await api.delete(`/user/admin/delete/${id}`);
      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (id) => {
    alert("Función de editar usuario: " + id);
  };

  // Lógica del paginado
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard Admin</h1>

      {/* Tarjeta de resumen */}
      <div className="bg-white shadow p-6 rounded-xl border flex items-center gap-6 mb-8">
        <Users className="text-green-400" size={40} />
        <div>
          <p className="text-sm text-gray-500">Usuarios registrados</p>
          <p className="text-4xl font-bold text-green-600">{users.length}</p>
        </div>
      </div>

      {/* Lista de usuarios paginada */}
      <div className="bg-white shadow rounded-xl border p-6">
        <h2 className="text-2xl font-semibold mb-4">Usuarios</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left border-b border-gray-200">Nombre</th>
                <th className="p-3 text-left border-b border-gray-200">Apellido</th>
                <th className="p-3 text-left border-b border-gray-200">Email</th>
                <th className="p-3 text-left border-b border-gray-200">Teléfono</th>
                <th className="p-3 text-left border-b border-gray-200">Identificación</th>
                <th className="p-3 text-left border-b border-gray-200">Rol</th>
                <th className="p-3 text-left border-b border-gray-200">Estado</th>
                <th className="p-3 text-left border-b border-gray-200">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition">
                  <td className="p-3 border-b border-gray-200">{user.name}</td>
                  <td className="p-3 border-b border-gray-200">{user.lastName}</td>
                  <td className="p-3 border-b border-gray-200">{user.email}</td>
                  <td className="p-3 border-b border-gray-200">{user.phone}</td>
                  <td className="p-3 border-b border-gray-200">{user.identity}</td>
                  <td className="p-3 border-b border-gray-200">{user.rol}</td>
                  <td className="p-3 border-b border-gray-200">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        user.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="p-3 border-b border-gray-200 flex gap-2">
                    <button
                      onClick={() => handleEdit(user._id)}
                      className="flex items-center gap-1 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                      <Edit3 size={16} /> Editar
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      <Trash2 size={16} /> Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="flex justify-between mt-4">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Anterior
          </button>
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
