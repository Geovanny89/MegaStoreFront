import React, { useState } from 'react';
import { Eye, X, Download } from 'lucide-react';

export default function VerificationGallery({ images }) {
  const [selectedImg, setSelectedImg] = useState(null);

  // Función para descargar la imagen
  const handleDownload = (url, name) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = `verificacion-${name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Si no llegan imágenes, no renderizamos nada para evitar errores
  if (!images) return null;

  return (
    <div className="space-y-4">
      {/* GRILLA DE MINIATURAS (2 COLUMNAS) */}
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(images).map(([key, url]) => {
          if (!url) return null;

          return (
            <div 
              key={key} 
              className="relative group overflow-hidden rounded-xl border border-gray-200 bg-gray-50 aspect-video shadow-sm"
            >
              <img 
                src={url} 
                alt={key} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              
              {/* CAPA OSCURA AL PASAR EL MOUSE */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button 
                  type="button"
                  onClick={() => setSelectedImg({ url, key })}
                  className="p-2 bg-white rounded-full text-gray-900 hover:bg-blue-50 hover:scale-110 transition-all shadow-lg"
                  title="Ver en grande"
                >
                  <Eye size={20} />
                </button>
                <button 
                  type="button"
                  onClick={() => handleDownload(url, key)}
                  className="p-2 bg-white rounded-full text-gray-900 hover:bg-blue-50 hover:scale-110 transition-all shadow-lg"
                  title="Descargar archivo"
                >
                  <Download size={20} />
                </button>
              </div>

              {/* ETIQUETA INFERIOR (EJ: PAGO, CÉDULA) */}
              <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded-md text-[10px] text-white uppercase font-black tracking-wider pointer-events-none">
                {key}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL DE ZOOM (PANTALLA COMPLETA) */}
      {selectedImg && (
        <div 
          className="fixed inset-0 z-[999] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm" 
          onClick={() => setSelectedImg(null)}
        >
          {/* BOTÓN CERRAR */}
          <button 
            type="button"
            className="absolute top-6 right-6 text-white/70 hover:text-white hover:rotate-90 transition-all"
            onClick={() => setSelectedImg(null)}
          >
            <X size={40} />
          </button>

          {/* TÍTULO DE LA IMAGEN EN ZOOM */}
          <div className="absolute top-6 left-6 text-white">
             <p className="text-xs uppercase tracking-widest font-bold opacity-50">Visualizando</p>
             <h3 className="text-xl font-bold tracking-tight">{selectedImg.key}</h3>
          </div>

          <img 
            src={selectedImg.url} 
            className="max-w-full max-h-[85vh] rounded-lg shadow-2xl animate-in zoom-in-95 duration-300 ring-4 ring-white/10" 
            alt="Vista ampliada"
            onClick={(e) => e.stopPropagation()} 
          />
          
          <p className="absolute bottom-8 text-white/40 text-sm italic">
            Haz clic en el fondo para cerrar la vista
          </p>
        </div>
      )}
    </div>
  );
}