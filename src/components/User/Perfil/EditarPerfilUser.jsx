import React, { useEffect, useState } from "react";
import api from "../../../api/axios";
import { User, MapPin, Phone, Mail, CreditCard, Plus, Edit2, Trash2, CheckCircle, X, ArrowLeft, Save, RefreshCcw } from "lucide-react";

export default function EditarPerfilUser() {
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingUser, setSavingUser] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressLoading, setAddressLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [formUser, setFormUser] = useState({
    name: "",
    lastName: "",
    identity: "",
    email: "",
    phone: ""
  });

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

  const openCreateAddress = () => {
    setEditingAddress(null);
    setFormAddress(emptyAddress);
    setShowAddressModal(true);
    setErrorMessage("");
  };

  const openEditAddress = (addr) => { 
    setEditingAddress(addr);
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

  const handleUserChange = (e) => {
    setFormUser(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setSavingUser(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      await api.put("/user/update", formUser);
      setUser(prev => ({ ...prev, ...formUser }));
      setSuccessMessage("¡Perfil actualizado con éxito!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setErrorMessage("No se pudo guardar la información del usuario.");
    } finally {
      setSavingUser(false);
    }
  };

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormAddress(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const createAddress = async () => {
    try {
      setAddressLoading(true);
      const res = await api.post("/user/createAdress", formAddress);
      const newAddrs = res.data?.addresses ?? res.data ?? [];
      setAddresses(newAddrs);
      closeModal();
      setSuccessMessage("Dirección agregada correctamente.");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setErrorMessage("No se pudo crear la dirección.");
    } finally {
      setAddressLoading(false);
    }
  };

  const updateAddress = async () => {
    try {
      setAddressLoading(true);
      const res = await api.put(`/user/address/${editingAddress._id}`, formAddress);
      const newAddrs = res.data?.addresses ?? res.data ?? [];
      setAddresses(newAddrs);
      closeModal();
      setSuccessMessage("Dirección actualizada correctamente.");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setErrorMessage("No se pudo editar la dirección.");
    } finally {
      setAddressLoading(false);
    }
  };

  const deleteAddress = async (id) => {
    if (!confirm("¿Eliminar esta dirección?")) return;
    try {
      setAddressLoading(true);
      const res = await api.delete(`/user/address/${id}`);
      const newAddrs = res.data?.addresses ?? res.data ?? addresses.filter(a => a._id !== id);
      setAddresses(newAddrs);
    } catch (err) {
      setErrorMessage("No se pudo eliminar la dirección.");
    } finally {
      setAddressLoading(false);
    }
  };

  const setDefault = async (id) => {
    try {
      setAddressLoading(true);
      const res = await api.put(`/user/address/default/${id}`);
      const newAddrs = res.data?.addresses ?? res.data ?? [];
      setAddresses(newAddrs);
    } catch (err) {
      setErrorMessage("No se pudo establecer como principal.");
    } finally {
      setAddressLoading(false);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (editingAddress) await updateAddress();
    else await createAddress();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <div className="w-12 h-12 md:w-16 md:h-16 border-8 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-600 font-bold animate-pulse text-center">Cargando tu perfil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-6 md:py-12 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-10">
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Configuración de Perfil</h1>
            <p className="text-slate-500 font-medium mt-2 text-sm md:text-base">Gestiona tu información personal y direcciones de envío.</p>
          </div>
         
        </div>

        {/* ALERTAS */}
        {errorMessage && (
          <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-100 text-red-700 p-4 rounded-2xl animate-in fade-in slide-in-from-top-2">
            <X size={20} className="flex-shrink-0" />
            <p className="font-bold text-xs md:text-sm">{errorMessage}</p>
          </div>
        )}
        {successMessage && (
          <div className="mb-6 flex items-center gap-3 bg-green-50 border border-green-100 text-green-700 p-4 rounded-2xl animate-in fade-in slide-in-from-top-2">
            <CheckCircle size={20} className="flex-shrink-0" />
            <p className="font-bold text-xs md:text-sm">{successMessage}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLUMNA IZQUIERDA: DATOS PERSONALES */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 md:p-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 backdrop-blur-md rounded-xl md:rounded-2xl flex items-center justify-center text-white">
                    <User size={28} />
                  </div>
                  <h2 className="text-xl md:text-2xl font-black text-white">Información Personal</h2>
                </div>
              </div>
              
              <form onSubmit={handleUserSubmit} className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-700 uppercase tracking-wider ml-1">Nombre</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        name="name"
                        value={formUser.name}
                        onChange={handleUserChange}
                        className="w-full pl-12 pr-4 py-3 md:py-4 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-sm md:text-base"
                        placeholder="Tu nombre"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-700 uppercase tracking-wider ml-1">Apellido</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        name="lastName"
                        value={formUser.lastName}
                        onChange={handleUserChange}
                        className="w-full pl-12 pr-4 py-3 md:py-4 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-sm md:text-base"
                        placeholder="Tu apellido"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-700 uppercase tracking-wider ml-1">Identificación</label>
                    <div className="relative">
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        name="identity"
                        value={formUser.identity}
                        onChange={handleUserChange}
                        className="w-full pl-12 pr-4 py-3 md:py-4 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-sm md:text-base"
                        placeholder="DNI / Cédula"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-700 uppercase tracking-wider ml-1">Teléfono</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        name="phone"
                        value={formUser.phone}
                        onChange={handleUserChange}
                        className="w-full pl-12 pr-4 py-3 md:py-4 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-sm md:text-base"
                        placeholder="+57 300..."
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-black text-slate-700 uppercase tracking-wider ml-1">Correo Electrónico</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        name="email"
                        type="email"
                        value={formUser.email}
                        onChange={handleUserChange}
                        className="w-full pl-12 pr-4 py-3 md:py-4 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-sm md:text-base"
                        placeholder="ejemplo@correo.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3 md:gap-4 mt-8 md:mt-10">
                  <button
                    type="button"
                    onClick={() => setFormUser({
                      name: user.name || "",
                      lastName: user.lastName || "",
                      identity: user.identity || "",
                      email: user.email || "",
                      phone: user.phone || ""
                    })}
                    className="flex items-center justify-center gap-2 px-6 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-slate-500 hover:bg-slate-50 transition-all text-sm md:text-base"
                  >
                    <RefreshCcw size={18} /> Resetear
                  </button>
                  <button
                    type="submit"
                    disabled={savingUser}
                    className={`flex items-center justify-center gap-2 px-8 md:px-10 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-white shadow-xl transition-all active:scale-95 text-sm md:text-base ${
                      savingUser ? "bg-slate-400" : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
                    }`}
                  >
                    <Save size={18} /> {savingUser ? "Guardando..." : "Guardar Cambios"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* COLUMNA DERECHA: DIRECCIONES */}
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-black text-slate-900">Mis Direcciones</h2>
              <button
                onClick={openCreateAddress}
                className="p-3 bg-green-500 text-white rounded-xl md:rounded-2xl hover:bg-green-600 transition-all shadow-lg shadow-green-100 active:scale-90"
              >
                <Plus size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {addresses.length === 0 ? (
                <div className="bg-white rounded-[2rem] p-8 md:p-10 text-center border-2 border-dashed border-slate-200">
                  <MapPin size={32} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-400 font-bold text-sm">No tienes direcciones registradas.</p>
                </div>
              ) : (
                addresses.map(addr => (
                  <div key={addr._id} className={`group bg-white rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-6 border-2 transition-all duration-300 ${
                    addr.isDefault ? "border-blue-500 shadow-xl shadow-blue-50" : "border-slate-100 hover:border-slate-200 shadow-sm"
                  }`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 md:p-3 rounded-xl ${addr.isDefault ? "bg-blue-50 text-blue-600" : "bg-slate-50 text-slate-400"}`}>
                          <MapPin size={18} md:size={20} />
                        </div>
                        <div className="max-w-[120px] md:max-w-none overflow-hidden">
                          <h3 className="font-black text-slate-800 text-sm md:text-base truncate">{addr.label || "Dirección"}</h3>
                          {addr.isDefault && <span className="text-[9px] md:text-[10px] font-black text-blue-600 uppercase tracking-widest">Principal</span>}
                        </div>
                      </div>
                      <div className="flex gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEditAddress(addr)} className="p-1.5 md:p-2 text-slate-400 hover:text-blue-600 transition-colors"><Edit2 size={16} md:size={18} /></button>
                        <button onClick={() => deleteAddress(addr._id)} className="p-1.5 md:p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 size={16} md:size={18} /></button>
                      </div>
                    </div>
                    
                    <div className="space-y-1 text-xs md:text-sm text-slate-500 font-medium">
                      <p className="text-slate-700 font-bold line-clamp-1">{addr.street}</p>
                      <p className="truncate">{addr.city}{addr.state ? `, ${addr.state}` : ""}</p>
                      {addr.postalCode && <p>CP: {addr.postalCode}</p>}
                    </div>

                    {!addr.isDefault && (
                      <button
                        onClick={() => setDefault(addr._id)}
                        className="mt-5 md:mt-6 w-full py-2.5 md:py-3 rounded-xl border-2 border-slate-100 text-slate-400 font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-blue-50 hover:border-blue-100 hover:text-blue-600 transition-all"
                      >
                        Hacer Principal
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DIRECCIÓN RESPONSIVO */}
      {showAddressModal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-2xl bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
            <button onClick={closeModal} className="absolute top-4 md:top-6 right-4 md:right-6 p-2 md:p-3 rounded-xl md:rounded-2xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all z-10">
              <X size={20} md:size={24} />
            </button>

            <div className="p-6 md:p-10 overflow-y-auto custom-scrollbar">
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 md:mb-8">
                {editingAddress ? "Editar Dirección" : "Nueva Dirección"}
              </h3>

              <form onSubmit={handleAddressSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="md:col-span-2 space-y-1.5 md:space-y-2">
                  <label className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Etiqueta (Ej: Casa, Oficina)</label>
                  <input name="label" value={formAddress.label} onChange={handleAddressChange} className="w-full px-4 md:px-6 py-3 md:py-4 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-sm md:text-base" placeholder="Nombre de esta dirección" />
                </div>

                <div className="md:col-span-2 space-y-1.5 md:space-y-2">
                  <label className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Calle y Número *</label>
                  <input name="street" value={formAddress.street} onChange={handleAddressChange} className="w-full px-4 md:px-6 py-3 md:py-4 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-sm md:text-base" placeholder="Dirección completa" required />
                </div>

                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Ciudad *</label>
                  <input name="city" value={formAddress.city} onChange={handleAddressChange} className="w-full px-4 md:px-6 py-3 md:py-4 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-sm md:text-base" placeholder="Ciudad" required />
                </div>

                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Departamento / Estado</label>
                  <input name="state" value={formAddress.state} onChange={handleAddressChange} className="w-full px-4 md:px-6 py-3 md:py-4 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-sm md:text-base" placeholder="Estado" />
                </div>

                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Código Postal</label>
                  <input name="postalCode" value={formAddress.postalCode} onChange={handleAddressChange} className="w-full px-4 md:px-6 py-3 md:py-4 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-sm md:text-base" placeholder="000000" />
                </div>

                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Referencia</label>
                  <input name="reference" value={formAddress.reference} onChange={handleAddressChange} className="w-full px-4 md:px-6 py-3 md:py-4 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-sm md:text-base" placeholder="Piso, apto, etc." />
                </div>

                <div className="md:col-span-2 flex items-center gap-4 mt-2 md:mt-4">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input type="checkbox" name="isDefault" checked={formAddress.isDefault} onChange={handleAddressChange} className="sr-only" />
                      <div className={`w-10 md:w-12 h-5 md:h-6 rounded-full transition-all ${formAddress.isDefault ? "bg-blue-600" : "bg-slate-200"}`}></div>
                      <div className={`absolute top-0.5 md:top-1 left-0.5 md:left-1 w-4 h-4 bg-white rounded-full transition-all ${formAddress.isDefault ? "translate-x-5 md:translate-x-6" : ""}`}></div>
                    </div>
                    <span className="text-xs md:text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">Establecer como principal</span>
                  </label>
                </div>

                <div className="md:col-span-2 flex flex-col sm:flex-row gap-3 md:gap-4 mt-6 md:mt-8">
                  <button type="button" onClick={closeModal} className="flex-1 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-slate-500 hover:bg-slate-50 transition-all text-sm md:text-base order-2 sm:order-1">Cancelar</button>
                  <button type="submit" disabled={addressLoading} className={`flex-1 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-white shadow-xl transition-all active:scale-95 text-sm md:text-base order-1 sm:order-2 ${
                    addressLoading ? "bg-slate-400" : "bg-blue-600 hover:bg-blue-700 shadow-blue-100"
                  }`}>
                    {addressLoading ? "Procesando..." : (editingAddress ? "Guardar Cambios" : "Agregar Dirección")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
