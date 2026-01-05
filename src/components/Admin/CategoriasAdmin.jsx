import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { Trash2, Pencil, CheckCircle, Plus } from "lucide-react";

// Lista de rubros principales del marketplace para asignar a las subcategorías
const SECTORES_MARKETPLACE = [
  "Tecnología y Electrónica",
  "Moda y Accesorios",
  "Hogar y Muebles",
  "Salud y Belleza",
  "Deportes y Fitness",
  "Supermercado y Alimentos",
  "Restaurantes y Gastronomía",
  "Juguetes y Bebés",
  "Mascotas",
  "Ferretería y Construcción",
  "Automotriz",
  "Papelería y Oficina",
  "Arte y Artesanías",
  "Servicios Profesionales",
  "Otros"
];

export default function CategoriasAdmin() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(null);
  const [form, setForm] = useState({ 
    name: "", 
    categoriaPadre: "", 
    usaTalla: false 
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState(null);

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
    if (!form.name || !form.categoriaPadre) {
      return alert("Por favor completa el nombre y selecciona un rubro");
    }
    try {
      await api.post("/createTipe", form);
      setForm({ name: "", categoriaPadre: "", usaTalla: false });
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
      await api.put(`/update/tipe/${editingId}`, form);
      setEditingId(null);
      setForm({ name: "", categoriaPadre: "", usaTalla: false });
      fetchCategorias();
      showMessage("✏️ Actualizado satisfactoriamente");
    } catch (error) {
      console.log(error);
    }
  };

  const startEdit = (cat) => {
    setEditingId(cat._id);
    setForm({ 
      name: cat.name, 
      categoriaPadre: cat.categoriaPadre || "", 
      usaTalla: cat.usaTalla || false 
    });
  };

  const totalPages = Math.ceil(categorias.length / perPage);
  const start = (page - 1) * perPage;
  const paginated = categorias.slice(start, start + perPage);

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
        Gestión de Subcategorías
      </h1>

      {message && (
        <div className="mb-4 bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded-lg text-center font-medium">
          {message}
        </div>
      )}

      <div className="bg-white shadow-lg rounded-xl p-4 md:p-6 border">
        
        {/* Formulario de Creación / Edición */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-600">Nombre del Producto</label>
            <input
              type="text"
              placeholder="Ej: Camisas, Taladros..."
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-600">Rubro de la Tienda</label>
            <select
              value={form.categoriaPadre}
              onChange={(e) => setForm({ ...form, categoriaPadre: e.target.value })}
              className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Seleccionar Sector...</option>
              {SECTORES_MARKETPLACE.map((sector) => (
                <option key={sector} value={sector}>{sector}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 pb-2">
            <input
              type="checkbox"
              id="usaTalla"
              checked={form.usaTalla}
              onChange={(e) => setForm({ ...form, usaTalla: e.target.checked })}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="usaTalla" className="text-sm font-medium text-gray-700 cursor-pointer">
              ¿Requiere Tallas?
            </label>
          </div>

          <div className="flex gap-2">
            {editingId ? (
              <button
                onClick={handleUpdate}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded-lg shadow"
              >
                <CheckCircle size={18} /> Guardar
              </button>
            ) : (
              <button
                onClick={handleCreate}
                className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 transition text-white px-4 py-2 rounded-lg shadow"
              >
                <Plus size={18} /> Agregar
              </button>
            )}
            {editingId && (
              <button 
                onClick={() => { setEditingId(null); setForm({name: "", categoriaPadre: "", usaTalla: false}); }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse rounded-lg overflow-hidden shadow-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3 text-left">Subcategoría</th>
                <th className="p-3 text-left">Sector (Padre)</th>
                <th className="p-3 text-center">Tallas</th>
                <th className="p-3 text-center w-32">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {paginated.map((cat) => (
                <tr key={cat._id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-3 text-gray-800 font-medium">{cat.name}</td>
                  <td className="p-3 text-gray-600">
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold border border-blue-100 uppercase">
                      {cat.categoriaPadre || "No asignado"}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    {cat.usaTalla ? (
                      <span className="text-green-600 text-xs font-bold uppercase bg-green-50 px-2 py-1 rounded border border-green-100">Sí</span>
                    ) : (
                      <span className="text-gray-400 text-xs">No</span>
                    )}
                  </td>
                  <td className="p-3 flex justify-center gap-3">
                    <button
                      onClick={() => startEdit(cat)}
                      className="text-blue-600 hover:text-blue-800 transition p-1 hover:bg-blue-50 rounded"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => handleDelete(cat._id)}
                      className="text-red-600 hover:text-red-800 transition p-1 hover:bg-red-50 rounded"
                    >
                      {loading === cat._id ? (
                        <span className="animate-pulse text-sm">...</span>
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

        {/* Paginación */}
        <div className="flex flex-col sm:flex-row justify-center items-center mt-6 gap-3">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className={`px-3 py-1 rounded ${
              page === 1
                ? "bg-gray-300 cursor-not-allowed text-gray-500"
                : "bg-gray-800 text-white hover:bg-black"
            }`}
          >
            ⬅
          </button>

          <span className="text-gray-700 font-medium text-center">
            Página {page} de {totalPages || 1}
          </span>

          <button
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage(page + 1)}
            className={`px-3 py-1 rounded ${
              page === totalPages || totalPages === 0
                ? "bg-gray-300 cursor-not-allowed text-gray-500"
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