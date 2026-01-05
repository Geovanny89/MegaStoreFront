import { useState, useRef } from "react";
import api from "../../api/axios";
import { 
  AlertTriangle, Camera, Upload, X, CheckCircle2, 
  RotateCcw, CreditCard, User, ArrowRight, Loader2, Info
} from "lucide-react";

export default function SellerRejected({ rejectionReason }) {
  const [files, setFiles] = useState({ id: null, selfie: null });
  const [previews, setPreviews] = useState({ id: null, selfie: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [cameraActive, setCameraActive] = useState(null); // 'id' | 'selfie' | null
  const videoRef = useRef(null);

  /* ================= LÓGICA DE CÁMARA ================= */

  const startCamera = async (type) => {
    setCameraActive(type);
    setError("");
    const constraints = {
      video: { 
        facingMode: type === "selfie" ? "user" : "environment",
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    };
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      setError("No se pudo acceder a la cámara. Verifica los permisos.");
      setCameraActive(null);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setCameraActive(null);
  };

  const capturePhoto = () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0);
    
    canvas.toBlob((blob) => {
      const file = new File([blob], `${cameraActive}.jpg`, { type: "image/jpeg" });
      handleFileSelection(file, cameraActive);
      stopCamera();
    }, "image/jpeg", 0.9);
  };

  /* ================= MANEJO DE ARCHIVOS ================= */

  const handleFileSelection = (file, type) => {
    if (!file) return;
    setFiles(prev => ({ ...prev, [type]: file }));
    setPreviews(prev => ({ ...prev, [type]: URL.createObjectURL(file) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!files.id || !files.selfie) {
      setError("Debes completar ambos requisitos para reintentar.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("idDocumentFront", files.id);
      formData.append("selfieWithPaper", files.selfie);

      await api.put("/seller/retry-identity", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || "Error reenviando documentos");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI HELPER ================= */

  const SelectionCard = ({ type, label, description, allowUpload = true }) => (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</label>
        {!allowUpload && (
            <span className="text-[8px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">
                Solo Cámara
            </span>
        )}
      </div>
      
      {previews[type] ? (
        <div className="relative group rounded-2xl overflow-hidden border-2 border-red-500/30 aspect-video bg-[#111827]">
          <img src={previews[type]} className="w-full h-full object-cover" alt="Preview" />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
            <button type="button" onClick={() => startCamera(type)} className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md">
              <RotateCcw size={20} />
            </button>
            <button type="button" onClick={() => { setFiles(p => ({...p, [type]: null})); setPreviews(p => ({...p, [type]: null})); }} className="p-3 bg-red-500/20 hover:bg-red-500/40 rounded-full text-red-400 backdrop-blur-md">
              <X size={20} />
            </button>
          </div>
          <div className="absolute top-3 right-3 bg-green-500 text-white p-1 rounded-full">
            <CheckCircle2 size={14} />
          </div>
        </div>
      ) : (
        <div className={`grid ${allowUpload ? 'grid-cols-2' : 'grid-cols-1'} gap-3`}>
          <button 
            type="button"
            onClick={() => startCamera(type)}
            className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#4B5563] hover:border-red-500 rounded-2xl bg-[#111827]/40 text-gray-400 hover:text-red-400 transition-all group"
          >
            <Camera className="mb-2 group-hover:scale-110 transition-transform" size={24} />
            <span className="text-[10px] font-bold uppercase">Tomar Foto</span>
          </button>
          
          {allowUpload && (
            <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#4B5563] hover:border-red-500 rounded-2xl bg-[#111827]/40 text-gray-400 hover:text-red-400 cursor-pointer transition-all group">
              <Upload className="mb-2 group-hover:scale-110 transition-transform" size={24} />
              <span className="text-[10px] font-bold uppercase">Archivo</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileSelection(e.target.files[0], type)} />
            </label>
          )}
        </div>
      )}
      <p className="text-[9px] text-gray-500 italic leading-tight">{description}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#111827] flex items-center justify-center p-4 md:p-10 font-sans text-gray-200">
      <div className="max-w-xl w-full bg-[#1F2937] rounded-[2.5rem] shadow-2xl border border-[#374151] overflow-hidden">
        
        {/* BANNER DE RECHAZO */}
        <div className="bg-red-600/10 border-b border-red-500/20 p-8 text-center">
          <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={32} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Verificación Rechazada</h2>
          <div className="bg-red-500/5 rounded-xl p-4 border border-red-500/10">
            <p className="text-red-200 text-sm font-medium leading-relaxed">
              {rejectionReason || "Los documentos no pudieron ser validados. Por favor intenta de nuevo con fotos más claras."}
            </p>
          </div>
        </div>

        {/* FORMULARIO */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold p-4 rounded-xl flex items-center gap-3">
              <Info size={16} /> {error}
            </div>
          )}

          <div className="space-y-8">
            <SelectionCard 
              type="id" 
              label="1. Cédula (Lado Frontal)" 
              description="Asegúrate que se lea bien tu nombre y número."
              allowUpload={true}
            />

            <SelectionCard 
              type="selfie" 
              label="2. Selfie con Documento" 
              description="Sostén tu cédula junto a tu rostro. No se permiten archivos de galería."
              allowUpload={false}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !files.id || !files.selfie}
            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-30 py-4 rounded-2xl font-black text-white text-xs uppercase tracking-widest shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <>Subir y Reintentar <ArrowRight size={18}/></>}
          </button>
        </form>
      </div>

      {/* MODAL DE CÁMARA */}
      {cameraActive && (
        <div className="fixed inset-0 z-[110] bg-black flex flex-col items-center justify-center p-4">
          <div className="relative w-full max-w-lg aspect-[3/4] bg-[#111827] rounded-3xl overflow-hidden shadow-2xl border border-white/5">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            
            <div className="absolute inset-0 border-[30px] border-black/40 pointer-events-none flex items-center justify-center">
              <div className={`border-2 border-white/40 border-dashed ${cameraActive === 'id' ? 'w-full h-48 rounded-xl' : 'w-64 h-64 rounded-full'} mb-12`}></div>
            </div>

            <div className="absolute bottom-8 inset-x-0 flex justify-center gap-6 px-6">
              <button type="button" onClick={stopCamera} className="p-4 bg-white/10 rounded-full text-white backdrop-blur-md">
                <X size={24} />
              </button>
              <button type="button" onClick={capturePhoto} className="p-6 bg-red-600 rounded-full text-white shadow-xl shadow-red-600/40 transition-transform active:scale-90">
                <Camera size={32} />
              </button>
            </div>
            
            <div className="absolute top-8 text-center w-full">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-red-600 text-white px-4 py-2 rounded-full shadow-lg">
                Capturando {cameraActive === 'id' ? "Documento" : "Selfie"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}