import { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  Eye, EyeOff, Store, Upload, ArrowRight, ShieldCheck,
  X, LayoutGrid, CheckCircle2, CreditCard, Check,
  Info
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo from "../../assets/Logo31.png";

// --- SUB-COMPONENTES PARA LOS MODALES ---

// Esta lista debe ser idéntica a la de tu modelo de backend (User.js)
const STORE_CATEGORIES = [
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

const PrivacidadContent = () => {
  const fechaActual = new Date().toLocaleDateString();
  return (
    <div className="p-8 font-sans text-gray-800">
      <header className="mb-8 border-b pb-6">
        <h1 className="text-2xl font-black text-gray-900 uppercase">Política de <span className="text-blue-600">Privacidad</span></h1>
        <p className="text-xs text-gray-500 italic">Actualizado: {fechaActual}</p>
      </header>
      <div className="space-y-6 text-sm">
        <section>
          <h2 className="font-black text-gray-900 uppercase mb-2">1. Recolección de Datos</h2>
          <p className="text-gray-600">Recolectamos información necesaria para la gestión de su tienda, incluyendo datos de contacto, ubicación comercial y comprobantes de pago.</p>
        </section>
        <section className="bg-blue-50 p-4 rounded-xl">
          <h2 className="font-black text-blue-900 uppercase mb-2">2. Uso de la Información</h2>
          <p className="text-blue-800">Sus datos se utilizan para facilitar la comunicación con compradores mediante el chat interno y gestionar su suscripción de vendedor.</p>
        </section>
      </div>
    </div>
  );
};

const TerminosContent = () => {
  const fechaActual = new Date().toLocaleDateString();
  return (
    <div className="p-8 font-sans text-gray-800">
      <header className="mb-8 border-b pb-6">
        <h1 className="text-2xl font-black text-gray-900 uppercase">Términos y <span className="text-blue-600">Condiciones</span></h1>
        <p className="text-xs text-gray-500 italic">Cúcuta, Colombia | {fechaActual}</p>
      </header>
      <div className="space-y-6 text-sm">
        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-xl">
          <p className="text-orange-900 font-bold text-xs uppercase mb-1">Aviso Marketplace</p>
          <p className="text-orange-800">Actuamos como plataforma tecnológica. La responsabilidad de los productos y garantías recae en el vendedor.</p>
        </div>
        <section>
          <h2 className="font-black text-gray-900 uppercase mb-2">1. Periodo de Prueba</h2>
          <p className="text-gray-600">Al registrarse, accede a 10 días de prueba gratuita. Posterior a este periodo, el acceso al panel de vendedor requerirá el pago del plan seleccionado.</p>
        </section>
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---

export default function RegisterSeller() {
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const planFromUrl = query.get("plan");

  // const METODOS_PAGO = [
  //   { banco: "Nequi", numero: "3000000000", titular: "Marketplace Admin" },
  //   { banco: "Daviplata", numero: "3000000000", titular: "Marketplace Admin" }
  // ];

  const [form, setForm] = useState({
    name: "", lastName: "", identity: "", email: "", password: "", phone: "",
    rol: "seller", storeName: "", storeCategory: "", planId: planFromUrl || "",
    addresses: [{ street: "", city: "" }]
  });

  const [storeLogo, setStoreLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [planes, setPlanes] = useState([]);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copiado, setCopiado] = useState(null);
  const [aceptarTerminos, setAceptarTerminos] = useState(false);
  const [modalLegal, setModalLegal] = useState({ abierto: false, tipo: null });

  const planSeleccionado = planes.find(p => p._id === form.planId);

  useEffect(() => {
    const fetchPlanes = async () => {
      try {
        const res = await api.get("/vendedor/planes");

        const planesData = Array.isArray(res.data)
          ? res.data
          : res.data.planes || [];

        // 🔥 SOLO PLAN PREMIUM (79.900)
        const planesFiltrados = planesData.filter(
          (plan) => plan.precio === 79900
        );

        setPlanes(planesFiltrados);

        // ✅ AUTO-SELECCIONAR SI SOLO HAY UNO
        if (planesFiltrados.length === 1) {
          setForm((prev) => ({
            ...prev,
            planId: planesFiltrados[0]._id
          }));
        }

      } catch (err) {
        console.error("Error cargando planes:", err);
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

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setStoreLogo(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiado(id);
    setTimeout(() => setCopiado(null), 2000);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!aceptarTerminos) return alert("Debes aceptar los términos y condiciones.");

    setLoading(true);
    try {
      const formData = new FormData();

      // Añadimos campos básicos
      Object.keys(form).forEach((key) => {
        if (key !== "addresses") formData.append(key, form[key]);
      });

      // Añadimos dirección estructurada
      formData.append("addresses[0][street]", form.addresses[0].street);
      formData.append("addresses[0][city]", form.addresses[0].city);

      // Añadimos el logo si existe
      if (storeLogo) formData.append("image", storeLogo);

      await api.post("/register-seller", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("🎉 ¡Tienda creada! Tienes 5 días de prueba gratuita activados.");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.error || "Error al registrar la tienda");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full bg-[#374151] border border-[#4B5563] text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500 block p-3 placeholder-gray-400 outline-none transition-all";
  const labelStyle = "block mb-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider";

  return (
    <div className="min-h-screen bg-[#111827] flex items-center justify-center p-4 md:p-10 font-sans text-gray-200 relative">

      {/* MODAL LEGAL */}
      {modalLegal.abierto && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl max-h-[85vh] rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl relative text-gray-900">
            <button
              onClick={() => setModalLegal({ abierto: false, tipo: null })}
              className="absolute top-6 right-6 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors z-50"
            >
              <X size={20} />
            </button>
            <div className="overflow-y-auto flex-1">
              {modalLegal.tipo === "terminos" ? <TerminosContent /> : <PrivacidadContent />}
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button
                onClick={() => setModalLegal({ abierto: false, tipo: null })}
                className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl w-full flex flex-col md:flex-row items-stretch bg-[#1F2937] rounded-[2.5rem] overflow-hidden shadow-2xl border border-[#374151] relative">

        <Link to="/" className="absolute top-6 right-6 text-gray-400 hover:text-white z-20">
          <X size={28} />
        </Link>

        {/* FORMULARIO */}
        <div className="w-full md:w-7/12 p-8 md:p-12 overflow-y-auto max-h-[90vh] md:max-h-none custom-scrollbar">
          <div className="flex items-center justify-center mb-8">
            <img src={Logo} alt="Logo" className="h-24 w-auto scale-350" />
          </div>

          <h2 className="text-3xl font-black text-white tracking-tight mb-2">Crea tu Tienda</h2>
          <p className="text-gray-400 mb-8">Regístrate y activa tus <span className="text-blue-400 font-bold">10 días de prueba gratuita</span>.</p>

          <form onSubmit={handleRegister} className="space-y-6">

            {/* SECCIÓN INFORMACIÓN DE TIENDA */}
            <div className="bg-[#111827]/40 p-6 rounded-2xl border border-[#374151] space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelStyle}>Nombre de la Tienda</label>
                  <input name="storeName" required placeholder="Ej: Mi Negocio" className={inputStyle} onChange={handleChange} />
                </div>
                <div>
                  <label className={labelStyle}>Categoría de Negocio</label>
                  <select
                    name="storeCategory"
                    required
                    className={inputStyle}
                    onChange={handleChange}
                    value={form.storeCategory}
                  >
                    <option value="">Seleccionar rubro...</option>
                    {STORE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} className="bg-[#1F2937]">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelStyle}>Plan de Suscripción</label>
                  <select name="planId" value={form.planId} required className={inputStyle} onChange={handleChange}>
                    <option value="">Seleccionar plan...</option>
                    {planes.map((p) => (
                      <option key={p._id} value={p._id} className="bg-[#1F2937]">
                        {p.nombre.toUpperCase()} — ${p.precio.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelStyle}>Logo de Tienda</label>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#1F2937] border-2 border-dashed border-[#4B5563] flex items-center justify-center overflow-hidden">
                      {logoPreview ? <img src={logoPreview} className="w-full h-full object-cover" /> : <Store className="text-gray-600" size={20} />}
                    </div>
                    <label className="flex-1 cursor-pointer bg-[#374151] hover:bg-[#4B5563] text-white text-[10px] font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 border border-[#4B5563]">
                      <Upload size={14} /> Subir Logo
                      <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                    </label>
                  </div>
                </div>
              </div>

              {/* INFO TRIAL */}
              {/* INFO TRIAL ACTUALIZADA Y LLAMATIVA */}
              {planSeleccionado && (
                <div className="relative overflow-hidden bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border-2 border-blue-500/50 p-5 rounded-2xl animate-in zoom-in-95 duration-500">
                  {/* Decoración de fondo */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>

                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="flex h-3 w-3 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                      </span>
                      <p className="text-green-400 font-black text-sm uppercase tracking-tighter">
                        ¡Beneficio Exclusivo Activado!
                      </p>
                    </div>

                    <div className="space-y-2">


                      <div className="bg-white/5 p-3 rounded-xl border border-white/10 mt-2">
                        <p className="text-gray-200 text-xs leading-relaxed">
                          🚀 Disfruta <span className="text-white font-bold">10 DÍAS GRATIS</span> de acceso total.
                          <br />
                          <span className="text-yellow-400 font-black">¡OFERTA DE LANZAMIENTO!</span>{" "}
                          Si activas tu cuenta hoy, obtén un{" "}
                          <span className="bg-yellow-400 text-blue-900 px-1 rounded font-black">
                            75% DE DESCUENTO
                          </span>{" "}
                          en tus primeros 4 meses por{" "}
                          <span className="text-white font-black">$19.900</span>.
                        </p>
                      </div>

                      <p className="text-[10px] text-blue-300 italic mt-2 flex items-center gap-1">
                        <Check size={12} /> Sin contratos amarrados • Cancela cuando quieras
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* DATOS PERSONALES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelStyle}>Nombre del Titular</label>
                <input name="name" required className={inputStyle} onChange={handleChange} />
              </div>
              <div>
                <label className={labelStyle}>Apellido</label>
                <input name="lastName" required className={inputStyle} onChange={handleChange} />
              </div>
              <div className="md:col-span-2">
                <label className={labelStyle}>Email de Acceso</label>
                <input name="email" type="email" required className={inputStyle} onChange={handleChange} />
              </div>
              <div>
                <label className={labelStyle}>Cédula / NIT</label>
                <input name="identity" required className={inputStyle} onChange={handleChange} />
              </div>
              <div>
                <label className={labelStyle}>WhatsApp / Celular</label>
                <input name="phone" required className={inputStyle} onChange={handleChange} />
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
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-[34px] text-gray-500">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* DIRECCIÓN */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-[#374151]">
              <div className="md:col-span-2">
                <label className={labelStyle}>Dirección Física</label>
                <input name="street" required placeholder="Calle, Número, Barrio" className={inputStyle} onChange={handleAddressChange} />
              </div>
              <div>
                <label className={labelStyle}>Ciudad</label>
                <input name="city" required placeholder="Cúcuta" className={inputStyle} onChange={handleAddressChange} />
              </div>
            </div>

            {/* SECCIÓN DE PAGO (SOLO INFO) */}
            {/* {planSeleccionado && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="p-5 rounded-2xl bg-blue-600/5 border border-blue-500/20">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-600 rounded-xl">
                        <CreditCard className="text-white" size={20} />
                      </div>
                      <div>
                        <h4 className="text-blue-400 text-[10px] font-black uppercase tracking-widest leading-none mb-1">Inversión Mensual</h4>
                        <p className="text-white text-2xl font-black">${planSeleccionado.precio.toLocaleString()} <span className="text-[10px] text-gray-500 font-normal">COP</span></p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#111827] rounded-2xl border border-[#374151] overflow-hidden">
                  <div className="px-5 py-3 bg-[#1F2937] border-b border-[#374151]">
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Canales para futura activación</span>
                  </div>
                  <div className="p-4 space-y-3">
                    {METODOS_PAGO.map((metodo, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 hover:bg-white/5 rounded-xl transition-colors">
                        <div>
                          <p className="text-gray-500 text-[9px] font-black uppercase">{metodo.banco}</p>
                          <p className="text-white font-mono text-sm tracking-widest">{metodo.numero}</p>
                        </div>
                        <button type="button" onClick={() => copyToClipboard(metodo.numero, idx)} className={`p-2 rounded-lg transition-all ${copiado === idx ? 'bg-green-600/20 text-green-400' : 'bg-[#374151] text-gray-400'}`}>
                          {copiado === idx ? <Check size={16} /> : <Info size={16} />}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )} */}

            {/* TÉRMINOS */}
            <div className="flex items-start gap-3 p-2">
              <input
                type="checkbox"
                id="terms"
                checked={aceptarTerminos}
                onChange={e => setAceptarTerminos(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="terms" className="text-xs text-gray-400 leading-tight cursor-pointer">
                Acepto los <button type="button" onClick={() => setModalLegal({ abierto: true, tipo: "terminos" })} className="text-blue-500 font-bold hover:underline">Términos y Condiciones</button> y la <button type="button" onClick={() => setModalLegal({ abierto: true, tipo: "privacidad" })} className="text-blue-500 font-bold hover:underline">Política de Privacidad</button>.
              </label>
            </div>

            {/* SUBMIT */}
            <button
              disabled={loading || !aceptarTerminos}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-blue-600/20 flex justify-center items-center gap-2 transition-all active:scale-[0.98]"
            >
              {loading ? "Procesando registro..." : <>Abrir mi Tienda Gratis <ArrowRight size={18} /></>}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-8">
            ¿Ya tienes una cuenta? <Link to="/login" className="text-blue-500 font-bold hover:underline">Inicia Sesión</Link>
          </p>
        </div>

        {/* PANEL LATERAL DERECHO */}
        <div className="hidden md:flex md:w-5/12 bg-[#111827] flex-col items-center justify-center p-12 text-center relative overflow-hidden border-l border-[#374151]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl -ml-32 -mb-32"></div>

          <div className="relative z-10 space-y-6">
            <div className="bg-blue-600/20 p-6 rounded-[2.5rem] inline-block mb-4 border border-blue-500/20">
              <Store size={48} className="text-blue-500" />
            </div>
            <h3 className="text-3xl font-black text-white leading-tight">Vende a otro<br /><span className="text-blue-500">nivel</span></h3>
            <p className="text-gray-400 text-sm max-w-xs mx-auto">
              Únete a la plataforma local con mayor crecimiento y gestiona tus ventas de forma profesional.
            </p>
            <div className="space-y-4 pt-6">
              {[
                { icon: <CheckCircle2 size={18} />, text: "Tu propio catálogo online" },
                { icon: <LayoutGrid size={18} />, text: "Control total de inventario" },
                { icon: <ShieldCheck size={18} />, text: "Chat directo con clientes" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-left bg-white/5 p-3 rounded-xl border border-white/5">
                  <span className="text-blue-500">{item.icon}</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-300">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}