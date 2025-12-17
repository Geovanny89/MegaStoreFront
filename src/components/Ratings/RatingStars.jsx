export default function RatingStars({ value = 0, count = 0, size = "text-base" }) {
  const fullStars = Math.floor(value);
  const hasHalf = value % 1 >= 0.5;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        if (star <= fullStars) {
          return (
            <span key={star} className={`text-yellow-400 ${size}`}>★</span>
          );
        }

        if (star === fullStars + 1 && hasHalf) {
          return (
            <span key={star} className={`text-yellow-400 ${size}`}>☆</span>
          );
        }

        return (
          <span key={star} className={`text-gray-300 ${size}`}>★</span>
        );
      })}

      {count > 0 && (
        <span className="ml-1 text-sm text-gray-500">
          ({count})
        </span>
      )}
    </div>
  );
}
