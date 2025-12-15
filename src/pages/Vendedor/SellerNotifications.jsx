import React, { useEffect, useState } from "react";
import api from "../../api/axios";

export default function SellerNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/seller/notificacion", {
        headers: { Authorization: `Bearer ${token}` },
      });
     
      setNotifications(res.data.notifications);
    } catch (error) {
      console.error("Error al obtener notificaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await api.patch(`/seller/notificacion/${id}/read`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("Error al marcar notificación como leída:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // refresca cada 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Notificaciones</h2>

      {loading && <p>Cargando...</p>}
      {!loading && notifications.length === 0 && <p>No hay notificaciones.</p>}

      <ul>
        {notifications.map((n) => (
          <li
            key={n._id}
            className={`border p-3 mb-2 rounded-lg ${
              n.isRead ? "bg-gray-100" : "bg-yellow-100"
            }`}
          >
            <p className="font-semibold">{n.message}</p>
            {n.order && (
              <p className="text-sm text-gray-600 mt-1">
                Orden: {n.order._id} - Total: ${n.order.total} - Estado: {n.order.status} - Entrega: {n.order.deliveryMethod}
              </p>
            )}
            {!n.isRead && (
              <button
                onClick={() => markAsRead(n._id)}
                className="mt-2 text-sm text-blue-600 hover:underline"
              >
                Marcar como leída
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
