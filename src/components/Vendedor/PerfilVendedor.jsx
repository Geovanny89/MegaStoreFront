import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import {
  User, Mail, Phone, Store, Settings, 
  QrCode, ShieldCheck, Loader2
} from "lucide-react";

export default function PerfilVendedor() {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPerfil = async () => {
    try {
      const res = await api.get("/vendedor/perfil");
      setPerfil(res.data);
    } catch (error) {
      console.error("Error cargando perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerfil();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  if (!perfil) return <p className="text-center mt-10">No se encontró el perfil.</p>;

  // --- LÓGICA PARA BUSCAR EN EL ARRAY DE PAYMENT METHODS ---
  // Buscamos los objetos dentro del array paymentMethods que coincidan con el proveedor
  const nequiData = perfil.paymentMethods?.find(m => m.provider === "nequi");
  const llavesData = perfil.paymentMethods?.find(m => m.provider === "llaves");

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4 pb-20">
      <div className="bg-white shadow-2xl rounded-[40px] overflow-hidden">
        
        {/* HEADER */}
        <div className="bg-slate-900 p-8 text-white flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center text-4xl font-black shadow-lg">
            {perfil.name?.charAt(0)}
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <h1 className="text-3xl font-black tracking-tight">
                {perfil.name} {perfil.lastName}
              </h1>
              {perfil.sellerStatus === "active" && (
                <ShieldCheck size={20} className="text-green-400" />
              )}
            </div>
            <p className="text-blue-400 font-bold uppercase text-xs tracking-widest flex items-center justify-center md:justify-start gap-2">
              <Store size={14} /> {perfil.storeName || "Sin nombre de tienda"}
            </p>
          </div>

          <button
            onClick={() => navigate("/editarVendedor")} 
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-all px-6 py-3 rounded-2xl font-bold text-sm border border-white/10"
          >
            <Settings size={18} /> Configurar Perfil
          </button>
        </div>

        <div className="p-8">
          {/* INFORMACIÓN BÁSICA */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <InfoItem icon={<User size={18}/>} label="Nombre Completo" value={`${perfil.name} ${perfil.lastName}`} />
            <InfoItem icon={<Mail size={18}/>} label="Correo Electrónico" value={perfil.email} />
            <InfoItem icon={<Phone size={18}/>} label="Teléfono de Contacto" value={perfil.phone || "No asignado"} />
          </div>

          <hr className="border-slate-100 mb-10" />

          {/* MÉTODOS DE PAGO */}
          <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <QrCode size={20} />
            </div>
            Métodos de Recaudo
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <PaymentDisplay 
                title="Nequi" 
                // Usamos .value porque así lo guarda tu controlador
                value={nequiData?.value} 
                qr={nequiData?.qr}
                color="bg-purple-50 text-purple-700 border-purple-100"
            />
            <PaymentDisplay 
                title="Llaves (Daviplata/Otro)" 
                value={llavesData?.value} 
                qr={llavesData?.qr}
                color="bg-blue-50 text-blue-700 border-blue-100"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= COMPONENTES INTERNOS ================= */

function InfoItem({ icon, label, value }) {
  return (
    <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 shadow-sm">
      <div className="text-slate-400 mb-3">{icon}</div>
      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
      <p className="text-slate-900 font-bold">{value || "---"}</p>
    </div>
  );
}

function PaymentDisplay({ title, value, qr, color }) {
  return (
    <div className={`p-8 rounded-[3rem] border-2 flex flex-col items-center text-center transition-all ${color}`}>
      <span className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-70">Cuenta {title}</span>
      <h3 className="text-2xl font-black mb-6">{value || "No registrado"}</h3>
      
      {qr ? (
        <div className="bg-white p-4 rounded-3xl shadow-md border border-slate-100">
          <img src={qr} alt={`QR ${title}`} className="w-44 h-44 object-contain" />
          <p className="mt-2 text-[9px] font-bold uppercase opacity-50">Código QR Activo</p>
        </div>
      ) : (
        <div className="w-44 h-44 bg-white/50 rounded-3xl flex flex-col items-center justify-center border-2 border-dashed border-slate-300">
           <QrCode size={40} className="text-slate-300 mb-2" />
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Sin código QR</p>
        </div>
      )}
    </div>
  );
}