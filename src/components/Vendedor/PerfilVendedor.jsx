import { useEffect, useState } from "react";
import api from "../../api/axios";
import { User, Mail, Phone, Store, Pencil } from "lucide-react";

export default function PerfilVendedor() {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    storeName: ""
  });

  const fetchPerfil = async () => {
    try {
      const res = await api.get("/vendedor/perfil");
      setPerfil(res.data);
      setForm({
        name: res.data.name || "",
        lastName: res.data.lastName || "",
        email: res.data.email || "",
        phone: res.data.phone || "",
        storeName: res.data.storeName || ""
      });
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const updatePerfil = async () => {
    try {
      const res = await api.put("/vendedor/update", form);
      setPerfil(res.data.data);
      setEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPerfil();
  }, []);

  if (loading) return <p className="text-center mt-10">Cargando perfil...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <div className="bg-white shadow-xl rounded-3xl p-8 relative">

        {/* Header con foto y nombre */}
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex justify-center items-center text-4xl font-bold">
            {perfil.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{perfil.name} {perfil.lastName}</h1>
            <p className="text-gray-500">{perfil.storeName}</p>
            <p className="text-gray-400 text-sm">{perfil.email}</p>
          </div>

          {/* Botón editar */}
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition-colors"
            >
              <Pencil size={16} />
              Editar
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 bg-gray-300 rounded-xl hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={updatePerfil}
                className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
              >
                Guardar
              </button>
            </div>
          )}
        </div>

        {/* Información */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CardItem
            label="Nombre"
            value={editing ? form.name : perfil.name}
            icon={<User size={20} className="text-blue-600" />}
            editable={editing}
            onChange={(v) => setForm({ ...form, name: v })}
          />
          <CardItem
            label="Apellido"
            value={editing ? form.lastName : perfil.lastName}
            icon={<User size={20} className="text-blue-600" />}
            editable={editing}
            onChange={(v) => setForm({ ...form, lastName: v })}
          />
          <CardItem
            label="Correo"
            value={perfil.email}
            icon={<Mail size={20} className="text-blue-600" />}
          />
          <CardItem
            label="Teléfono"
            value={editing ? form.phone : perfil.phone}
            icon={<Phone size={20} className="text-blue-600" />}
            editable={editing}
            onChange={(v) => setForm({ ...form, phone: v })}
          />
          <CardItem
            label="Tienda"
            value={editing ? form.storeName : perfil.storeName}
            icon={<Store size={20} className="text-blue-600" />}
            editable={editing}
            onChange={(v) => setForm({ ...form, storeName: v })}
          />
        </div>
      </div>
    </div>
  );
}

/* -------------------------
  Componente CardItem profesional editable
---------------------------*/
function CardItem({ label, value, icon, editable, onChange }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="p-3 bg-blue-100 rounded-full">{icon}</div>
      <div className="flex-1">
        <p className="text-gray-400 text-sm">{label}</p>
        {editable ? (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="mt-1 w-full border px-3 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        ) : (
          <p className="text-gray-900 font-semibold">{value}</p>
        )}
      </div>
    </div>
  );
}
