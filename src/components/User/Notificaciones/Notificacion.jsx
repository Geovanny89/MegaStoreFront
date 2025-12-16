import React, { useEffect, useState } from "react";
import api from "../../../api/axios";

const statusStyles = {
  pending: "bg-yellow-100 border-yellow-400 text-yellow-800",
  paid: "bg-green-100 border-green-400 text-green-800",
  processing: "bg-orange-100 border-orange-400 text-orange-800",
  shipped: "bg-blue-100 border-blue-400 text-blue-800",
  delivered: "bg-green-100 border-green-400 text-green-800",
  cancelled: "bg-red-100 border-red-400 text-red-800",
};

const statusLabels = {
  pending: "Pedido pendiente",
  paid: "Pago confirmado",
  processing: "En preparación",
  shipped: "Pedido enviado",
  delivered: "Pedido entregado",
  cancelled: "Pedido cancelado",
};

const Notificacion = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/user/notifications");
      setNotifications(res.data);
    } catch (error) {
      console.error("Error al obtener notificaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.put(`/user/notifications/${id}/read`);

      // Actualizamos el estado local
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, isRead: true } : n
        )
      );

      // 🔔 avisamos al navbar para actualizar el badge
      window.dispatchEvent(new Event("notificationsUpdated"));
    } catch (error) {
      console.error("Error marcando notificación como leída:", error);
    }
  };

  if (loading) {
    return <p className="p-4">Cargando notificaciones...</p>;
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-5">
        Notificaciones
      </h2>

      {notifications.length === 0 ? (
        <p className="text-gray-500">No tienes notificaciones.</p>
      ) : (
        <ul className="space-y-3">
          {notifications.map((notif) => (
            <li
              key={notif._id}
              onClick={() => !notif.isRead && markAsRead(notif._id)}
              className={`
                p-4 rounded-xl border cursor-pointer transition
                ${
                  statusStyles[notif.status] || "bg-gray-100 border-gray-300"
                }
                ${
                  !notif.isRead
                    ? "ring-2 ring-indigo-400"
                    : "opacity-80"
                }
              `}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">
                    {statusLabels[notif.status] || "Notificación"}
                  </p>
                  <p className="text-sm mt-1">
                    {notif.message}
                  </p>
                </div>

                {!notif.isRead && (
                  <span className="text-xs font-bold bg-indigo-600 text-white px-2 py-1 rounded-full">
                    Nuevo
                  </span>
                )}
              </div>

              <small className="block mt-2 text-xs opacity-70">
                {new Date(notif.createdAt).toLocaleString()}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notificacion;
