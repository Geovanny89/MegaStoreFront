import { useEffect, useState, useRef } from "react";
import api from "../../../api/axios";
import { useNavigate } from "react-router-dom";

export default function EditarPerfil() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    name: "",
    lastName: "",
    identity: "",
    email: "",
    phone: "",
  });

  const [addresses, setAddresses] = useState([]);

  // Contenedor de timeouts para debounce (uno por dirección)
  const typingTimeouts = useRef({});

  // --------------------------------------------------------
  // CARGAR USUARIO
  // --------------------------------------------------------
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/user/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = res.data;

        setForm({
          name: user.name || "",
          lastName: user.lastName || "",
          identity: user.identity || "",
          email: user.email || "",
          phone: user.phone || "",
        });

        setAddresses(user.addresses || []);
      } catch (error) {
        console.error("Error obteniendo datos:", error);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // --------------------------------------------------------
  // ACTUALIZAR DIRECCIÓN COMPLETA
  // --------------------------------------------------------
  const updateAddress = async (addressId, fullAddress) => {
    try {
      const res = await api.put(
        `/user/address/${addressId}`,
        fullAddress,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAddresses(res.data.addresses);
    } catch (error) {
      console.error("Error actualizando dirección:", error);
    }
  };

  // --------------------------------------------------------
  // EDITAR UNA DIRECCIÓN CON DEBOUNCE
  // --------------------------------------------------------
  const handleAddressChange = (index, field, value) => {
    const updated = [...addresses];
    updated[index][field] = value;
    setAddresses(updated);

    const addressId = updated[index]._id;

    // Limpiar timeout previo si existe
    if (typingTimeouts.current[addressId]) {
      clearTimeout(typingTimeouts.current[addressId]);
    }

    // Activar Debounce (esperar 500 ms antes de enviar al backend)
    typingTimeouts.current[addressId] = setTimeout(() => {
      updateAddress(addressId, updated[index]);
    }, 500);
  };

  // --------------------------------------------------------
  // ESTABLECER DIRECCIÓN PRINCIPAL
  // --------------------------------------------------------
  const setDefault = async (addressId) => {
    try {
      const res = await api.put(
        `/user/address/default/${addressId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAddresses(res.data.addresses);
    } catch (error) {
      console.error("Error estableciendo default:", error);
    }
  };

  // --------------------------------------------------------
  // ELIMINAR DIRECCIÓN
  // --------------------------------------------------------
  const deleteAddress = async (addressId) => {
    try {
      const res = await api.delete(
        `/user/address/${addressId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAddresses(res.data.addresses);
    } catch (error) {
      console.error("Error eliminando dirección:", error);
    }
  };

  // --------------------------------------------------------
  // GUARDAR PERFIL
  // --------------------------------------------------------
  const actualizarPerfil = async (e) => {
    e.preventDefault();

    try {
      await api.put(
        `/user/update`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate("/perfil");
    } catch (error) {
      console.error("Error actualizando usuario:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-3xl shadow-xl mt-10 border border-gray-200">

      <h2 className="text-3xl font-bold mb-8 text-gray-800 tracking-tight">
        Editar Perfil
      </h2>

      <form onSubmit={actualizarPerfil} className="space-y-6">

        {/* CAMPOS DE PERFIL */}
        {[
          { label: "Nombre", name: "name" },
          { label: "Apellido", name: "lastName" },
          { label: "Identificación", name: "identity" },
          { label: "Correo electrónico", name: "email" },
          { label: "Teléfono", name: "phone" },
        ].map((item) => (
          <div key={item.name}>
            <label className="font-medium text-gray-700">{item.label}</label>
            <input
              type="text"
              name={item.name}
              value={form[item.name]}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl mt-1 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        ))}

        {/* DIRECCIONES */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
            Direcciones
          </h3>

          {addresses.length > 0 ? (
            <div className="mt-4 space-y-6">
              {addresses.map((addr, index) => (
                <div
                  key={addr._id}
                  className="p-4 bg-gray-100 rounded-xl border space-y-3"
                >

                  {/* CAMPOS DIRECCIÓN */}
                  {[
                    { label: "Etiqueta", field: "label" },
                    { label: "Calle", field: "street" },
                    { label: "Ciudad", field: "city" },
                    { label: "Departamento", field: "state" },
                    { label: "Código Postal", field: "postalCode" },
                  ].map((item) => (
                    <div key={item.field}>
                      <label>{item.label}</label>
                      <input
                        type="text"
                        value={addr[item.field] || ""}
                        onChange={(e) =>
                          handleAddressChange(index, item.field, e.target.value)
                        }
                        className="w-full p-2 border rounded-lg mt-1"
                      />
                    </div>
                  ))}

                  {/* BOTONES */}
                  <div className="flex items-center gap-3 mt-4">
                    {addr.isDefault ? (
                      <span className="bg-green-600 text-white px-4 py-2 rounded-xl font-semibold shadow">
                        Dirección principal
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setDefault(addr._id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold shadow"
                      >
                        Seleccionar como principal
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => deleteAddress(addr._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-semibold shadow"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 mt-2">No hay direcciones registradas.</p>
          )}
        </div>

        {/* BOTONES FINALES */}
        <div className="space-y-3 mt-8">
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold shadow-md"
          >
            Guardar Cambios
          </button>

          <button
            type="button"
            onClick={() => navigate("/perfil")}
            className="w-full bg-gray-400 hover:bg-gray-500 text-white py-3 rounded-xl font-semibold"
          >
            Cancelar
          </button>
        </div>

      </form>
    </div>
  );
}
