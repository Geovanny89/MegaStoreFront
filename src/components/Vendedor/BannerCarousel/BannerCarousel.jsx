import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from "lucide-react";

export default function BannerCarousel({ banners }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 800);
  }, [banners.length, isAnimating]);

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 800);
  };

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(nextSlide, 7000);
    return () => clearInterval(interval);
  }, [nextSlide, banners.length]);

  if (!banners || banners.length === 0) return null;

  return (
    <div className="relative w-full mb-12 group/carousel px-4 md:px-0">
      {/* Contenedor principal con soporte para Dark Mode en bordes */}
      <div className="relative w-full h-[300px] md:h-[480px] rounded-[2rem] overflow-hidden shadow-xl bg-slate-900 border border-slate-200/5 dark:border-white/10 transition-colors duration-300">
        
        {banners.map((banner, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Imagen con zoom lento */}
            <div
              style={{ backgroundImage: `url(${banner.image.url})` }}
              className={`w-full h-full bg-center bg-cover transition-transform duration-[8000ms] ${
                index === currentIndex ? "scale-105" : "scale-100"
              }`}
            />
            
            {/* Overlay: Se vuelve un poco más oscuro en dark mode para mejorar contraste */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent dark:from-slate-950/95" />

            {/* Contenido textual */}
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 z-20">
              <div className={`max-w-xl transition-all duration-700 transform ${
                index === currentIndex ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}>
                
                {/* Badge minimalista */}
                <div className="inline-flex items-center gap-2 bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/20 dark:border-white/10 text-white px-3 py-1 rounded-full mb-4">
                  <Sparkles size={14} className="text-yellow-400" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Destacado</span>
                </div>

                <h2 className="text-white text-3xl md:text-5xl font-extrabold mb-3 tracking-tight leading-tight">
                  {banner.title}
                </h2>
                
                <p className="text-white/80 dark:text-slate-300 text-sm md:text-lg font-medium max-w-md mb-8 leading-snug">
                  {banner.description}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Flechas de navegación adaptadas */}
        {banners.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/30 dark:bg-white/10 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all hover:bg-white dark:hover:bg-blue-600 hover:text-black dark:hover:text-white"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/30 dark:bg-white/10 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all hover:bg-white dark:hover:bg-blue-600 hover:text-black dark:hover:text-white"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Indicadores tipo píldora */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentIndex === index 
                  ? "w-8 bg-white" 
                  : "w-2 bg-white/40 dark:bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}