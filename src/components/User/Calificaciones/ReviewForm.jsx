import { useState } from "react";
import api from "../../../api/axios";

function StarRating({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className={`text-2xl transition ${
            star <= value ? "text-yellow-400" : "text-gray-300"
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function ReviewForm({ orderId, productId, onSuccess }) {
  const [ratingProduct, setRatingProduct] = useState(0);
  const [ratingSeller, setRatingSeller] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!ratingProduct || !ratingSeller) {
      return alert("Debes calificar el producto y el vendedor");
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
          comment
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("¡Gracias por tu calificación! ⭐");
      onSuccess?.();

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Error enviando la calificación"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 border rounded-xl p-4 bg-gray-50"
    >
      <h3 className="font-semibold text-lg mb-4">
        Calificar producto y vendedor
      </h3>

      {/* PRODUCTO */}
      <div className="mb-4">
        <p className="font-medium mb-1">Producto</p>
        <StarRating
          value={ratingProduct}
          onChange={setRatingProduct}
        />
      </div>

      {/* VENDEDOR */}
      <div className="mb-4">
        <p className="font-medium mb-1">Vendedor</p>
        <StarRating
          value={ratingSeller}
          onChange={setRatingSeller}
        />
      </div>

      {/* COMENTARIO */}
      <div className="mb-4">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Comentario (opcional)"
          className="w-full border rounded-lg p-2 text-sm"
          rows={3}
        />
      </div>

      <button
        disabled={loading}
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
      >
        {loading ? "Enviando..." : "Enviar calificación"}
      </button>
    </form>
  );
}
