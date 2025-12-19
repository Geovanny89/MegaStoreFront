import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function EditarPerfilVendedor() {
  const [form, setForm] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    storeName: ""
  });

  const [nequiQR, setNequiQR] = useState(null);
  const [daviplataQR, setDaviplataQR] = useState(null);
  const [loading, setLoading] = useState(false);

  // Cargar datos actuales
  const fetchVendedor = async () => {
    try {
      const res = await api.get("/vendedor/perfil");
      setForm(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchVendedor();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      // Campos normales
      Object.entries(form).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      // Archivos QR
      if (nequiQR) formData.append("nequiQR", nequiQR);
      if (daviplataQR) formData.append("daviplataQR", daviplataQR);

      await api.put("/vendedor/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      alert("Perfil actualizado correctamente");
      fetchVendedor();
    } catch (err) {
      console.error(err);
      alert("Error al actualizar perfil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Editar Perfil del Vendedor</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          name="name"
          placeholder="Nombre"
          className="w-full border p-2 rounded"
          value={form.name || ""}
          onChange={handleChange}
        />

        <input
          type="text"
          name="lastName"
          placeholder="Apellido"
          className="w-full border p-2 rounded"
          value={form.lastName || ""}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Correo"
          className="w-full border p-2 rounded"
          value={form.email || ""}
          onChange={handleChange}
        />

        <input
          type="text"
          name="phone"
          placeholder="Teléfono"
          className="w-full border p-2 rounded"
          value={form.phone || ""}
          onChange={handleChange}
        />

        <input
          type="text"
          name="storeName"
          placeholder="Nombre de la tienda"
          className="w-full border p-2 rounded"
          value={form.storeName || ""}
          onChange={handleChange}
        />

        {/* ================= QR NEQUI ================= */}
        <div>
          <label className="block text-sm font-medium mb-1">
            QR Nequi
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNequiQR(e.target.files[0])}
          />
        </div>

        {/* ================= QR DAVIPLATA ================= */}
        <div>
          <label className="block text-sm font-medium mb-1">
            QR Daviplata
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setDaviplataQR(e.target.files[0])}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full disabled:opacity-50"
        >
          {loading ? "Guardando..." : "Guardar Cambios"}
        </button>
      </form>
    </div>
  );
}
