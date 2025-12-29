import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, X, Check } from 'lucide-react';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Verificamos si el usuario ya aceptó las cookies anteriormente
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Si no hay registro, mostramos el banner después de 1.5 segundos
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[9999] animate-bounce-in">
      <div className="max-w-4xl mx-auto bg-[#111827] text-white p-4 md:p-6 rounded-[2rem] shadow-2xl border border-white/10 backdrop-blur-lg">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="hidden md:flex w-12 h-12 bg-blue-600/20 rounded-2xl items-center justify-center text-blue-500 shrink-0">
              <Cookie size={28} />
            </div>
            <div>
              <h4 className="font-black uppercase tracking-widest text-[10px] text-blue-500 mb-1">Tu privacidad importa</h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                Utilizamos cookies propias para mejorar tu experiencia de compra y asegurar que el chat funcione correctamente. 
                Al continuar, aceptas nuestros <Link to="/terminos-condiciones" className="text-white underline hover:text-blue-400">Términos</Link> y <Link to="/privacidad" className="text-white underline hover:text-blue-400">Privacidad</Link>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button 
              onClick={acceptCookies}
              className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-black text-xs uppercase transition-all flex items-center justify-center gap-2 group"
            >
              Aceptar <Check size={16} className="group-hover:scale-110 transition-transform" />
            </button>
            <button 
              onClick={() => setIsVisible(false)}
              className="p-3 text-gray-500 hover:text-white transition-colors"
              title="Cerrar"
            >
              <X size={20} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}