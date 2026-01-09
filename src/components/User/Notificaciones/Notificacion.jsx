import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../api/axios";
import { Bell, ChevronLeft, ChevronRight, Circle } from "lucide-react";

/* ===================== ESTILOS DINÁMICOS ===================== */
const statusStyles = {
  pending: "bg-amber-50 border-amber-100 text-amber-800 dark:bg-amber-900/20 dark:border-amber-800/50 dark:text-amber-400",
  paid: "bg-emerald-50 border-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:border-emerald-800/50 dark:text-emerald-400",
  processing: "bg-blue-50 border-blue-100 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800/50 dark:text-blue-400",
  shipped: "bg-indigo-50 border-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:border-indigo-800/50 dark:text-indigo-400",
  delivered: "bg-emerald-50 border-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:border-emerald-800/50 dark:text-emerald-400",
  cancelled: "bg-rose-50 border-rose-100 text-rose-800 dark:bg-rose-900/20 dark:border-rose-800/50 dark:text-rose-400",
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
  const { slug } = useParams();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const notificationsPerPage = 5;

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get("/notifications/user");
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

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      window.dispatchEvent(new Event("notificationsUpdated"));
    } catch (error) {
      console.error("Error marcando notificación como leída:", error);
    }
  };

  const indexOfLast = currentPage * notificationsPerPage;
  const indexOfFirst = indexOfLast - notificationsPerPage;
  const currentNotifications = notifications.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(notifications.length / notificationsPerPage);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Cargando notificaciones</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto min-h-screen transition-colors duration-300">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-600 dark:text-slate-300">
          <Bell size={24} />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
            {slug ? "Notificaciones de tienda" : "Notificaciones"}
          </h2>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            {notifications.length} mensajes en total
          </p>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-[32px] border border-dashed border-slate-200 dark:border-slate-800">
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            No tienes notificaciones {slug && "para esta tienda"}.
          </p>
        </div>
      ) : (
        <>
          <ul className="space-y-4">
            {currentNotifications.map((notif) => (
              <li
                key={notif._id}
                onClick={() => !notif.isRead && markAsRead(notif._id)}
                className={`
                  relative p-5 rounded-[24px] border transition-all duration-300 group
                  ${statusStyles[notif.status] || "bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800"}
                  ${!notif.isRead 
                    ? "ring-2 ring-blue-500/20 shadow-lg shadow-blue-500/5 translate-x-1" 
                    : "opacity-70 hover:opacity-100"}
                `}
              >
                {!notif.isRead && (
                  <Circle className="absolute -left-1.5 top-1/2 -translate-y-1/2 text-blue-500 fill-blue-500" size={10} />
                )}
                
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <p className="font-black text-[10px] uppercase tracking-[0.15em] mb-1 opacity-80">
                      {statusLabels[notif.status] || "Notificación"}
                    </p>
                    <p className="text-sm font-bold leading-snug">
                      {notif.message}
                    </p>
                  </div>

                  {!notif.isRead && (
                    <span className="shrink-0 text-[9px] font-black bg-blue-600 text-white px-2.5 py-1 rounded-full uppercase tracking-tighter">
                      Nueva
                    </span>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-current/10 flex justify-between items-center">
                  <small className="text-[10px] font-bold opacity-60 uppercase tracking-wide">
                    {new Date(notif.createdAt).toLocaleDateString()} • {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </small>
                  {notif.isRead && <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Leída</span>}
                </div>
              </li>
            ))}
          </ul>

          {/* PAGINACIÓN ESTILIZADA */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-12 gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl disabled:opacity-20 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <ChevronLeft size={20} className="dark:text-white" />
              </button>

              <div className="px-6 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <span className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                  {currentPage} / {totalPages}
                </span>
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl disabled:opacity-20 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <ChevronRight size={20} className="dark:text-white" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Notificacion;