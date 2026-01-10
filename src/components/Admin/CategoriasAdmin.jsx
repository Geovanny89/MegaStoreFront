import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { Trash2, Pencil, CheckCircle, Plus, X } from "lucide-react";

// Lista de rubros principales del marketplace
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
    setTimeout(() => setMessage(null), 3000);
  };

  const fetchCategorias = async () => {
    try {
      const res = await api.get("/all/tipes");
      setCategorias(res.data);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
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
      console.error(error);
      alert("Error al crear categoría");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("⚠️ ¿Estás seguro que deseas eliminar esta categoría?")) return;

    try {
      setLoading(id);
      await api.delete(`/delete/tipe/${id}`);
      fetchCategorias();
      setLoading(null);
      showMessage("🗑️ Eliminado satisfactoriamente");
    } catch (error) {
      console.error(error);
      setLoading(null);
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
      console.error(error);
    }
  };

  const startEdit = (cat) => {
    setEditingId(cat._id);
    setForm({ 
      name: cat.name, 
      categoriaPadre: cat.categoriaPadre || "", 
      usaTalla: cat.usaTalla || false 
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = Math.ceil(categorias.length / perPage);
  const start = (page - 1) * perPage;
  const paginated = categorias.slice(start, start + perPage);

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto min-h-screen text-gray-900">
      <h1 className="text-2xl md:text-3xl font-black mb-6 flex items-center gap-3">
        <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
        Gestión de Subcategorías
      </h1>

      {message && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-6 py-3 rounded-2xl text-center font-bold shadow-sm animate-in fade-in slide-in-from-top-2">
          {message}
        </div>
      )}

      {/* Formulario de Creación / Edición */}
      <div className="bg-white dark:bg-slate-900 shadow-xl rounded-[2rem] p-6 md:p-8 border border-gray-100 dark:border-slate-800 mb-10">
        <h2 className="text-lg font-bold mb-6 text-gray-400 uppercase tracking-widest text-sm">
          {editingId ? "Editar Subcategoría" : "Nueva Subcategoría"}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black text-gray-500 uppercase ml-1">Nombre</label>
            <input
              type="text"
              placeholder="Ej: Camisas, Taladros..."
              value={form.name || ""}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white font-medium transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-black text-gray-500 uppercase ml-1">Rubro Padre</label>
            <select
              value={form.categoriaPadre || ""}
              onChange={(e) => setForm({ ...form, categoriaPadre: e.target.value })}
              className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white font-medium transition-all appearance-none"
            >
              <option value="" disabled>Seleccionar Sector...</option>
              {SECTORES_MARKETPLACE.map((sector) => (
                <option key={sector} value={sector} className="text-gray-900">
                  {sector}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 bg-gray-50 dark:bg-slate-800 p-3 rounded-xl border border-gray-200 dark:border-slate-700 h-[50px]">
            <input
              type="checkbox"
              id="usaTalla"
              checked={form.usaTalla}
              onChange={(e) => setForm({ ...form, usaTalla: e.target.checked })}
              className="w-5 h-5 text-blue-600 rounded-lg focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="usaTalla" className="text-sm font-bold text-gray-600 dark:text-gray-300 cursor-pointer select-none">
              ¿Requiere Tallas?
            </label>
          </div>

          <div className="flex gap-2">
            {editingId ? (
              <>
                <button
                  onClick={handleUpdate}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95"
                >
                  <CheckCircle size={18} /> Actualizar
                </button>
                <button 
                  onClick={() => { setEditingId(null); setForm({name: "", categoriaPadre: "", usaTalla: false}); }}
                  className="p-3 bg-gray-100 dark:bg-slate-800 text-gray-500 rounded-xl hover:bg-gray-200 transition-all"
                  title="Cancelar"
                >
                  <X size={20} />
                </button>
              </>
            ) : (
              <button
                onClick={handleCreate}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 dark:bg-blue-600 hover:bg-black dark:hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-bold shadow-lg transition-all active:scale-95"
              >
                <Plus size={18} /> Agregar Subcategoría
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabla de Resultados */}
      <div className="bg-white dark:bg-slate-900 shadow-xl rounded-[2rem] overflow-hidden border border-gray-100 dark:border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-800/50 text-gray-400 text-xs font-black uppercase tracking-widest">
                <th className="p-5">Subcategoría</th>
                <th className="p-5">Sector (Padre)</th>
                <th className="p-5 text-center">Tallas</th>
                <th className="p-5 text-center">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
              {paginated.length > 0 ? (
                paginated.map((cat) => (
                  <tr key={cat._id} className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="p-5">
                      <p className="font-bold text-gray-800 dark:text-gray-200">{cat.name}</p>
                    </td>
                    <td className="p-5">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
                        {cat.categoriaPadre || "No asignado"}
                      </span>
                    </td>
                    <td className="p-5 text-center">
                      {cat.usaTalla ? (
                        <span className="text-green-500 font-bold text-xs bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-lg">SI</span>
                      ) : (
                        <span className="text-gray-300 dark:text-gray-600 text-xs">—</span>
                      )}
                    </td>
                    <td className="p-5">
                      <div className="flex justify-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => startEdit(cat)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(cat._id)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                        >
                          {loading === cat._id ? (
                            <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-20 text-center text-gray-400 font-medium">
                    No hay subcategorías registradas aún.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="p-6 bg-gray-50 dark:bg-slate-800/30 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500 font-bold">
              Página <span className="text-blue-600">{page}</span> de {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl disabled:opacity-30 font-bold text-gray-600 dark:text-gray-300 hover:shadow-md transition-all"
              >
                Anterior
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl disabled:opacity-30 font-bold text-gray-600 dark:text-gray-300 hover:shadow-md transition-all"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}