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
      <div className="relative w-full h-[300px] md:h-[480px] rounded-[2rem] overflow-hidden shadow-xl bg-slate-900 border border-slate-200/5">
        
        {banners.map((banner, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Imagen que ocupa casi todo el espacio */}
            <div
              style={{ backgroundImage: `url(${banner.image.url})` }}
              className={`w-full h-full bg-center bg-cover transition-transform duration-[8000ms] ${
                index === currentIndex ? "scale-105" : "scale-100"
              }`}
            />
            
            {/* Overlay sutil en la parte inferior para el texto */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

            {/* Contenido textual anclado abajo */}
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 z-20">
              <div className={`max-w-xl transition-all duration-700 transform ${
                index === currentIndex ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}>
                
                {/* Badge minimalista */}
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-3 py-1 rounded-full mb-4">
                  <Sparkles size={14} className="text-yellow-400" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Destacado</span>
                </div>

                <h2 className="text-white text-3xl md:text-5xl font-extrabold mb-3 tracking-tight leading-tight">
                  {banner.title}
                </h2>
                
                <p className="text-white/80 text-sm md:text-lg font-medium max-w-md mb-8 leading-snug">
                  {banner.description}
                </p>

                
              </div>
            </div>
          </div>
        ))}

        {/* Flechas más pequeñas y discretas */}
        {banners.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all hover:bg-white hover:text-black"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all hover:bg-white hover:text-black"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Indicadores tipo píldora elegantes */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentIndex === index ? "w-8 bg-white" : "w-2 bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}