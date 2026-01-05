import { useState, useRef } from "react";
import api from "../../../api/axios";
import { 
  Camera, Upload, X, CheckCircle2, ShieldCheck, 
  RotateCcw, CreditCard, User, ArrowRight, AlertCircle 
} from "lucide-react";

export default function UploadIdentityDocuments({ seller }) {
  const [files, setFiles] = useState({ id: null, selfie: null });
  const [previews, setPreviews] = useState({ id: null, selfie: null });
  const [loading, setLoading] = useState(false);
  
  const [cameraActive, setCameraActive] = useState(null); 
  const videoRef = useRef(null);

  /* ================= LÓGICA DE CÁMARA ================= */

  const startCamera = async (type) => {
    setCameraActive(type);
    const constraints = {
      video: { facingMode: type === "selfie" ? "user" : "environment" }
    };
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      alert("No se pudo acceder a la cámara. Verifica los permisos.");
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
    }, "image/jpeg", 0.8);
  };

  /* ================= MANEJO DE ARCHIVOS ================= */

  const handleFileSelection = (file, type) => {
    if (!file) return;
    setFiles(prev => ({ ...prev, [type]: file }));
    setPreviews(prev => ({ ...prev, [type]: URL.createObjectURL(file) }));
  };

  const handleSubmit = async () => {
    if (!files.id || !files.selfie) return alert("Por favor, completa ambos requisitos.");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("idDocumentFront", files.id);
      formData.append("selfieWithPaper", files.selfie);

      await api.post("/seller/submit-identity", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      alert("Documentos enviados correctamente.");
      window.location.reload();
    } catch (error) {
      alert(error.response?.data?.message || "Error al subir documentos");
    } finally {
      setLoading(false);
    }
  };

  /* ================= COMPONENTES DE UI ================= */

  const DropZone = ({ type, label, description, allowUpload = true }) => (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</label>
        {!allowUpload && (
          <span className="bg-blue-600/20 text-blue-400 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter border border-blue-500/20">
            Solo cámara en vivo
          </span>
        )}
      </div>
      
      {previews[type] ? (
        <div className="relative group rounded-2xl overflow-hidden border-2 border-blue-500/50 aspect-video bg-[#111827]">
          <img src={previews[type]} className="w-full h-full object-cover" alt="Preview" />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
            <button onClick={() => startCamera(type)} className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-all">
              <RotateCcw size={20} />
            </button>
            <button onClick={() => { setFiles(p => ({...p, [type]: null})); setPreviews(p => ({...p, [type]: null})); }} className="p-3 bg-red-500/20 hover:bg-red-500/40 rounded-full text-red-400 backdrop-blur-md transition-all">
              <X size={20} />
            </button>
          </div>
          <div className="absolute top-3 right-3 bg-blue-600 text-white p-1 rounded-full">
            <CheckCircle2 size={14} />
          </div>
        </div>
      ) : (
        <div className={`grid ${allowUpload ? 'grid-cols-2' : 'grid-cols-1'} gap-3`}>
          <button 
            onClick={() => startCamera(type)}
            className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#4B5563] hover:border-blue-500 rounded-2xl bg-[#111827]/40 text-gray-400 hover:text-blue-400 transition-all group"
          >
            <Camera className="mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold uppercase">Tomar Foto</span>
          </button>
          
          {allowUpload && (
            <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#4B5563] hover:border-blue-500 rounded-2xl bg-[#111827]/40 text-gray-400 hover:text-blue-400 cursor-pointer transition-all group">
              <Upload className="mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold uppercase">Subir Archivo</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileSelection(e.target.files[0], type)} />
            </label>
          )}
        </div>
      )}
      <p className="text-[9px] text-gray-500 italic leading-tight">{description}</p>
    </div>
  );

  return (
    <div className="max-w-xl mx-auto bg-[#1F2937] rounded-[2.5rem] shadow-2xl border border-[#374151] overflow-hidden font-sans">
      
      <div className="p-8 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-blue-600/20 rounded-2xl">
            <ShieldCheck className="text-blue-500" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-white leading-none">Verificación de Identidad</h2>
            <p className="text-gray-400 text-xs mt-1">Requerido para activar ventas y retiros.</p>
          </div>
        </div>
        
        {seller?.sellerStatus === "rejected_identity" && (
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex gap-3 items-center mb-6">
            <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
            <p className="text-red-200 text-xs font-medium">Reintentar: Asegúrate de que las fotos sean claras.</p>
          </div>
        )}
      </div>

      <div className="px-8 pb-8 space-y-8">
        {/* LA CEDULA PUEDE SER SUBIDA O TOMADA CON CAMARA */}
        <DropZone 
          type="id" 
          label="Cédula de Ciudadanía (Frontal)" 
          description="Asegúrate que los datos sean legibles y no haya reflejos."
          allowUpload={true}
        />

        {/* LA SELFIE SOLO PERMITE CAMARA */}
        <DropZone 
          type="selfie" 
          label="Selfie de Seguridad" 
          description="Sostén tu cédula junto a un papel con la fecha de hoy. Solo se acepta cámara en vivo."
          allowUpload={false}
        />

        <button
          onClick={handleSubmit}
          disabled={loading || !files.id || !files.selfie}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-30 disabled:grayscale py-4 rounded-2xl font-black text-white text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          {loading ? "Procesando..." : <>Enviar para revisión <ArrowRight size={18}/></>}
        </button>
      </div>

      {/* MODAL DE CÁMARA */}
      {cameraActive && (
        <div className="fixed inset-0 z-[110] bg-black flex flex-col items-center justify-center p-4">
          <div className="relative w-full max-w-lg aspect-[3/4] md:aspect-video bg-[#111827] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            
            <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none flex items-center justify-center">
              <div className={`border-2 border-white/50 border-dashed ${cameraActive === 'id' ? 'w-4/5 h-1/2 rounded-xl' : 'w-64 h-64 rounded-full'} mb-12`}></div>
            </div>

            <div className="absolute bottom-8 inset-x-0 flex justify-center gap-6 px-6">
              <button onClick={stopCamera} className="p-4 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-all">
                <X size={24} />
              </button>
              <button onClick={capturePhoto} className="p-6 bg-blue-600 hover:bg-blue-500 rounded-full text-white shadow-xl shadow-blue-600/40 transform transition-transform active:scale-90">
                <Camera size={32} />
              </button>
            </div>
            
            <div className="absolute top-8 left-0 right-0 text-center">
              <p className="text-white text-xs font-black uppercase tracking-widest bg-black/40 backdrop-blur-md py-2 px-4 inline-block rounded-full">
                {cameraActive === 'id' ? "Encuadra tu documento" : "Ubica tu rostro"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}