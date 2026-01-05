import { Clock, ShieldCheck, ArrowLeft } from "lucide-react";

export default function ValidandoIdentidad() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-slate-100 max-w-md w-full text-center">
        
        {/* Icono Principal con Feedback Visual Positivo */}
        <div className="relative mx-auto w-20 h-20 mb-6">
          <div className="absolute inset-0 bg-blue-100 rounded-full animate-pulse"></div>
          <ShieldCheck size={48} className="text-blue-600 relative z-10 m-4" />
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">
          Estamos validando tu cuenta
        </h2>
        
        <p className="text-slate-600 leading-relaxed mb-8">
          Para garantizar la seguridad del marketplace, nuestro equipo está revisando tus documentos. 
          <span className="block mt-2 font-semibold text-slate-800">
            Te notificaremos por correo en cuanto termines.
          </span>
        </p>

        {/* Indicador de Estado */}
        <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-center gap-3 mb-8">
          <Clock size={20} className="text-blue-500 animate-[spin_3s_linear_infinite]" />
          <span className="text-sm font-medium text-slate-500">
            Tiempo estimado: 2 a 24 horas
          </span>
        </div>

        {/* Acción Secundaria */}
        <button 
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft size={16} />
          Volver al inicio
        </button>
      </div>
    </div>
  );
}