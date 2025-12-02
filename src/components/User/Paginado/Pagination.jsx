import React from "react";

export default function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages === 1) return null;

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  const pageNumbers = [];

  // Lógica para mostrar máximo 5 botones de página
  let start = Math.max(1, currentPage - 2);
  let end = Math.min(totalPages, currentPage + 2);

  if (currentPage <= 3) end = Math.min(5, totalPages);
  if (currentPage >= totalPages - 2) start = Math.max(1, totalPages - 4);

  for (let i = start; i <= end; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex items-center justify-center mt-10">
      <nav
        aria-label="Pagination Navigation"
        className="flex items-center space-x-2"
      >
        {/* Botón Anterior */}
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-2 rounded-lg border text-sm ${
            currentPage === 1
              ? "text-gray-400 border-gray-300 cursor-not-allowed"
              : "text-gray-700 border-gray-400 hover:bg-gray-100"
          }`}
        >
          Anterior
        </button>

        {/* Páginas */}
        {pageNumbers.map((num) => (
          <button
            key={num}
            onClick={() => goToPage(num)}
            className={`px-3 py-2 rounded-lg text-sm border ${
              currentPage === num
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {num}
          </button>
        ))}

        {/* Botón Siguiente */}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-2 rounded-lg border text-sm ${
            currentPage === totalPages
              ? "text-gray-400 border-gray-300 cursor-not-allowed"
              : "text-gray-700 border-gray-400 hover:bg-gray-100"
          }`}
        >
          Siguiente
        </button>
      </nav>
    </div>
  );
}
