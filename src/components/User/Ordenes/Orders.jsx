import React, { useEffect, useState } from "react";
import api from "../../../api/axios";
import { Eye, X } from "lucide-react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // PAGINADO
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setOrders([]);
        setLoading(false);
        return;
      }

      const response = await api.get("/order/my-orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(response.data || []);
    } catch (error) {
      console.error("Error obteniendo órdenes:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ================= PAGINADO =================
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold mb-6">Mis órdenes</h2>

      {loading && <p className="text-gray-500">Cargando órdenes...</p>}

      {!loading && orders.length === 0 && (
        <p className="text-gray-500">Aún no tienes órdenes.</p>
      )}

      {!loading && orders.length > 0 && (
        <>
          <div className="flex flex-col gap-6">
            {currentOrders.map((order) => {
              const formattedDate = new Date(order.createdAt).toLocaleString(
                "es-ES",
                {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }
              );

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">
                        Orden #{order._id.slice(-6)}
                      </h3>

                      <p className="text-gray-600 mt-1">
                        Estado:
                        <span className="ml-2 font-bold text-orange-600">
                          {order.status}
                        </span>
                      </p>

                      <p className="mt-3 text-blue-600 font-bold text-xl">
                        Total: ${order.total.toLocaleString()}
                      </p>

                      <p className="mt-2 text-gray-500 text-sm">
                        Realizada el {formattedDate}
                      </p>
                    </div>

                    {/* BOTÓN VER */}
                    <button
                      onClick={() =>
                        setSelectedOrder(JSON.parse(JSON.stringify(order)))
                      }
                      className="text-blue-600 hover:text-blue-700 p-2"
                    >
                      <Eye size={28} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ================= PAGINACIÓN ================= */}
          {orders.length > ordersPerPage && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.max(prev - 1, 1))
                }
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg border text-sm font-medium
                  ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white hover:bg-gray-50"
                  }`}
              >
                Anterior
              </button>

              <span className="text-sm text-gray-600">
                Página <strong>{currentPage}</strong> de{" "}
                <strong>{totalPages}</strong>
              </span>

              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(prev + 1, totalPages)
                  )
                }
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg border text-sm font-medium
                  ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white hover:bg-gray-50"
                  }`}
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}

      {/* ================= MODAL ================= */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative">
            {/* CERRAR */}
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <X size={24} />
            </button>

            <h3 className="text-2xl font-bold mb-4">
              Detalles de la orden #{selectedOrder._id.slice(-6)}
            </h3>

            <p className="text-gray-600 mb-2">
              Estado: <strong>{selectedOrder.status}</strong>
            </p>

            <p className="text-gray-600 mb-4">
              Fecha:{" "}
              {new Date(selectedOrder.createdAt).toLocaleString("es-ES")}
            </p>

            <h4 className="text-lg font-semibold mb-3">Productos</h4>

            <ul className="divide-y divide-gray-200 mb-6">
              {selectedOrder.products.map((item) => (
                <li
                  key={item._id}
                  className="py-4 flex items-start justify-between gap-4"
                >
                  {/* INFO PRODUCTO */}
                  <div className="flex-1">
                    <p className="text-base font-semibold text-gray-900">
                      {item.product?.name ||
                        item.productName ||
                        "Producto no disponible"}
                    </p>

                    <div className="mt-1 text-sm text-gray-600 space-y-1">
                      <p>Cantidad: {item.quantity}</p>
                      <p>
                        Precio unitario: $
                        {item.price.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* SUBTOTAL */}
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Subtotal</p>
                    <p className="text-lg font-bold text-gray-900">
                      $
                      {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t pt-4 flex justify-between items-center">
              <span className="text-lg font-semibold">Total pagado</span>
              <span className="text-2xl font-bold text-blue-600">
                ${selectedOrder.total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}
      {/* =============== FIN MODAL =============== */}
    </div>
  );
}
