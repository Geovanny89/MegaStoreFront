import React, { useEffect, useState } from "react";
import api from "../../../api/axios";
import {
  X, Package, Truck, CheckCircle2, Clock,
  ChevronRight, Receipt, Info, UploadCloud, Calendar, Store
} from "lucide-react";
import ReviewForm from "../../User/Calificaciones/ReviewForm";
import UserMessages from "../../User/messages/UserMessages.jsx";

/* ================= ESTILOS POR ESTADO ================= */
const STATUS_THEME = {
  pending: { 
    label: "Pendiente", 
    color: "text-amber-700 dark:text-amber-400", 
    bg: "bg-amber-50 dark:bg-amber-950/40", 
    border: "border-amber-200 dark:border-amber-900/50", 
    accent: "border-l-amber-500", 
    icon: <Clock size={18} className="animate-pulse" /> 
  },
  processing: { 
    label: "En preparación", 
    color: "text-blue-700 dark:text-blue-400", 
    bg: "bg-blue-50 dark:bg-blue-950/40", 
    border: "border-blue-200 dark:border-blue-900/50", 
    accent: "border-l-blue-500", 
    icon: <Package size={18} /> 
  },
  shipped: { 
    label: "En camino / Listo", 
    color: "text-indigo-700 dark:text-indigo-400", 
    bg: "bg-indigo-50 dark:bg-indigo-950/40", 
    border: "border-indigo-200 dark:border-indigo-900/50", 
    accent: "border-l-indigo-500", 
    icon: <Truck size={18} /> 
  },
  delivered: { 
    label: "Entregado", 
    color: "text-emerald-700 dark:text-emerald-400", 
    bg: "bg-emerald-50 dark:bg-emerald-950/40", 
    border: "border-emerald-200 dark:border-emerald-900/50", 
    accent: "border-l-emerald-500", 
    icon: <CheckCircle2 size={18} /> 
  },
  cancelled: { 
    label: "Cancelado", 
    color: "text-rose-700 dark:text-rose-400", 
    bg: "bg-rose-50 dark:bg-rose-950/40", 
    border: "border-rose-200 dark:border-rose-900/50", 
    accent: "border-l-rose-500", 
    icon: <X size={18} /> 
  }
};
const PAYMENT_LABELS = {
  pending: "Esperando pago",
  sent: "Pago enviado",
  confirmed: "Pago aprobado",
  rejected: "Pago rechazado",
  cash_on_delivery: "Efectivo al recibir"
};

const formatOrderDate = (dateString) => {
  if (!dateString) return { date: "S/F", time: "" };
  const dateObj = new Date(dateString);
  const date = dateObj.toLocaleDateString("es-CO", { day: '2-digit', month: 'short', year: 'numeric' });
  const time = dateObj.toLocaleTimeString("es-CO", { hour: '2-digit', minute: '2-digit', hour12: true });
  return { date, time };
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 6;
  const [proofFile, setProofFile] = useState(null);
  const [uploadingProof, setUploadingProof] = useState(false);
  //***Reportar vendedor */
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [sendingReport, setSendingReport] = useState(false);


  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      if (!token) return;
      const res = await api.get("/order/my-orders", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data || []);
      if (selectedOrder) {
        const updated = res.data.find(o => o._id === selectedOrder._id);
        if (updated) setSelectedOrder(updated);
      }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, []);

  const confirmReceived = async (orderId) => {
    if (!window.confirm("¿Confirmas que has recibido el pedido satisfactoriamente?")) return;
    try {
      await api.put(`/orders/${orderId}/received`, {}, { headers: { Authorization: `Bearer ${token}` } });
      alert("¡Pedido finalizado con éxito!");
      fetchOrders();
    } catch (error) { alert("Error al confirmar entrega."); }
  };

  const uploadPaymentProof = async (orderId) => {
    if (!proofFile) return alert("Selecciona una imagen.");
    try {
      setUploadingProof(true);
      const formData = new FormData();
      formData.append("image", proofFile);
      await api.put(`/buyer/orders/${orderId}/payment-proof`, formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` }
      });
      alert("¡Comprobante enviado!");
      setProofFile(null);
      fetchOrders();
    } catch (error) { alert("Error al subir el archivo."); } finally { setUploadingProof(false); }
  };
  //** funcion reportar vendedor */
  const submitReport = async () => {
    if (!reportReason) {
      alert("Selecciona un motivo");
      return;
    }

    try {
      setSendingReport(true);
      await api.post(
        `/report/seller/${selectedOrder.products[0].seller}`,
        {
          reason: reportReason,
          description: reportDescription,
          orderId: selectedOrder._id
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Reporte enviado correctamente");
      setShowReportModal(false);
      setReportReason("");
      setReportDescription("");
    } catch (error) {
      alert(error.response?.data?.message || "Error al enviar reporte");
    } finally {
      setSendingReport(false);
    }
  };


  const indexOfLastOrder = currentPage * ordersPerPage;
  const currentOrders = orders.slice(indexOfLastOrder - ordersPerPage, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  return (
    <div className="min-h-screen bg-[#FBFDFF] dark:bg-slate-900 py-10 px-4 md:px-6 font-sans text-slate-900 dark:text-slate-100">

      <div className="max-w-4xl mx-auto">

        {/* CABECERA */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
          <div className="text-left">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Mis Compras</h2>
            <p className="text-slate-500 text-sm font-medium dark:text-slate-400">Historial de pedidos y seguimiento</p>
          </div>
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-2xl shadow-sm">
            <Package size={18} className="text-blue-600" />
            <span className="font-bold text-sm text-slate-900 dark:text-white">{orders.length} pedidos</span>
          </div>
        </div>

        {/* LISTADO DE ORDENES */}
        {loading ? (
          <div className="flex flex-col items-center py-20 gap-4">
            <div className="w-8 h-8 border-4 border-slate-200 dark:border-slate-700 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-slate-600 dark:text-slate-300 font-bold">Cargando pedidos...</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {currentOrders.map(order => {
              const theme = STATUS_THEME[order.status] || STATUS_THEME.pending;
              const { date, time } = formatOrderDate(order.createdAt);

              return (
                <div
                  key={order._id}
                  className={`bg-white dark:bg-slate-800 rounded-[24px] border border-slate-100 dark:border-slate-700 border-l-4 ${theme.accent} p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-center gap-6`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${theme.bg} ${theme.color}`}>
                    {theme.icon}
                  </div>

                  <div className="flex-1 w-full grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Orden</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">#{order._id.slice(-6).toUpperCase()}</p>
                    </div>

                    <div className="flex flex-col items-start">
                      <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Realizado</p>
                      <div className="bg-slate-50 dark:bg-slate-700 border border-slate-100 dark:border-slate-600 px-2 py-1 rounded-lg flex items-center gap-2">
                        <Calendar size={12} className="text-blue-500" />
                        <div>
                          <p className="text-[10px] font-black text-slate-700 dark:text-slate-200 leading-none">{date}</p>
                          <p className="text-[9px] font-bold text-slate-400 dark:text-slate-400 leading-none mt-0.5">{time}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Total</p>
                      <p className="text-sm font-black text-slate-900 dark:text-white">${order.total?.toLocaleString('es-CO')}</p>
                    </div>

                    <div className="text-right md:text-left">
                      <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Pago</p>
                      <span className={`text-[9px] font-bold px-2 py-1 rounded-md uppercase inline-block ${order.paymentMethod === 'cash_on_delivery' ? 'bg-green-100 text-green-700 dark:bg-green-700/20 dark:text-green-200' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}>
                        {PAYMENT_LABELS[order.paymentStatus]}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="w-full md:w-auto bg-slate-900 dark:bg-blue-700 text-white px-6 py-3 rounded-xl text-xs font-black hover:bg-blue-600 dark:hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                  >
                    DETALLES <ChevronRight size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* PAGINACIÓN */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center mt-10 gap-4">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="p-2 rounded-xl border bg-white dark:bg-slate-800 dark:border-slate-700 disabled:opacity-20"><ChevronRight className="rotate-180" /></button>
            <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Página {currentPage} de {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className="p-2 rounded-xl border bg-white dark:bg-slate-800 dark:border-slate-700 disabled:opacity-20"><ChevronRight /></button>
          </div>
        )}

      </div>


      {/* ================= MODAL DE DETALLES ================= */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">

            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-900 z-10 transition-colors">
              <div className="flex items-center gap-3">
                {/* Contenedor Icono Calendario */}
                <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-2xl text-blue-600 dark:text-blue-400">
                  <Calendar size={22} />
                </div>

                <div>
                  <h3 className="text-xl font-black leading-none text-slate-900 dark:text-white">
                    Detalles del Pedido
                  </h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">
                      ID: {selectedOrder._id}
                    </span>
                    <span className="text-[10px] bg-blue-600 dark:bg-blue-500 text-white px-2 py-0.5 rounded-full font-black w-fit">
                      {formatOrderDate(selectedOrder.createdAt).date} • {formatOrderDate(selectedOrder.createdAt).time}
                    </span>
                  </div>
                </div>
              </div>

              {/* Botón Cerrar */}
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 dark:text-slate-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 md:space-y-8 bg-white dark:bg-slate-950 transition-colors duration-300">

              {/* ESTADO ACTUAL */}
              <div className={`p-4 rounded-2xl border transition-colors ${STATUS_THEME[selectedOrder.status]?.bg} ${STATUS_THEME[selectedOrder.status]?.border} dark:bg-opacity-20 flex items-center gap-4`}>

                {/* Contenedor del Icono */}
                <div className={`p-3 rounded-xl shadow-sm bg-white dark:bg-slate-800 ${STATUS_THEME[selectedOrder.status]?.color}`}>
                  {STATUS_THEME[selectedOrder.status]?.icon}
                </div>

                {/* Textos Informativos */}
              <div className="flex flex-col justify-center gap-0.5">
  <p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-500 dark:text-white/50 leading-tight">
    Estado del pedido
  </p>
  <p className={`font-black text-sm md:text-base leading-none ${STATUS_THEME[selectedOrder.status]?.color} dark:brightness-150`}>
    {STATUS_THEME[selectedOrder.status]?.label}
  </p>
</div>
              </div>

              {/* BOTÓN DE CHAT ACTUALIZADO CON LÓGICA DE TIENDA */}
              <button
                onClick={() => setShowChatModal(true)}
                className={`w-full rounded-[2rem] p-5 flex items-center justify-between shadow-xl transition-all group ${selectedOrder.status === 'delivered'
                    ? "bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 cursor-not-allowed"
                    : "bg-slate-900 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-500 cursor-pointer"
                  }`}
              >
                <div className="flex items-center gap-4">
                  {/* Contenedor del Icono */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${selectedOrder.status === 'delivered'
                      ? "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500"
                      : "bg-white/10 dark:bg-white/20 text-white"
                    }`}>
                    <Info size={20} />
                  </div>

                  {/* Textos Informativos */}
                  <div className="text-left">
                    <h4 className={`font-black text-sm uppercase ${selectedOrder.status === 'delivered'
                        ? "text-slate-400 dark:text-slate-500"
                        : "text-white"
                      }`}>
                      Chat con el Vendedor
                    </h4>
                    <p className={`text-[9px] font-bold uppercase tracking-widest italic ${selectedOrder.status === 'delivered'
                        ? "text-slate-400 dark:text-slate-500"
                        : "text-white/50 dark:text-blue-100/60"
                      }`}>
                      {selectedOrder.status === 'delivered'
                        ? "Chat finalizado"
                        : (selectedOrder.paymentMethod === 'cash_on_delivery' || selectedOrder.paymentStatus === 'confirmed')
                          ? "Disponible ahora • Coordinar entrega"
                          : "Se activará al validar el pago"}
                    </p>
                  </div>
                </div>

                <ChevronRight size={18} className={
                  selectedOrder.status === 'delivered'
                    ? "text-slate-300 dark:text-slate-600"
                    : "text-white group-hover:translate-x-1 transition-transform"
                } />
              </button>

              {/* PRODUCTOS */}
              <section>
                <div className="flex items-center gap-2 mb-4 font-black text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500 px-2">
                  <Receipt size={14} /> <h4>Resumen de Productos</h4>
                </div>

                <div className="space-y-3">
                  {selectedOrder.products.map(item => (
                    <div key={item._id} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-sm text-slate-800 dark:text-slate-100">{item.productName}</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Cantidad: {item.quantity}</p>
                        </div>
                        <p className="font-black text-sm text-slate-900 dark:text-white">${(item.price * item.quantity).toLocaleString('es-CO')}</p>
                      </div>

                      {/* Formulario de Reseña */}
                      {selectedOrder.status === "delivered" && !item.reviewed && (
                        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                          <ReviewForm orderId={selectedOrder._id} productId={item.product?._id} sellerId={item.seller} onSuccess={fetchOrders} />
                        </div>
                      )}

                      {/* Sección de Reporte de Problemas */}
                      {selectedOrder.status === "delivered" && (
                        <div className="mt-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-900/30 rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                          <div className="text-center sm:text-left">
                            <p className="text-[11px] font-black uppercase text-rose-700 dark:text-rose-400">
                              ¿Tuviste un problema?
                            </p>
                            <p className="text-[10px] text-rose-600 dark:text-rose-500 font-medium">
                              Reporta solo si hubo un inconveniente real con este pedido.
                            </p>
                          </div>

                          <button
                            onClick={() => setShowReportModal(true)}
                            className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-600 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-rose-200 dark:shadow-none transition-all active:scale-95"
                          >
                            Reportar
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* COMPROBANTE DE PAGO (Solo si no es efectivo) */}
              {selectedOrder.paymentStatus === "pending" && selectedOrder.paymentMethod !== "cash_on_delivery" && (
                <section className="bg-blue-50 dark:bg-blue-900/10 border-2 border-dashed border-blue-200 dark:border-blue-900/30 rounded-[24px] p-5 md:p-6 text-center space-y-4 transition-colors">
                  <p className="text-blue-600 dark:text-blue-400 font-black text-xs uppercase tracking-widest">
                    Subir Comprobante
                  </p>

                  <label className="w-full cursor-pointer bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 p-4 rounded-xl flex flex-col items-center gap-2 hover:bg-blue-100/50 dark:hover:bg-blue-900/20 transition-all shadow-sm group">
                    <UploadCloud className="text-blue-500 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 truncate max-w-full">
                      {proofFile ? proofFile.name : "Seleccionar Imagen del Pago"}
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => setProofFile(e.target.files[0])}
                    />
                  </label>

                  <button
                    onClick={() => uploadPaymentProof(selectedOrder._id)}
                    disabled={uploadingProof || !proofFile}
                    className="w-full bg-blue-600 dark:bg-blue-500 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-50 disabled:bg-slate-300 dark:disabled:bg-slate-800 shadow-lg shadow-blue-200 dark:shadow-none transition-all active:scale-[0.98]"
                  >
                    {uploadingProof ? "Subiendo..." : "Enviar Pago"}
                  </button>
                </section>
              )}

              {/* INFO RECOGER EN TIENDA */}
              {selectedOrder.paymentMethod === 'cash_on_delivery' && selectedOrder.status !== 'delivered' && (
                <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 p-4 rounded-2xl flex items-center gap-4 transition-colors">
                  {/* Contenedor del Icono */}
                  <div className="bg-white dark:bg-slate-800 p-2 rounded-xl text-emerald-600 dark:text-emerald-400 shadow-sm transition-colors">
                    <Store size={20} />
                  </div>

                  {/* Mensaje Informativo */}
                  <div>
                    <p className="text-[11px] font-black text-emerald-800 dark:text-emerald-400 uppercase leading-none mb-1">
                      Pago en Tienda
                    </p>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-500/90 font-bold uppercase">
                      Usa el chat para avisar al vendedor que vas en camino.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* TOTAL Y CONFIRMACIÓN */}
            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 space-y-4 transition-colors">
              <div className="flex justify-between items-center px-2">
                <span className="text-slate-500 dark:text-white/70 font-black uppercase text-[10px] tracking-[0.1em]">
                  Pago Total
                </span>
                <span className="text-2xl font-black text-slate-900 dark:text-white transition-colors">
                  ${selectedOrder.total?.toLocaleString('es-CO')}
                </span>
              </div>

              {selectedOrder.status === "shipped" && (
                <button
                  onClick={() => confirmReceived(selectedOrder._id)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white py-4 rounded-2xl font-black text-sm shadow-lg shadow-emerald-100 dark:shadow-emerald-900/20 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <CheckCircle2 size={18} /> CONFIRMAR RECEPCIÓN
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL DE CHAT ================= */}
      {showChatModal && selectedOrder && (
        <div className="fixed inset-0 bg-slate-950/40 dark:bg-black/60 backdrop-blur-md flex items-center justify-center z-[60] p-4 animate-in fade-in zoom-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-[40px] w-full max-w-lg h-[80vh] flex flex-col shadow-2xl overflow-hidden border border-white/20 dark:border-slate-800 transition-colors">

            {/* HEADER DEL CHAT */}
            <div className="p-6 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg ${selectedOrder.status === 'delivered' ? "bg-emerald-500" : "bg-blue-600"}`}>
                  <Info size={20} />
                </div>
                <div>
                  <h3 className="font-black text-slate-800 dark:text-white text-sm uppercase">Mensajería</h3>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Orden #{selectedOrder._id.slice(-6).toUpperCase()}</p>
                </div>
              </div>
              <button
                onClick={() => setShowChatModal(false)}
                className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-500 dark:text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* CUERPO DEL CHAT */}
            <div className="flex-1 overflow-hidden bg-white dark:bg-slate-900"> {/* Un tono menos oscuro aquí */}
              {selectedOrder.status === "delivered" ? (
                /* ESTADO: FINALIZADO */
                <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-slate-50 dark:bg-slate-900">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/20 rounded-3xl flex items-center justify-center mb-4 text-emerald-600 dark:text-emerald-400 shadow-sm">
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 className="font-black text-slate-800 dark:text-white uppercase text-sm mb-2 tracking-tight">
                    Chat Finalizado
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-200 font-bold leading-relaxed"> {/* dark:text-slate-200 para que se lea sí o sí */}
                    Este pedido ya fue entregado y la conversación se ha cerrado satisfactoriamente.
                  </p>
                </div>
              ) : (selectedOrder.paymentMethod === "cash_on_delivery" || selectedOrder.paymentStatus === "confirmed") ? (
                /* CHAT ACTIVO */
                <div className="h-full bg-white dark:bg-slate-950"> {/* El chat sí puede ser más oscuro para resaltar las burbujas */}
                  <UserMessages orderId={selectedOrder._id} />
                </div>
              ) : (
                /* ESTADO: ESPERANDO PAGO */
                <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-slate-50 dark:bg-slate-900">
                  <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-3xl shadow-sm flex items-center justify-center mb-4 text-slate-300 dark:text-blue-400"> {/* Icono en azul para que brille */}
                    <Clock size={32} />
                  </div>
                  <h4 className="font-black text-slate-800 dark:text-white uppercase text-sm mb-2 tracking-tight">
                    Validando Pago
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-200 font-bold leading-relaxed">
                    Sube tu comprobante de pago para habilitar el chat con el vendedor.
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>


      )}
      {showReportModal && (
        <div className="fixed inset-0 bg-slate-950/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-[80] p-4 transition-all">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl border border-transparent dark:border-slate-800 transition-colors">

            {/* TÍTULO */}
            <h3 className="font-black text-sm uppercase text-slate-800 dark:text-white">
              Reportar Vendedor
            </h3>

            {/* SELECTOR - Fondo oscuro y borde visible */}
            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-rose-500 transition-colors"
            >
              <option value="" className="dark:bg-slate-800">Selecciona un motivo</option>
              <option value="producto_no_entregado" className="dark:bg-slate-800">Producto no entregado</option>
              <option value="producto_falso" className="dark:bg-slate-800">Producto falso</option>
              <option value="cobro_fraude" className="dark:bg-slate-800">Cobro fraudulento</option>
              <option value="comunicacion_falsa" className="dark:bg-slate-800">Comunicación falsa</option>
              <option value="otro" className="dark:bg-slate-800">Otro</option>
            </select>

            {/* TEXTAREA - Contraste alto */}
            <textarea
              rows={3}
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              className="w-full border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-rose-500 transition-colors"
              placeholder="Describe brevemente el problema (opcional)"
            />

            {/* ADVERTENCIA - Texto brillante */}
            <p className="text-[10px] text-slate-400 dark:text-rose-400/80 font-bold uppercase tracking-tight">
              ⚠️ Los reportes falsos pueden causar sanciones.
            </p>

            {/* ACCIONES */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 text-sm font-black text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors uppercase tracking-widest"
              >
                Cancelar
              </button>
              <button
                onClick={submitReport}
                disabled={sendingReport}
                className="px-6 py-2 bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-600 text-white rounded-xl text-sm font-black uppercase tracking-widest disabled:opacity-50 shadow-lg shadow-rose-200 dark:shadow-none transition-all active:scale-95"
              >
                {sendingReport ? "Enviando..." : "Enviar reporte"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}