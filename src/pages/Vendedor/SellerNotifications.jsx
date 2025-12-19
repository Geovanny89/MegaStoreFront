import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { 
  Bell, 
  ChevronRight, 
  CheckCircle, 
  Package, 
  MessageSquare,
  Info
} from "lucide-react";

// Colores VIBRANTES en formato COMPACTO
const NOTIFICATION_THEMES = {
  order: {
    bg: "bg-emerald-100", 
    border: "border-emerald-300",
    accent: "bg-emerald-600",
    iconColor: "text-emerald-700",
    textColor: "text-slate-900",
    label: "Orden"
  },
  question: {
    bg: "bg-amber-100", 
    border: "border-amber-300",
    accent: "bg-amber-600",
    iconColor: "text-amber-700",
    textColor: "text-slate-900",
    label: "Pregunta"
  },
  default: {
    bg: "bg-indigo-100",
    border: "border-indigo-300",
    accent: "bg-indigo-600",
    iconColor: "text-indigo-700",
    textColor: "text-slate-900",
    label: "Aviso"
  },
  read: {
    bg: "bg-slate-100", 
    border: "border-slate-200",
    accent: "bg-slate-400",
    iconColor: "text-slate-400",
    textColor: "text-slate-500",
    label: "Leída"
  }
};

export default function SellerNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchNotifications = async () => {
    if (notifications.length === 0) setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/seller/notificacion", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data.notifications || res.data || [];
      setNotifications(data);
    } catch (error) {
      console.error("Error:", error);
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
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateValue) => {
    if (!dateValue) return "";
    const date = new Date(dateValue);
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
    });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNotifications = notifications.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(notifications.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        
        {/* HEADER LIMPIO */}
        <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg shadow-md shadow-blue-200">
               <Bell className="text-white" size={18} />
            </div>
            <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">Notificaciones</h2>
          </div>
          <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[10px] font-black border border-slate-200">
            {notifications.filter(n => !n.isRead).length} NUEVAS
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-6 h-6 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {currentNotifications.map((n) => {
              const theme = n.isRead ? NOTIFICATION_THEMES.read : (NOTIFICATION_THEMES[n.type] || NOTIFICATION_THEMES.default);

              return (
                <div
                  key={n._id}
                  className={`relative border-2 rounded-xl transition-all duration-200 ${theme.bg} ${theme.border} shadow-sm overflow-hidden`}
                >
                  {/* Barra lateral de color */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${theme.accent}`} />

                  <div className="py-3 px-4 flex items-center gap-4">
                    {/* Icono Reducido */}
                    <div className={`p-2 rounded-lg bg-white/80 shadow-sm ${theme.iconColor} shrink-0`}>
                      {n.type === "order" ? <Package size={18} /> : n.type === "question" ? <MessageSquare size={18} /> : <Info size={18} />}
                    </div>

                    {/* Texto con Alto Contraste */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${theme.accent} text-white`}>
                          {theme.label}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 italic">
                          {formatDate(n.createdAt)}
                        </span>
                      </div>
                      <p className={`text-sm leading-tight font-bold ${theme.textColor} line-clamp-2`}>
                        {n.message}
                      </p>
                    </div>

                    {/* Botón Acción */}
                    <div className="shrink-0 ml-2">
                      {!n.isRead ? (
                        <button
                          onClick={() => markAsRead(n._id)}
                          className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase hover:bg-blue-700 transition-colors shadow-md active:scale-95"
                        >
                          Listo
                        </button>
                      ) : (
                        <CheckCircle className="text-slate-400" size={20} />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* PAGINACIÓN COMPACTA */}
            {notifications.length > itemsPerPage && (
              <div className="flex justify-between items-center mt-8 px-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => { setCurrentPage(p => p - 1); window.scrollTo(0,0); }}
                  className="p-2 bg-white border-2 border-slate-200 rounded-xl text-slate-800 disabled:opacity-30 hover:bg-slate-50 transition-all shadow-sm"
                >
                  <ChevronRight size={16} className="rotate-180" />
                </button>
                
                <span className="font-black text-slate-800 text-[11px] bg-white px-4 py-1.5 rounded-full border-2 border-slate-200 shadow-sm">
                  {currentPage} / {totalPages}
                </span>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => { setCurrentPage(p => p + 1); window.scrollTo(0,0); }}
                  className="p-2 bg-white border-2 border-slate-200 rounded-xl text-slate-800 disabled:opacity-30 hover:bg-slate-50 transition-all shadow-sm"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}