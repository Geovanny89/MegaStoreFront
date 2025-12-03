import React, { useEffect, useState } from "react";
import api from "../../../api/axios";
import { Eye } from "lucide-react";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/order/my-orders", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (error) {
      console.error(error);
      setOrders([]);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold mb-6">Mis órdenes</h2>

      {orders.length === 0 ? (
        <p className="text-gray-500">Aún no tienes órdenes.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
          {orders.map(order => (
            <div
              key={order._id}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 p-5 flex flex-col justify-between"
            >
              
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

              {/* SOLO BOTÓN VER */}
              <div className="flex justify-center items-center mt-5 pt-4 border-t">
                <button className="text-blue-600 hover:text-blue-700">
                  <Eye />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
