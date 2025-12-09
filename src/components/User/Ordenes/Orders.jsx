import React, { useEffect, useState } from "react";
import api from "../../../api/axios";
import { Eye } from "lucide-react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold mb-6">Mis órdenes</h2>

      {/* Loading */}
      {loading && <p className="text-gray-500">Cargando órdenes...</p>}

      {/* Sin órdenes */}
      {!loading && orders.length === 0 && (
        <p className="text-gray-500">Aún no tienes órdenes.</p>
      )}

      {/* Lista de órdenes (una debajo de otra) */}
      {!loading && orders.length > 0 && (
        <div className="flex flex-col gap-6">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}

function OrderCard({ order }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Orden #{order._id.slice(-6)}
          </h3>

          <p className="text-gray-600 mt-1">
            Estado:
            <span
              className={`ml-2 font-bold ${
                order.status === "pending"
                  ? "text-orange-600"
                  : "text-green-600"
              }`}
            >
              {order.status}
            </span>
          </p>

          <p className="mt-3 text-blue-600 font-bold text-xl">
            Total: ${order.total}
          </p>
        </div>

        {/* Botón Ver */}
        <button className="text-blue-600 hover:text-blue-700 p-2">
          <Eye size={28} />
        </button>
      </div>
    </div>
  );
}
