import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios"; // ajusta si tu instancia está en otra ruta

export default function EditarPerfilUser() {
  const navigate = useNavigate();

  // estados usuario y direcciones
  const [user, setUser] = useState(null); // datos básicos
  const [addresses, setAddresses] = useState([]); // lista de direcciones
  const [loading, setLoading] = useState(true);
  const [savingUser, setSavingUser] = useState(false);

  // modales / formularios
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null); // null -> crear; obj -> editar
  const [addressLoading, setAddressLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // form datos usuario
  const [formUser, setFormUser] = useState({
    name: "",
    lastName: "",
    identity: "",
    email: "",
    phone: ""
  });

  // form direccion (para modal)
  const emptyAddress = {
    label: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    reference: "",
    isDefault: false
  };
  const [formAddress, setFormAddress] = useState(emptyAddress);

  // CARGA INICIAL: usuario + direcciones
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [userRes, addrRes] = await Promise.all([
          api.get("/user/user"),
          api.get("/user/address")
        ]);
        const u = userRes.data;
        setUser(u);
        setFormUser({
          name: u.name || "",
          lastName: u.lastName || "",
          identity: u.identity || "",
          email: u.email || "",
          phone: u.phone || ""
        });

        // algunas rutas devuelven { addresses: [...] } y otras el mismo user.addresses
        const addrs = addrRes.data?.addresses ?? u.addresses ?? [];
        setAddresses(addrs);
      } catch (err) {
        console.error("Error cargando usuario/direcciones:", err);
        setErrorMessage("Error cargando datos. Intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // HELPERS UI
  const openCreateAddress = () => {
    setEditingAddress(null);
    setFormAddress(emptyAddress);
    setShowAddressModal(true);
    setErrorMessage("");
  };

  const openEditAddress = (addr) => {
    setEditingAddress(addr);
    // clonar para no mutar
    setFormAddress({
      label: addr.label || "",
      street: addr.street || "",
      city: addr.city || "",
      state: addr.state || "",
      postalCode: addr.postalCode || "",
      reference: addr.reference || "",
      isDefault: !!addr.isDefault
    });
    setShowAddressModal(true);
    setErrorMessage("");
  };

  const closeModal = () => {
    setShowAddressModal(false);
    setEditingAddress(null);
    setFormAddress(emptyAddress);
    setErrorMessage("");
  };

  // CAMBIOS FORM USER
  const handleUserChange = (e) => {
    setFormUser(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // GUARDAR DATOS USUARIO (PUT /user/update)
  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setSavingUser(true);
    setErrorMessage("");
    try {
      // enviar solo campos personales
      await api.put("/user/update", {
        name: formUser.name,
        lastName: formUser.lastName,
        identity: formUser.identity,
        email: formUser.email,
        phone: formUser.phone
      });

      // actualizar UI local
      setUser(prev => ({ ...prev, ...formUser }));
      setErrorMessage("");
    } catch (err) {
      console.error("Error guardando usuario:", err);
      setErrorMessage("No se pudo guardar la información del usuario.");
    } finally {
      setSavingUser(false);
    }
  };

  // CAMBIO FORM ADDRESS
  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormAddress(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // AGREGAR NUEVA DIRECCIÓN (POST /user/createAdress)
  const createAddress = async () => {
    try {
      setAddressLoading(true);
      setErrorMessage("");

      // validación mínima
      if (!formAddress.street || !formAddress.city) {
        setErrorMessage("Calle y ciudad son obligatorias.");
        setAddressLoading(false);
        return;
      }

      const res = await api.post("/user/createAdress", formAddress);

      // respuesta expected: { message, addresses }
      const newAddrs = res.data?.addresses ?? res.data ?? [];
      setAddresses(newAddrs);
      closeModal();
    } catch (err) {
      console.error("Error creando dirección:", err);
      setErrorMessage("No se pudo crear la dirección.");
    } finally {
      setAddressLoading(false);
    }
  };

  // EDITAR DIRECCIÓN (PUT /user/address/:id)
  const updateAddress = async () => {
    try {
      if (!editingAddress || !editingAddress._id) {
        setErrorMessage("Dirección inválida para editar.");
        return;
      }
      setAddressLoading(true);
      setErrorMessage("");

      const res = await api.put(`/user/address/${editingAddress._id}`, formAddress);
      const newAddrs = res.data?.addresses ?? res.data ?? [];
      setAddresses(newAddrs);
      closeModal();
    } catch (err) {
      console.error("Error editando dirección:", err);
      setErrorMessage("No se pudo editar la dirección.");
    } finally {
      setAddressLoading(false);
    }
  };

  // ELIMINAR DIRECCIÓN (DELETE /user/address/:id)
  const deleteAddress = async (id) => {
    if (!confirm("¿Eliminar esta dirección?")) return;
    try {
      setAddressLoading(true);
      setErrorMessage("");
      const res = await api.delete(`/user/address/${id}`);
      const newAddrs = res.data?.addresses ?? res.data ?? addresses.filter(a => a._id !== id);
      setAddresses(newAddrs);
    } catch (err) {
      console.error("Error eliminando dirección:", err);
      setErrorMessage("No se pudo eliminar la dirección.");
    } finally {
      setAddressLoading(false);
    }
  };

  // MARCAR COMO PREDETERMINADA (PUT /user/address/default/:id)
  const setDefault = async (id) => {
    try {
      setAddressLoading(true);
      setErrorMessage("");
      const res = await api.put(`/user/address/default/${id}`);
      const newAddrs = res.data?.addresses ?? res.data ?? [];
      setAddresses(newAddrs);
    } catch (err) {
      console.error("Error estableciendo default:", err);
      setErrorMessage("No se pudo establecer como principal.");
    } finally {
      setAddressLoading(false);
    }
  };

  // SUBMIT modal (crear o editar)
  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (editingAddress) await updateAddress();
    else await createAddress();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <p className="text-gray-600">Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">

        {/* Volver */}
        <div className="mb-4">
          <button
            onClick={() => navigate("/perfil")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border rounded-lg shadow-sm hover:bg-gray-50"
          >
            ← Volver
          </button>
        </div>

        {/* Card principal */}
        <div className="bg-white rounded-2xl shadow-lg border p-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">Editar Perfil</h1>

          {/* Error global */}
          {errorMessage && (
            <div className="mb-4 text-sm text-red-700 bg-red-50 p-3 rounded">
              {errorMessage}
            </div>
          )}

          {/* FORM DATOS USUARIO */}
          <form onSubmit={handleUserSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                name="name"
                value={formUser.name}
                onChange={handleUserChange}
                className="mt-1 w-full border rounded-lg p-2 focus:ring focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Apellido</label>
              <input
                name="lastName"
                value={formUser.lastName}
                onChange={handleUserChange}
                className="mt-1 w-full border rounded-lg p-2 focus:ring focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Identificación</label>
              <input
                name="identity"
                value={formUser.identity}
                onChange={handleUserChange}
                className="mt-1 w-full border rounded-lg p-2 focus:ring focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Teléfono</label>
              <input
                name="phone"
                value={formUser.phone}
                onChange={handleUserChange}
                className="mt-1 w-full border rounded-lg p-2 focus:ring focus:ring-blue-200"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Correo</label>
              <input
                name="email"
                type="email"
                value={formUser.email}
                onChange={handleUserChange}
                className="mt-1 w-full border rounded-lg p-2 focus:ring focus:ring-blue-200"
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={() => {
                  // reset form a datos cargados
                  setFormUser({
                    name: user.name || "",
                    lastName: user.lastName || "",
                    identity: user.identity || "",
                    email: user.email || "",
                    phone: user.phone || ""
                  });
                }}
                className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-50"
              >
                Reset
              </button>

              <button
                type="submit"
                disabled={savingUser}
                className={`px-5 py-2 rounded-lg text-white font-medium ${savingUser ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
              >
                {savingUser ? "Guardando..." : "Guardar datos"}
              </button>
            </div>
          </form>

          {/* SECCIÓN DIRECCIONES */}
          <hr className="my-6 border-gray-200" />
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Direcciones</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={openCreateAddress}
                className="px-3 py-1 rounded-md bg-green-600 text-white hover:bg-green-700"
              >
                + Agregar
              </button>
            </div>
          </div>

          {/* Lista de direcciones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.length === 0 && (
              <div className="col-span-2 text-gray-600">No hay direcciones registradas.</div>
            )}

            {addresses.map(addr => (
              <div key={addr._id ?? addr.id ?? Math.random()} className="p-4 border rounded-lg bg-gray-50 shadow-sm relative">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-md font-semibold text-gray-800">{addr.label || "Sin etiqueta"}</h3>
                      {addr.isDefault && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Principal</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 mt-1">{addr.street}</p>
                    <p className="text-sm text-gray-600">{addr.city}{addr.state ? ` • ${addr.state}` : ""}</p>
                    {addr.postalCode && <p className="text-sm text-gray-600">CP: {addr.postalCode}</p>}
                    {addr.reference && <p className="text-sm text-gray-600">Ref: {addr.reference}</p>}
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => openEditAddress(addr)}
                      className="px-3 py-1 text-sm border rounded hover:bg-white"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => setDefault(addr._id)}
                      disabled={addr.isDefault}
                      className={`px-3 py-1 text-sm rounded ${addr.isDefault ? "bg-gray-200 text-gray-600" : "bg-blue-600 text-white hover:bg-blue-700"}`}
                    >
                      {addr.isDefault ? "Predeterminada" : "Marcar principal"}
                    </button>

                    <button
                      onClick={() => deleteAddress(addr._id)}
                      className="px-3 py-1 text-sm text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL DIRECCIÓN */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">{editingAddress ? "Editar dirección" : "Agregar dirección"}</h3>
              <button onClick={closeModal} className="text-gray-600">Cerrar</button>
            </div>

            <form onSubmit={handleAddressSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-700">Etiqueta</label>
                <input name="label" value={formAddress.label} onChange={handleAddressChange} className="mt-1 w-full border rounded p-2" placeholder="Casa, Oficina..." />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-gray-700">Calle *</label>
                <input name="street" value={formAddress.street} onChange={handleAddressChange} className="mt-1 w-full border rounded p-2" placeholder="Calle, carrera, número..." required />
              </div>

              <div>
                <label className="block text-sm text-gray-700">Ciudad *</label>
                <input name="city" value={formAddress.city} onChange={handleAddressChange} className="mt-1 w-full border rounded p-2" placeholder="Ciudad" required />
              </div>

              <div>
                <label className="block text-sm text-gray-700">Departamento</label>
                <input name="state" value={formAddress.state} onChange={handleAddressChange} className="mt-1 w-full border rounded p-2" placeholder="Departamento" />
              </div>

              <div>
                <label className="block text-sm text-gray-700">Código Postal</label>
                <input name="postalCode" value={formAddress.postalCode} onChange={handleAddressChange} className="mt-1 w-full border rounded p-2" placeholder="Código postal" />
              </div>

              <div>
                <label className="block text-sm text-gray-700">Referencia</label>
                <input name="reference" value={formAddress.reference} onChange={handleAddressChange} className="mt-1 w-full border rounded p-2" placeholder="Referencia (p. ej. portería, piso)" />
              </div>

              <div className="md:col-span-2 flex items-center gap-3 mt-2">
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" name="isDefault" checked={formAddress.isDefault} onChange={handleAddressChange} />
                  <span className="text-sm text-gray-700">Establecer como dirección principal</span>
                </label>

                <div className="ml-auto flex gap-2">
                  <button type="button" onClick={closeModal} className="px-4 py-2 border rounded">Cancelar</button>
                  <button type="submit" disabled={addressLoading} className={`px-4 py-2 rounded text-white ${addressLoading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}`}>
                    {addressLoading ? "Procesando..." : (editingAddress ? "Guardar cambios" : "Agregar dirección")}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
