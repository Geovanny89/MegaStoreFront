import { useEffect, useState } from "react";
import api from "../../../api/axios";
import RatingStars from "../../Ratings/RatingStars";

export default function ProductReviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (!productId) return;

    const fetchReviews = async () => {
      try {
        const res = await api.get(`/reviews/product/${productId}`);
        setReviews(res.data);
      } catch (error) {
        console.error("Error cargando reviews", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  if (loading) {
    return (
      <p className="text-sm text-gray-400">
        Cargando opiniones...
      </p>
    );
  }

  if (reviews.length === 0) {
    return (
      <p className="text-sm text-gray-400">
        Este producto aún no tiene opiniones
      </p>
    );
  }

  const visibleReviews = showAll ? reviews : reviews.slice(0, 3);

  return (
    <div className="space-y-5">

      {/* LISTA DE REVIEWS */}
      {visibleReviews.map((review) => (
        <div
          key={review._id}
          className="border rounded-xl p-4 bg-gray-50"
        >
          {/* HEADER */}
          <div className="flex items-center justify-between">
            <p className="font-medium text-gray-800">
              {review.userId?.name || "Usuario"}
            </p>

            <RatingStars
              value={review.ratingProduct}
              size="text-sm"
            />
          </div>

          {/* COMENTARIO */}
          {review.comment && (
            <p className="text-sm text-gray-700 mt-2">
              {review.comment}
            </p>
          )}

          {/* FECHA */}
          <p className="text-xs text-gray-400 mt-2">
            {new Date(review.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}

      {/* BOTÓN VER MÁS */}
      {reviews.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
        >
          {showAll
            ? "Mostrar menos opiniones"
            : `Ver todas las opiniones (${reviews.length})`}
        </button>
      )}
    </div>
  );
}
