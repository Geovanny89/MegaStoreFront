import React from "react";

export default function Pagination({currentPage,totalPages,onPageChange,}) {
  if (totalPages === 0) return null;

  // Permite mostrar máximo 5 páginas visibles
  const getVisiblePages = () => {
    const pages = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center justify-center mt-8 gap-2 select-none">

      {/* Anterior */}
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-3 py-2 rounded-md border bg-white hover:bg-gray-100 disabled:opacity-40"
      >
        Anterior
      </button>

      {/* Primera página si está oculta */}
      {visiblePages[0] > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-3 py-2 rounded-md border bg-white hover:bg-gray-100"
          >
            1
          </button>
          <span className="px-2">…</span>
        </>
      )}

      {/* Páginas visibles */}
      {visiblePages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 rounded-md border transition-all ${
            page === currentPage
              ? "bg-blue-600 text-white border-blue-600 shadow"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      ))}

      {/* Última página si está oculta */}
      {visiblePages[visiblePages.length - 1] < totalPages && (
        <>
          <span className="px-2">…</span>
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-3 py-2 rounded-md border bg-white hover:bg-gray-100"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Siguiente */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-3 py-2 rounded-md border bg-white hover:bg-gray-100 disabled:opacity-40"
      >
        Siguiente
      </button>

    </div>
  );
}
