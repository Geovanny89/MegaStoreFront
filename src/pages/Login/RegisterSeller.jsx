import { useState, useEffect } from "react";
import api from "../../api/axios";
import { Eye, EyeOff, Store, Upload, ArrowRight, ShieldCheck, X, LayoutGrid, CheckCircle2 } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo from "../../assets/Logo3.png";

export default function RegisterSeller() {
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const planFromUrl = query.get("plan"); // Captura el ID del plan de la URL

  const [form, setForm] = useState({
    name: "",
    lastName: "",
    identity: "",
    email: "",
    password: "",
    phone: "",
    rol: "seller",
    storeName: "",
    storeCategory: "",
    planId: planFromUrl || "", // Si viene de la URL, se pre-carga
    addresses: [{ street: "", city: "" }]
  });

  const [storeLogo, setStoreLogo] = useState(null);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [planes, setPlanes] = useState([]);
  const [preview, setPreview] = useState(null);

  // Obtener la información del plan seleccionado (para mostrar el nombre y precio)
  const planSeleccionado = planes.find(p => p._id === form.planId);

  useEffect(() => {
    const fetchPlanes = async () => {
      try {
        const res = await api.get("/user/planes");
        const data = Array.isArray(res.data) ? res.data : res.data.planes || [];
        setPlanes(data);
      } catch (error) {
        console.error("Error cargando planes:", error);
      }
    };
    fetchPlanes();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      addresses: [{ ...prev.addresses[0], [name]: value }]
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setStoreLogo(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!storeLogo) return alert("El logo de la tienda es obligatorio");
    if (!form.storeCategory) return alert("Debes seleccionar una categoría");
    if (!form.planId) return alert("Debes seleccionar un plan de suscripción");
    
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("lastName", form.lastName);
      formData.append("identity", form.identity);
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("phone", form.phone);
      formData.append("rol", "seller");
      formData.append("storeName", form.storeName);
      formData.append("storeCategory", form.storeCategory);
      formData.append("planId", form.planId);
      formData.append("addresses[0][street]", form.addresses[0].street);
      formData.append("addresses[0][city]", form.addresses[0].city);
      formData.append("image", storeLogo);

      await api.post("/register-seller", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("¡Tienda creada con éxito! Bienvenida.");
      navigate("/login");
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Error al registrar la tienda";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full bg-[#374151] border border-[#4B5563] text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block p-3 placeholder-gray-400 outline-none transition-all";
  const labelStyle = "block mb-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider";

  return (
    <div className="min-h-screen bg-[#111827] flex items-center justify-center p-4 md:p-10 font-sans text-gray-200 relative">
      <div className="max-w-6xl w-full flex flex-col md:flex-row items-stretch bg-[#1F2937] rounded-[2.5rem] overflow-hidden shadow-2xl border border-[#374151] relative">

        <Link to="/" className="absolute top-6 right-6 text-gray-400 hover:text-white z-20">
          <X size={28} />
        </Link>

        <div className="w-full md:w-7/12 p-8 md:p-12 overflow-y-auto max-h-[90vh] md:max-h-none custom-scrollbar">
          <div className="flex items-center gap-3 mb-8">
            <img src={Logo} alt="Logo" className="h-10 w-auto" />
            <div className="h-6 w-px bg-gray-700"></div>
            <span className="text-blue-500 text-[10px] font-black uppercase tracking-widest">Seller Hub</span>
          </div>

          <h2 className="text-3xl font-black text-white tracking-tight mb-2">Crea tu Tienda</h2>
          <p className="text-gray-400 mb-8">Regístrate y comienza a vender en nuestro marketplace.</p>

          <form onSubmit={handleRegister} className="space-y-6">

            <div className="bg-[#111827]/40 p-6 rounded-2xl border border-[#374151] space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelStyle}>Nombre de la Tienda</label>
                  <input name="storeName" type="text" required placeholder="Nombre comercial" className={inputStyle} onChange={handleChange} />
                </div>

                <div>
                  <label className={labelStyle}>Categoría del Negocio</label>
                  <select name="storeCategory" value={form.storeCategory} required className={inputStyle} onChange={handleChange}>
                    <option value="" className="bg-[#1F2937]">Selecciona sector...</option>
                    <option value="Tecnología" className="bg-[#1F2937]">Tecnología</option>
                    <option value="Moda" className="bg-[#1F2937]">Moda</option>
                    <option value="Ferretería" className="bg-[#1F2937]">Ferretería</option>
                    <option value="Supermercado" className="bg-[#1F2937]">Supermercado</option>
                    <option value="Hogar" className="bg-[#1F2937]">Hogar</option>
                    <option value="Belleza" className="bg-[#1F2937]">Belleza</option>
                    <option value="Deportes" className="bg-[#1F2937]">Deportes</option>
                    <option value="Otros" className="bg-[#1F2937]">Otros</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelStyle}>Plan de Suscripción</label>
                  
                  {/* LÓGICA DINÁMICA DEL PLAN */}
                  {planFromUrl && planSeleccionado ? (
                    <div className="bg-blue-600/10 border border-blue-500/30 p-3 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-blue-500" />
                        <div>
                          <p className="text-white text-xs font-black uppercase tracking-tighter">
                            {planSeleccionado.nombre === "avanzado" ? "Plan Avanzado" : "Plan Emprendedor"}
                          </p>
                          <p className="text-blue-400 text-[10px] font-bold">Seleccionado</p>
                        </div>
                      </div>
                      <Link to="/planes" className="text-[10px] text-gray-500 hover:text-white underline uppercase font-black tracking-widest">
                        Cambiar
                      </Link>
                    </div>
                  ) : (
                    <select
                      name="planId"
                      value={form.planId}
                      required
                      className={inputStyle}
                      onChange={handleChange}
                    >
                      <option value="">Seleccionar plan...</option>
                      {planes.map((p) => (
                        <option key={p._id} value={p._id} className="bg-[#1F2937]">
                          {p.nombre === "avanzado" ? "Plan Avanzado" : "Plan Básico"} — ${p.precio}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className={labelStyle}>Logo de la Tienda</label>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#1F2937] border-2 border-dashed border-[#4B5563] flex items-center justify-center overflow-hidden flex-shrink-0">
                      {preview ? <img src={preview} className="w-full h-full object-cover" /> : <Store className="text-gray-600" size={20} />}
                    </div>
                    <label className="flex-1 cursor-pointer bg-[#374151] hover:bg-[#4B5563] text-white text-[10px] font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 border border-[#4B5563]">
                      <Upload size={14} /> {storeLogo ? "Cambiar" : "Subir Logo"}
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelStyle}>Nombre Responsable</label>
                <input name="name" type="text" required className={inputStyle} onChange={handleChange} />
              </div>
              <div>
                <label className={labelStyle}>Apellido</label>
                <input name="lastName" type="text" required className={inputStyle} onChange={handleChange} />
              </div>
              <div className="md:col-span-2">
                <label className={labelStyle}>Email Corporativo</label>
                <input name="email" type="email" required className={inputStyle} onChange={handleChange} />
              </div>
              <div>
                <label className={labelStyle}>NIT / Identificación</label>
                <input name="identity" type="text" required className={inputStyle} onChange={handleChange} />
              </div>
              <div>
                <label className={labelStyle}>Teléfono</label>
                <input name="phone" type="text" required className={inputStyle} onChange={handleChange} />
              </div>
              <div className="md:col-span-2 relative">
                <label className={labelStyle}>Contraseña</label>
                <input
                  name="password"
                  type={showPass ? "text" : "password"}
                  required
                  minLength={8}
                  className={inputStyle}
                  onChange={handleChange}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-[34px] text-gray-500 hover:text-white transition-colors">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-[#374151]">
              <div className="md:col-span-2">
                <label className={labelStyle}>Dirección Física</label>
                <input name="street" type="text" required placeholder="Calle, Número, Local" className={inputStyle} onChange={handleAddressChange} />
              </div>
              <div>
                <label className={labelStyle}>Ciudad</label>
                <input name="city" type="text" required placeholder="Cúcuta" className={inputStyle} onChange={handleAddressChange} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 group disabled:opacity-50 mt-4"
            >
              {loading ? "Procesando..." : <>Abrir mi Tienda <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-500 text-sm">
            ¿Ya tienes cuenta? <Link to="/login" className="text-blue-500 font-bold hover:underline">Inicia Sesión</Link>
          </p>
        </div>

        <div className="hidden md:flex md:w-5/12 bg-[#111827] flex-col items-center justify-center p-12 text-center relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px]"></div>

          <div className="relative z-10 space-y-4">
            <h3 className="text-2xl font-bold text-white leading-tight">Impulsa tu comercio en Cúcuta</h3>
            <p className="text-gray-400 text-sm max-w-xs mx-auto leading-relaxed">
              Registra tu sector y haz que los clientes te encuentren por categorías: Tecnología, Moda, Ferretería y más.
            </p>
            <div className="pt-8 flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 text-blue-500 font-bold text-xs uppercase tracking-widest border border-blue-500/30 px-4 py-2 rounded-full bg-blue-500/5">
                <ShieldCheck size={18} /> Alianza Segura
              </div>
              <div className="flex items-center gap-2 text-gray-500 text-[10px] uppercase tracking-tighter">
                <LayoutGrid size={14} /> Categorización Inteligente
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}