import api from "../../../api/axios";
import { FiTrash2, FiEye, FiEyeOff, FiCalendar, FiLink, FiExternalLink } from "react-icons/fi";

export default function BannerItem({ banner, onDelete, onToggle }) {
  
  const handleToggle = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await api.patch(`/${banner._id}/toggle`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onToggle({ ...banner, isActive: data.isActive });
    } catch (err) {
      console.error("Error al cambiar estado:", err);
    }
  };

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que deseas eliminar este banner? Esta acción no se puede deshacer.")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/${banner._id}/banners`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onDelete(banner._id);
    } catch (err) {
      console.error("Error al eliminar:", err);
    }
  };

  return (
    <div className={`group relative bg-white border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md ${!banner.isActive ? 'opacity-75' : 'border-gray-200'}`}>
      <div className="flex flex-col sm:flex-row items-center gap-4 p-3">
        
        {/* Previsualización de Imagen */}
        <div className="relative w-full sm:w-48 h-28 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
          <img 
            src={banner.image.url} 
            alt={banner.title} 
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${!banner.isActive && 'grayscale'}`}
          />
          {!banner.isActive && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white text-xs font-bold uppercase tracking-wider">Inactivo</span>
            </div>
          )}
        </div>

        {/* Información del Banner */}
        <div className="flex-1 w-full space-y-1">
          <div className="flex items-start justify-between">
            <h3 className="font-bold text-gray-800 text-lg leading-tight truncate max-w-[200px]">
              {banner.title || "Sin título"}
            </h3>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${banner.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              {banner.isActive ? 'Activo' : 'Oculto'}
            </span>
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-gray-500">
            {banner.linkType !== 'none' && (
              <div className="flex items-center gap-1">
                <FiLink className="text-blue-500" />
                <span className="capitalize">{banner.linkType}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <FiCalendar />
              <span>{new Date(banner.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          
          {banner.description && (
            <p className="text-xs text-gray-400 line-clamp-1 italic">
              "{banner.description}"
            </p>
          )}
        </div>

        {/* Acciones */}
        <div className="flex sm:flex-col gap-2 w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-gray-100 pt-3 sm:pt-0 sm:pl-4">
          <button
            onClick={handleToggle}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              banner.isActive 
              ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' 
              : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
            }`}
            title={banner.isActive ? "Ocultar de la tienda" : "Mostrar en la tienda"}
          >
            {banner.isActive ? <><FiEyeOff /> Pausar</> : <><FiEye /> Activar</>}
          </button>

          <button
            onClick={handleDelete}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
            title="Eliminar permanentemente"
          >
            <FiTrash2 />
            <span className="sm:hidden">Eliminar</span>
          </button>
        </div>
      </div>
    </div>
  );
}