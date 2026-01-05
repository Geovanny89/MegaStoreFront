import { useEffect, useState } from "react";
import api from "../../api/axios";
import { CheckCircle, XCircle, Loader2, UserCheck, AlertOctagon } from "lucide-react";
import VerificationGallery from "../../components/Admin/VerificationGallery";

export default function ValidarIdentidad() {
  const [vendedores, setVendedores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      // Ahora filtra vendedores con sellerStatus: "pending_identity"
      const res = await api.get("/admin/vendedores/identidad-pendiente");
      setVendedores(res.data);
    } catch (error) {
      console.error("Error al obtener vendedores:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (userId, action) => {
    let reason = "";

    if (action === "reject") {
      // Preguntamos el motivo del rechazo para informar al vendedor
      reason = window.prompt(
        "Indica el motivo del rechazo (Este mensaje lo verá el vendedor):",
        "Documentación inconsistente o fraudulenta"
      );
      if (reason === null) return; // Si cancela el prompt, no hace nada
    } else {
      if (!window.confirm("¿Estás seguro de APROBAR la identidad de este vendedor?")) return;
    }

    try {
      await api.put(`/admin/vendedores/${userId}/aprobar-identidad`, { 
        action, 
        reason 
      });
      
      // Feedback visual y recarga
      alert(action === "approve" ? "Vendedor aprobado" : "Vendedor rechazado");
      fetchSellers(); 
    } catch (error) {
      alert("Error al procesar la solicitud");
    }
  };

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <Loader2 className="animate-spin text-blue-500" size={40} />
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-xl text-white">
             <UserCheck size={28} />
          </div>
          Validar Identidad
        </h1>
        <p className="text-slate-500 font-medium mt-1">
          Analiza cuidadosamente las fotos para prevenir fraudes en el marketplace.
        </p>
      </div>

      {vendedores.length === 0 ? (
        <div className="bg-white p-20 rounded-[32px] border border-dashed border-slate-300 text-center">
          <CheckCircle className="mx-auto text-slate-300 mb-4" size={48} />
          <p className="text-slate-500 font-bold text-xl">Todo al día</p>
          <p className="text-slate-400">No hay vendedores esperando validación.</p>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-2">
          {vendedores.map((v) => (
            <div key={v._id} className="bg-white border border-slate-200 rounded-[32px] shadow-sm hover:shadow-md transition-shadow p-8 flex flex-col">
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="font-black text-2xl text-slate-900 leading-tight">
                    {v.storeName || "Sin Nombre"}
                  </h2>
                  <p className="text-slate-500 font-bold">{v.name}</p>
                  <p className="text-sm text-slate-400">{v.email}</p>
                </div>
                <div className="bg-slate-900 text-white text-[10px] px-3 py-1 rounded-full font-black tracking-widest uppercase">
                  ID: {v._id.slice(-6)}
                </div>
              </div>

              {/* GALERÍA DE DOCUMENTOS */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3 text-slate-400">
                  <AlertOctagon size={14} />
                  <span className="text-[10px] font-black uppercase tracking-wider">Verificación de Seguridad</span>
                </div>
                
                <VerificationGallery 
  images={{
    "Cédula Frontal": v.verification?.idDocumentFront?.url,
    "Selfie con Papel": v.verification?.selfieWithPaper?.url,
    "Logo": v.image || null
  }} 
/>
              </div>

              {/* ACCIONES */}
              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => handleVerify(v._id, "approve")}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-emerald-100"
                >
                  <CheckCircle size={20} /> Aprobar
                </button>
                <button
                  onClick={() => handleVerify(v._id, "reject")}
                  className="flex-1 bg-white border-2 border-red-100 text-red-500 hover:bg-red-50 py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <XCircle size={20} /> Rechazar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}