import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { Users, Edit3, Trash2, CheckCircle, XCircle } from "lucide-react";

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
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este usuario?")) return;
    try {
      await api.delete(`/user/admin/delete/${id}`);
      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  const validateSeller = async (id, action) => {
    const text =
      action === "approve"
        ? "¿Aprobar este vendedor?"
        : "¿Rechazar este vendedor?";

    if (!window.confirm(text)) return;

    try {
      await api.put(`/admin/seller/validate/${id}`, { action });
      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  // Paginación
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard Admin</h1>

      {/* Resumen */}
      <div className="bg-white shadow p-6 rounded-xl border flex items-center gap-6 mb-8">
        <Users className="text-green-500" size={40} />
        <div>
          <p className="text-sm text-gray-500">Usuarios registrados</p>
          <p className="text-4xl font-bold text-green-600">{users.length}</p>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white shadow rounded-xl border p-6">
        <h2 className="text-2xl font-semibold mb-4">Usuarios</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Nombre</th>
                <th className="p-3 text-left">Apellido</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Teléfono</th>
                <th className="p-3 text-left">Identificación</th>
                <th className="p-3 text-left">Rol</th>
                <th className="p-3 text-left">Estado</th>
                <th className="p-3 text-left">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {currentUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.lastName || "—"}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.phone || "—"}</td>
                  <td className="p-3">{user.identity || "—"}</td>
                  <td className="p-3 capitalize">{user.rol}</td>

                  {/* ESTADO */}
                  <td className="p-3">
                    {user.rol === "seller" ? (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          user.sellerStatus === "active"
                            ? "bg-green-100 text-green-800"
                            : user.sellerStatus === "pending_review"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.sellerStatus}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>

                  {/* ACCIONES */}
                  <td className="p-3 flex gap-2 flex-wrap">
                    {user.rol === "seller" &&
                      user.sellerStatus === "pending_review" && (
                        <>
                          <button
                            onClick={() =>
                              validateSeller(user._id, "approve")
                            }
                            className="bg-green-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1 hover:bg-green-600"
                          >
                            <CheckCircle size={14} /> Aprobar
                          </button>

                          <button
                            onClick={() =>
                              validateSeller(user._id, "reject")
                            }
                            className="bg-red-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1 hover:bg-red-600"
                          >
                            <XCircle size={14} /> Rechazar
                          </button>
                        </>
                      )}

                    <button
                      onClick={() => alert("Editar usuario")}
                      className="bg-blue-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1 hover:bg-blue-600"
                    >
                      <Edit3 size={14} /> Editar
                    </button>

                    <button
                      onClick={() => handleDelete(user._id)}
                      className="bg-gray-700 text-white px-2 py-1 rounded text-xs flex items-center gap-1 hover:bg-gray-800"
                    >
                      <Trash2 size={14} /> Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINACIÓN */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Anterior
          </button>

          <span className="text-sm">
            Página {currentPage} de {totalPages}
          </span>

          <button
            onClick={() =>
              setCurrentPage((p) => Math.min(p + 1, totalPages))
            }
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
