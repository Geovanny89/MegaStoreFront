import React, { useEffect, useState } from "react";
import api from "../../../api/axios";

/* ================= MAPA DE ESTADOS ================= */
const ORDER_STATUS_LABELS = {
  pending: "Pendiente",
  paid: "Pagada",
  processing: "En preparación",
  shipped: "Enviada",
  delivered: "Entregada",
  cancelled: "Cancelada"
};

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/seller/orders");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      setError("Error al cargar órdenes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId, status) => {
    const statusLabel = ORDER_STATUS_LABELS[status] || status;

    if (!window.confirm(`¿Seguro que quieres marcar la orden como "${statusLabel}"?`)) {
      return;
    }

    try {
      setUpdatingId(orderId);

      const endpoint =
        status === "processing"
          ? `/seller/orders/${orderId}/processing`
          : `/seller/orders/${orderId}/shipped`;

      await api.put(endpoint);
      await fetchOrders();
      setUpdatingId(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error al actualizar la orden");
      setUpdatingId(null);
    }
  };

  // Color por estado
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-red-500 text-white";
      case "paid":
        return "bg-green-500 text-white";
      case "processing":
        return "bg-yellow-500 text-white";
      case "shipped":
        return "bg-blue-500 text-white";
      case "delivered":
        return "bg-indigo-500 text-white";
      default:
        return "bg-gray-300 text-gray-800";
    }
  };

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages =
    orders.length > 0 ? Math.ceil(orders.length / itemsPerPage) : 1;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  if (loading)
    return <p className="text-center mt-10">Cargando órdenes...</p>;

  if (error)
    return (
      <p className="text-center mt-10 text-red-500">{error}</p>
    );

  return (
    <div className="max-w-5xl mx-auto mt-10 px-2">
      <h2 className="text-3xl font-bold mb-6">Mis órdenes</h2>

      <div className="space-y-4">
        {currentOrders.map((order) => (
          <div
            key={order._id}
            className="bg-white shadow-sm rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center"
          >
            <div>
              <p className="font-semibold">
                Orden ID: {order._id}
              </p>

              <p className="text-gray-600">
                Comprador: {order.user?.name || "Sin nombre"}
              </p>

              <span
                className={`inline-block px-2 py-1 mt-1 rounded text-sm font-semibold ${getStatusColor(
                  order.status
                )}`}
              >
                {ORDER_STATUS_LABELS[order.status] || order.status}
              </span>

              <p className="text-gray-600 mt-2">
                Productos:{" "}
                {order.products
                  .map((p) => p.product?.name)
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>

            <div className="flex gap-2 mt-3 md:mt-0">
              {order.status === "paid" && (
                <button
                  onClick={() =>
                    handleStatusUpdate(order._id, "processing")
                  }
                  disabled={updatingId === order._id}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {updatingId === order._id
                    ? "Actualizando..."
                    : "Marcar en preparación"}
                </button>
              )}

              {order.status === "processing" && (
                <button
                  onClick={() =>
                    handleStatusUpdate(order._id, "shipped")
                  }
                  disabled={updatingId === order._id}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {updatingId === order._id
                    ? "Actualizando..."
                    : "Marcar como enviada"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* PAGINACIÓN */}
      <div className="flex justify-center mt-6 gap-2 flex-wrap">
        <button
          className="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-50"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Anterior
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`px-3 py-1 border rounded-md ${
              currentPage === i + 1
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-100"
            }`}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          className="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-50"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
