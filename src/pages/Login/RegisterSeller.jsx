import { useEffect, useState } from "react";
import api from "../../api/axios";
import { 
  Eye, EyeOff, Store, Upload, ArrowRight, ShieldCheck, 
  X, LayoutGrid, CheckCircle2, CreditCard, Copy, Check,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo from "../../assets/Logo31.png";

// --- SUB-COMPONENTES PARA LOS MODALES ---

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
        <section>
          <h2 className="font-black text-gray-900 uppercase mb-2">3. Derechos ARCO</h2>
          <p className="text-gray-600">Usted puede solicitar el acceso, rectificación o eliminación de sus datos en cualquier momento a través del panel de soporte.</p>
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
          <p className="text-orange-900 font-bold text-xs uppercase mb-1">Aviso K-DICE</p>
          <p className="text-orange-800">Actuamos solo como proveedor tecnológico. La relación comercial ocurre exclusivamente entre Comprador y Vendedor.</p>
        </div>
        <section>
          <h2 className="font-black text-gray-900 uppercase mb-2">1. Suscripciones</h2>
          <p className="text-gray-600">El pago de la suscripción otorga derecho al uso de las herramientas de venta, pero no garantiza un volumen mínimo de transacciones.</p>
        </section>
        <section>
          <h2 className="font-black text-gray-900 uppercase mb-2">2. Responsabilidad</h2>
          <p className="text-gray-600">El Marketplace no se hace responsable por la calidad de los productos vendidos ni por fraudes ocurridos en pagos directos fuera de la plataforma.</p>
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

  const METODOS_PAGO = [
    { banco: "Llave Nequi", numero: "@NEQUIGEO087", titular: "k-dice.com" },
    { banco: "Llave Daviplata", numero: "@PLATA3507918591", titular: "k-dice.com" }
  ];

  const [form, setForm] = useState({
    name: "", lastName: "", identity: "", email: "", password: "", phone: "",
    rol: "seller", storeName: "", storeCategory: "", planId: planFromUrl || "",
    addresses: [{ street: "", city: "" }]
  });

  const [storeLogo, setStoreLogo] = useState(null);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [planes, setPlanes] = useState([]);
  const [preview, setPreview] = useState(null);
  const [copiado, setCopiado] = useState(null);
  const [aceptarTerminos, setAceptarTerminos] = useState(false);
  const [modalLegal, setModalLegal] = useState({ abierto: false, tipo: null });

  const planSeleccionado = planes.find(p => p._id === form.planId);

  useEffect(() => {
    const fetchPlanes = async () => {
      try {
        const res = await api.get("/vendedor/planes");
        const data = Array.isArray(res.data) ? res.data : res.data.planes || [];
        setPlanes(data);
      } catch (error) {
        console.error("Error cargando planes:", error);
      }
    };
    fetchPlanes();
  }, []);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiado(id);
    setTimeout(() => setCopiado(null), 2000);
  };

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
    if (!aceptarTerminos) return alert("Debes aceptar los términos y condiciones para continuar.");
    if (!storeLogo) return alert("El logo de la tienda es obligatorio");
    if (!form.storeCategory) return alert("Debes seleccionar una categoría");
    if (!form.planId) return alert("Debes seleccionar un plan de suscripción");
    
    setLoading(true);

    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        if (key !== 'addresses') formData.append(key, form[key]);
      });
      formData.append("addresses[0][street]", form.addresses[0].street);
      formData.append("addresses[0][city]", form.addresses[0].city);
      formData.append("image", storeLogo);

      await api.post("/register-seller", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("¡Tienda creada con éxito! Bienvenida.");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.error || "Error al registrar la tienda");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full bg-[#374151] border border-[#4B5563] text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block p-3 placeholder-gray-400 outline-none transition-all";
  const labelStyle = "block mb-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider";

  return (
    <div className="min-h-screen bg-[#111827] flex items-center justify-center p-4 md:p-10 font-sans text-gray-200 relative">
      
      {/* MODAL LEGAL */}
      {modalLegal.abierto && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl max-h-[85vh] rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl relative">
            <button 
              onClick={() => setModalLegal({ abierto: false, tipo: null })}
              className="absolute top-6 right-6 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors z-50 text-gray-800"
            >
              <X size={20} />
            </button>
            <div className="overflow-y-auto flex-1 custom-scrollbar-light">
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

        <div className="w-full md:w-7/12 p-8 md:p-12 overflow-y-auto max-h-[90vh] md:max-h-none custom-scrollbar">
          <div className="flex items-center justify-center gap-3 mb-8">
  <img src={Logo} alt="Logo" className="h-10 w-auto scale-600" />
 
  
</div>

          <h2 className="text-3xl font-black text-white tracking-tight mb-2">Crea tu Tienda</h2>
          <p className="text-gray-400 mb-8">Regístrate y comienza a vender en nuestro marketplace.</p>

          <form onSubmit={handleRegister} className="space-y-6">

            {/* SECCIÓN INFORMACIÓN DE TIENDA */}
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
                    <option value="Tecnología">Tecnología</option>
                    <option value="Moda">Moda</option>
                    <option value="Ferretería">Ferretería</option>
                    <option value="Supermercado">Supermercado</option>
                    <option value="Hogar">Hogar</option>
                    <option value="Belleza">Belleza</option>
                    <option value="Deportes">Deportes</option>
                    <option value="Otros">Otros</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelStyle}>Plan de Suscripción</label>
                  {planFromUrl && planSeleccionado ? (
                    <div className="bg-blue-600/10 border border-blue-500/30 p-3 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-blue-500" />
                        <div>
                          <p className="text-white text-xs font-black uppercase leading-tight">
                            {planSeleccionado.nombre === "avanzado" ? "Plan Empresarial" : "Plan Emprendedor"}
                          </p>
                          <p className="text-blue-400 text-[10px] font-bold mt-0.5">Plan Seleccionado</p>
                        </div>
                      </div>
                      <Link to="/planes" className="text-[10px] text-gray-500 hover:text-white underline uppercase font-black tracking-widest">Cambiar</Link>
                    </div>
                  ) : (
                    <select name="planId" value={form.planId} required className={inputStyle} onChange={handleChange}>
                      <option value="">Seleccionar plan...</option>
                      {planes.map((p) => (
                        <option key={p._id} value={p._id} className="bg-[#1F2937]">
                          {p.nombre.toUpperCase()} — ${p.precio.toLocaleString()}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <div>
                  <label className={labelStyle}>Logo de la Tienda</label>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#1F2937] border-2 border-dashed border-[#4B5563] flex items-center justify-center overflow-hidden flex-shrink-0">
                      {preview ? <img src={preview} className="w-full h-full object-cover" alt="Preview" /> : <Store className="text-gray-600" size={20} />}
                    </div>
                    <label className="flex-1 cursor-pointer bg-[#374151] hover:bg-[#4B5563] text-white text-[10px] font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 border border-[#4B5563]">
                      <Upload size={14} /> {storeLogo ? "Cambiar" : "Subir Logo"}
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* SECCIÓN DATOS PERSONALES */}
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

            {/* SECCIÓN DIRECCIÓN */}
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

            {/* SECCIÓN DE PAGO */}
            {planSeleccionado && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="p-5 rounded-2xl bg-blue-600/5 border border-blue-500/20 shadow-inner">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-600 rounded-xl">
                        <CreditCard className="text-white" size={20} />
                      </div>
                      <div>
                        <h4 className="text-blue-400 text-[10px] font-black uppercase tracking-widest leading-none mb-1">Total a pagar</h4>
                        <p className="text-white text-2xl font-black">${planSeleccionado.precio.toLocaleString()} <span className="text-[10px] text-gray-500 font-normal ml-1">COP</span></p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-[10px] uppercase font-bold">Estado</p>
                      <p className="text-orange-400 text-xs font-black uppercase tracking-tighter">Pendiente</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#111827] rounded-2xl border border-[#374151] overflow-hidden">
                  <div className="px-5 py-3 bg-[#1F2937] border-b border-[#374151] flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Cuentas Autorizadas</span>
                  </div>
                  <div className="p-4 space-y-3">
                    {METODOS_PAGO.map((metodo, idx) => (
                      <div key={idx} className="flex items-center justify-between group p-3 hover:bg-white/5 rounded-xl transition-colors border border-transparent">
                        <div>
                          <p className="text-gray-500 text-[9px] font-black uppercase">{metodo.banco}</p>
                          <p className="text-white font-mono text-sm tracking-widest">{metodo.numero}</p>
                          <p className="text-gray-400 text-[10px] italic">{metodo.titular}</p>
                        </div>
                        <button type="button" onClick={() => copyToClipboard(metodo.numero, idx)} className={`p-2 rounded-lg transition-all ${copiado === idx ? 'bg-green-600/20 text-green-400' : 'bg-[#374151] text-gray-400 hover:text-white'}`}>
                          {copiado === idx ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* CHECKBOX LEGAL */}
            <div className="flex items-start gap-3 px-2 pt-2">
              <div className="relative flex items-center mt-1">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  checked={aceptarTerminos}
                  onChange={(e) => setAceptarTerminos(e.target.checked)}
                  className="w-5 h-5 rounded-md border-gray-600 bg-[#374151] text-blue-600 focus:ring-blue-500 cursor-pointer appearance-none checked:bg-blue-600 border flex items-center justify-center transition-all"
                />
                {aceptarTerminos && <Check size={14} className="absolute text-white pointer-events-none left-0.5" />}
              </div>
              <label htmlFor="terms" className="text-[11px] text-gray-400 leading-snug cursor-pointer select-none">
                Acepto los <button type="button" onClick={() => setModalLegal({ abierto: true, tipo: "terminos" })} className="text-blue-500 font-bold hover:underline">Términos y Condiciones</button> y la <button type="button" onClick={() => setModalLegal({ abierto: true, tipo: "privacidad" })} className="text-blue-500 font-bold hover:underline">Política de Privacidad</button> para abrir mi tienda en el Marketplace.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !aceptarTerminos}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 group disabled:opacity-30 disabled:grayscale mt-4"
            >
              {loading ? "Procesando..." : <>Pagar y Abrir mi Tienda <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-500 text-sm">
            ¿Ya tienes cuenta? <Link to="/login" className="text-blue-500 font-bold hover:underline">Inicia Sesión</Link>
          </p>
        </div>

        {/* PANEL DERECHO */}
        <div className="hidden md:flex md:w-5/12 bg-[#111827] flex-col items-center justify-center p-12 text-center relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px]"></div>
          <div className="relative z-10 space-y-4">
            <h3 className="text-2xl font-bold text-white leading-tight">Impulsa tu comercio </h3>
            <p className="text-gray-400 text-sm max-w-xs mx-auto leading-relaxed">Únete a la vitrina digital más importante  y gestiona tus pedidos de forma profesional.</p>
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