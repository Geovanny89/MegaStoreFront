import { useEffect, useState } from "react";
import api from "../../api/axios";
import { 
  User, Mail, Phone, Store, QrCode, 
  Save, ArrowLeft, Image as ImageIcon, Loader2, CheckCircle2 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function EditarPerfilVendedor() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    storeName: "",
    nequiValue: "", 
    llavesValue: ""
  });

  const [nequiQR, setNequiQR] = useState(null);
  const [llavesQR, setLlavesQR] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchVendedor = async () => {
    try {
      const res = await api.get("/vendedor/perfil");
      const data = res.data;
      
      // Mapeo de paymentMethods desde el array del backend al estado local
      const nequiData = data.paymentMethods?.find(m => m.provider === "nequi");
      const llavesData = data.paymentMethods?.find(m => m.provider === "llaves");

      setForm({
        name: data.name || "",
        lastName: data.lastName || "",
        email: data.email || "",
        phone: data.phone || "",
        storeName: data.storeName || "",
        nequiValue: nequiData?.value || "",
        llavesValue: llavesData?.value || ""
      });
    } catch (err) {
      console.error("Error cargando perfil:", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchVendedor();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      // 1. Datos Básicos (Coinciden con updates.name, updates.lastName, etc.)
      formData.append("name", form.name);
      formData.append("lastName", form.lastName);
      formData.append("phone", form.phone);
      formData.append("storeName", form.storeName);

      // 2. Datos de Pago (Coinciden con req.body["paymentMethods.nequi.value"])
      formData.append("paymentMethods.nequi.value", form.nequiValue);
      formData.append("paymentMethods.llaves.value", form.llavesValue);

      // 3. Archivos QR (Coinciden con req.files.nequiQR y req.files.llavesQR)
      if (nequiQR) formData.append("nequiQR", nequiQR);
      if (llavesQR) formData.append("llavesQR", llavesQR);

      await api.put("/vendedor/update", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("¡Perfil actualizado con éxito!");
      navigate("/PerfilVendedor");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error al actualizar perfil");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <Loader2 className="animate-spin text-blue-600" size={48} />
      <p className="text-slate-500 font-bold animate-pulse uppercase text-xs tracking-widest">Cargando tus datos...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 font-bold text-sm mb-6 hover:text-blue-600 transition-colors group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
        Volver al Perfil
      </button>

      <div className="bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden">
        <div className="bg-slate-900 p-10 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-black tracking-tight mb-2">Configuración de Tienda</h2>
            <p className="text-slate-400 font-medium">Gestiona tu identidad y métodos de recaudo</p>
          </div>
          <div className="absolute right-[-20px] top-[-20px] opacity-10">
            <SettingsIcon size={180} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-12">
          
          {/* SECCIÓN 1: IDENTIDAD */}
          <section>
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center font-black">1</div>
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-800">Identidad del Vendedor</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup label="Nombre" name="name" icon={<User size={18}/>} value={form.name} onChange={handleChange} />
              <InputGroup label="Apellido" name="lastName" icon={<User size={18}/>} value={form.lastName} onChange={handleChange} />
              <InputGroup label="Nombre de la Tienda" name="storeName" icon={<Store size={18}/>} value={form.storeName} onChange={handleChange} />
              <InputGroup label="Teléfono Público" name="phone" icon={<Phone size={18}/>} value={form.phone} onChange={handleChange} />
            </div>
          </section>

          {/* SECCIÓN 2: PAGOS */}
          <section>
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center font-black">2</div>
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-800">Métodos de Pago (QR & Celular)</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Card Nequi */}
              <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-200/60 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-20"><QrCode size={40}/></div>
                <p className="font-black text-purple-700 text-xs uppercase tracking-widest">Proveedor: Nequi</p>
                <InputGroup label="Número de Celular Nequi" name="nequiValue" value={form.nequiValue} onChange={handleChange} placeholder="Ej: 3001234567" />
                <FileInput label={nequiQR ? "QR Seleccionado" : "Cargar QR Nequi"} fileSelected={!!nequiQR} onChange={(file) => setNequiQR(file)} />
              </div>

              {/* Card Llaves (Daviplata/Otros) */}
              <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-200/60 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-20"><QrCode size={40}/></div>
                <p className="font-black text-blue-700 text-xs uppercase tracking-widest">Proveedor: Llaves</p>
                <InputGroup label="Valor de la Llave (Celular/ID)" name="llavesValue" value={form.llavesValue} onChange={handleChange} placeholder="Ej: @NEQUI3107654321 o @DAVI " />
                <FileInput label={llavesQR ? "QR Seleccionado" : "Cargar QR Llaves"} fileSelected={!!llavesQR} onChange={(file) => setLlavesQR(file)} />
              </div>
            </div>
          </section>

          {/* ACCIÓN FINAL */}
          <div className="pt-8">
            <button
              type="submit"
              disabled={loading}
              className="w-full group bg-blue-600 hover:bg-slate-900 text-white font-black py-6 rounded-[2.5rem] transition-all duration-300 flex items-center justify-center gap-4 shadow-2xl shadow-blue-200 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  <Save size={22} className="group-hover:scale-110 transition-transform" />
                  <span className="uppercase tracking-[0.2em] text-sm">Actualizar Perfil de Vendedor</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* --- SUB-COMPONENTES --- */

function InputGroup({ label, name, type = "text", icon, value, onChange, placeholder }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-5">
        {label}
      </label>
      <div className="relative">
        {icon && <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>}
        <input
          type={type}
          name={name}
          value={value || ""}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full bg-white border-2 border-slate-100 focus:border-blue-500 rounded-3xl py-4 ${icon ? 'pl-14' : 'px-8'} pr-8 text-sm font-bold transition-all outline-none shadow-sm placeholder:text-slate-300`}
        />
      </div>
    </div>
  );
}

function FileInput({ label, onChange, fileSelected }) {
  return (
    <div className="space-y-2">
      <label className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-[2.5rem] cursor-pointer transition-all ${fileSelected ? 'border-green-500 bg-green-50 text-green-600' : 'border-slate-300 bg-white hover:border-blue-400 text-slate-400'}`}>
        <div className="flex flex-col items-center justify-center">
          {fileSelected ? <CheckCircle2 size={32} className="mb-2" /> : <ImageIcon size={32} className="mb-2" />}
          <p className="text-[10px] font-black uppercase tracking-tighter">{label}</p>
        </div>
        <input 
          type="file" 
          className="hidden" 
          accept="image/*"
          onChange={(e) => onChange(e.target.files[0])} 
        />
      </label>
    </div>
  );
}

function SettingsIcon({ size }) {
    return <Store size={size} />;
}