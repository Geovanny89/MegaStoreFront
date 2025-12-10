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

  const [loading, setLoading] = useState(false);

  // Cargar datos actuales del vendedor
  const fetchVendedor = async () => {
    try {
      const res = await api.get("/vendedor/perfil");
      setForm(res.data);
    } catch (err) {
      console.log(err);
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
      await api.put("/vendedor/update", form);
      alert("Perfil actualizado correctamente");
    } catch (err) {
      console.log(err);
      alert("Error al actualizar");
    }

    setLoading(false);
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
          value={form.name}
          onChange={handleChange}
        />

        <input
          type="text"
          name="lastName"
          placeholder="Apellido"
          className="w-full border p-2 rounded"
          value={form.lastName}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Correo"
          className="w-full border p-2 rounded"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="text"
          name="phone"
          placeholder="Teléfono"
          className="w-full border p-2 rounded"
          value={form.phone}
          onChange={handleChange}
        />

        <input
          type="text"
          name="storeName"
          placeholder="Nombre de la tienda"
          className="w-full border p-2 rounded"
          value={form.storeName}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          {loading ? "Guardando..." : "Guardar Cambios"}
        </button>
      </form>
    </div>
  );
}
