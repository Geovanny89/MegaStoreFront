import React, { useState } from "react";
import api from "../../../api/axios";
import { Star, Send } from "lucide-react";

/* ================= COMPONENTE DE ESTRELLAS ================= */
function StarRating({ value, onChange }) {
  return (
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="group relative focus:outline-none transition-transform active:scale-90"
        >
          <Star
            size={24}
            className={`transition-all duration-200 ${
              star <= value
                ? "fill-yellow-400 text-yellow-400 scale-110"
                : "text-slate-300 dark:text-slate-600 group-hover:text-yellow-200"
            }`}
          />
          {/* Efecto de brillo detrás de la estrella seleccionada */}
          {star === value && (
            <span className="absolute inset-0 bg-yellow-400/20 blur-lg rounded-full animate-pulse" />
          )}
        </button>
      ))}
    </div>
  );
}

/* ================= COMPONENTE PRINCIPAL ================= */
export default function ReviewForm({ orderId, productId, onSuccess }) {
  const [ratingProduct, setRatingProduct] = useState(0);
  const [ratingSeller, setRatingSeller] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!ratingProduct || !ratingSeller) {
      return alert("Por favor, califica tanto el producto como al vendedor.");
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await api.post(
        "/reviews/calificaciones",
        {
          orderId,
          productId,
          ratingProduct,
          ratingSeller,
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("¡Gracias por tu calificación! ⭐ Su opinión nos ayuda a mejorar.");
      onSuccess?.();
    } catch (error) {
      alert(
        error.response?.data?.message || "Error al enviar la calificación. Inténtalo de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 bg-slate-50 dark:bg-slate-900/40 transition-all shadow-sm"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-xl text-yellow-600 dark:text-yellow-400">
          <Star size={20} className="fill-current" />
        </div>
        <h3 className="font-black text-sm uppercase tracking-tight text-slate-800 dark:text-white">
          Calificar experiencia
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
        {/* CALIFICACIÓN PRODUCTO */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400 block px-1">
            ¿Qué tal el producto?
          </label>
          <StarRating value={ratingProduct} onChange={setRatingProduct} />
        </div>

        {/* CALIFICACIÓN VENDEDOR */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400 block px-1">
            Atención del vendedor
          </label>
          <StarRating value={ratingSeller} onChange={setRatingSeller} />
        </div>
      </div>

      {/* COMENTARIO */}
      <div className="space-y-3 mb-6">
        <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400 block px-1">
          Comentario adicional
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Cuéntanos más detalles sobre tu pedido..."
          className="w-full border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all resize-none shadow-inner"
          rows={3}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full group bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-slate-200 dark:shadow-none flex items-center justify-center gap-2 active:scale-[0.98]"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            Enviar Calificación
            <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </>
        )}
      </button>
      
      <p className="text-center mt-4 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter">
        Tu reseña será visible para otros compradores del marketplace.
      </p>
    </form>
  );
}