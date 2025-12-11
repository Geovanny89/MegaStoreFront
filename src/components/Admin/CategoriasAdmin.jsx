import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { Trash2, Pencil, CheckCircle, Plus } from "lucide-react";

export default function CategoriasAdmin() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(null);
  const [form, setForm] = useState({ name: "" });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState(null); // ⭐ mensaje de éxito

  const [page, setPage] = useState(1);
  const perPage = 10;

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 2000);
  };

  const fetchCategorias = async () => {
    try {
      const res = await api.get("/all/tipes");
      setCategorias(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const handleCreate = async () => {
    try {
      await api.post("/createTipe", form);
      setForm({ name: "" });
      fetchCategorias();
      showMessage("✔️ Categoría creada satisfactoriamente");
    } catch (error) {
      console.log(error);
      alert("Error al crear categoría");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "⚠️ ¿Estás seguro que deseas eliminar esta categoría?"
    );

    if (!confirmDelete) return;

    try {
      setLoading(id);
      await api.delete(`/delete/tipe/${id}`);
      fetchCategorias();
      setLoading(null);
      showMessage("🗑️ Eliminado satisfactoriamente");
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/update/tipe/${editingId}`, { name: form.name });
      setEditingId(null);
      setForm({ name: "" });
      fetchCategorias();
      showMessage("✏️ Actualizado satisfactoriamente");
    } catch (error) {
      console.log(error);
    }
  };

  const startEdit = (cat) => {
    setEditingId(cat._id);
    setForm({ name: cat.name });
  };

  const totalPages = Math.ceil(categorias.length / perPage);
  const start = (page - 1) * perPage;
  const paginated = categorias.slice(start, start + perPage);

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
        Categorías
      </h1>

      {/* ⭐ Mensaje de éxito */}
      {message && (
        <div className="mb-4 bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded-lg text-center">
          {message}
        </div>
      )}

      <div className="bg-white shadow-lg rounded-xl p-4 md:p-6 border">

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
          <input
            type="text"
            placeholder="Nombre de categoría"
            value={form.name}
            onChange={(e) => setForm({ name: e.target.value })}
            className="border border-gray-300 px-4 py-2 rounded-lg w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {editingId ? (
            <button
              onClick={handleUpdate}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded-lg shadow w-full sm:w-auto"
            >
              <CheckCircle size={18} /> Guardar
            </button>
          ) : (
            <button
              onClick={handleCreate}
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 transition text-white px-4 py-2 rounded-lg shadow w-full sm:w-auto"
            >
              <Plus size={18} /> Agregar
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px] border-collapse rounded-lg overflow-hidden shadow-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3 text-left">Nombre</th>
                <th className="p-3 text-center w-32">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {paginated.map((cat) => (
                <tr key={cat._id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-3 text-gray-800">{cat.name}</td>

                  <td className="p-3 flex justify-center gap-3">
                    <button
                      onClick={() => startEdit(cat)}
                      className="text-blue-600 hover:text-blue-800 transition"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => handleDelete(cat._id)}
                      className="text-red-600 hover:text-red-800 transition"
                    >
                      {loading === cat._id ? (
                        <span className="text-sm">...</span>
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-center items-center mt-6 gap-3">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className={`px-3 py-1 rounded ${
              page === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gray-800 text-white hover:bg-black"
            }`}
          >
            ⬅
          </button>

          <span className="text-gray-700 font-medium text-center">
            Página {page} de {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className={`px-3 py-1 rounded ${
              page === totalPages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gray-800 text-white hover:bg-black"
            }`}
          >
            ➡
          </button>
        </div>
      </div>
    </div>
  );
}
