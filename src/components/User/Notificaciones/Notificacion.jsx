import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../api/axios";

/* ===================== ESTILOS ===================== */
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

/* ===================== COMPONENTE ===================== */
const Notificacion = () => {
  const { slug } = useParams(); // si existe => vista por tienda

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  /* --- PAGINACIÓN --- */
  const [currentPage, setCurrentPage] = useState(1);
  const notificationsPerPage = 5;

  /* ===================== FETCH ===================== */
const fetchNotifications = async () => {
  try {
    setLoading(true);

    const res = await api.get("/notifications/user");
    console.log("notificaciones usuario", res.data);

    setNotifications(Array.isArray(res.data) ? res.data : []);
    setCurrentPage(1);

  } catch (error) {
    console.error("Error al obtener notificaciones:", error);
    setNotifications([]);
  } finally {
    setLoading(false);
  }
};



  useEffect(() => {
    fetchNotifications();
  }, [slug]);

  /* ===================== MARCAR COMO LEÍDA ===================== */
  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);

      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, isRead: true } : n
        )
      );

      window.dispatchEvent(new Event("notificationsUpdated"));
    } catch (error) {
      console.error("Error marcando notificación como leída:", error);
    }
  };

  /* ===================== PAGINACIÓN ===================== */
  const indexOfLast = currentPage * notificationsPerPage;
  const indexOfFirst = indexOfLast - notificationsPerPage;
  const currentNotifications = notifications.slice(
    indexOfFirst,
    indexOfLast
  );
  const totalPages = Math.ceil(notifications.length / notificationsPerPage);

  if (loading) {
    return <p className="p-4">Cargando notificaciones...</p>;
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-5">
        {slug ? "Notificaciones de la tienda" : "Notificaciones"}
      </h2>

      {notifications.length === 0 ? (
        <p className="text-gray-500">
          No tienes notificaciones {slug && "para esta tienda"}.
        </p>
      ) : (
        <>
          <ul className="space-y-3">
            {currentNotifications.map((notif) => (
              <li
                key={notif._id}
                onClick={() => !notif.isRead && markAsRead(notif._id)}
                className={`
                  p-4 rounded-xl border cursor-pointer transition
                  ${statusStyles[notif.status] || "bg-gray-100 border-gray-300"}
                  ${!notif.isRead ? "ring-2 ring-indigo-400" : "opacity-80"}
                `}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">
                      {statusLabels[notif.status] || "Notificación"}
                    </p>
                    <p className="text-sm mt-1">{notif.message}</p>
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

          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 gap-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-4 py-2 bg-white border rounded-lg text-sm font-semibold disabled:opacity-30"
              >
                Anterior
              </button>

              <span className="text-sm font-medium text-gray-600">
                Página {currentPage} de {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-4 py-2 bg-white border rounded-lg text-sm font-semibold disabled:opacity-30"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Notificacion;
