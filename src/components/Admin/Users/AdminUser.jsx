import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../api/axios";

export default function AdminUser() {
  const { id } = useParams(); // ID de la URL
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    lastName: "",
    identity: "",
    email: "",
    phone: "",
    adress: "",
  });

  // Cargar datos del usuario
  const fetchUser = async () => {
    try {
      const res = await api.get(`/users/${id}`);
      setForm({
        name: res.data.name || "",
        lastName: res.data.lastName || "",
        identity: res.data.identity || "",
        email: res.data.email || "",
        phone: res.data.phone || "",
        adress: res.data.adress || "",
      });
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Actualizar usuario
  const updateUser = async () => {
    try {
      await api.put(`/users/${id}`, form);
      navigate("/admin/usuarios"); // volver a la lista
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) return <p>Cargando datos...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Actualizar Usuario</h1>

      {/* FORMULARIO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {Object.keys(form).map((field) => (
          <div key={field} className="flex flex-col">
            <label className="font-semibold capitalize">{field}</label>
            <input
              type="text"
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              className="border p-2 rounded"
            />
          </div>
        ))}

      </div>

      <button
        onClick={updateUser}
        className="mt-6 bg-green-600 text-white px-5 py-2 rounded"
      >
        Guardar Cambios
      </button>
    </div>
  );
}
