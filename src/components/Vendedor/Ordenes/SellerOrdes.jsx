import React, { useEffect, useState } from "react";
import api from "../../../api/axios";
import {
  CheckCircle, XCircle, Truck, ExternalLink, User, Package, CreditCard,
  Search, Clock, AlertCircle, ChevronLeft, ChevronRight, MessageCircle,
  X, CheckCircle2, Calendar, Store, Ban
} from "lucide-react";
import SellerMessages from "../messages/SellerMessages";

/* ================= MAPA DE ESTADOS ================= */
const ORDER_STATUS_LABELS = {
  pending_payment: "Esperando Pago",
  payment_uploaded: "Pago por Verificar",
  processing: "En preparación",
  shipped: "Listo / Enviado",
  delivered: "Entregada",
  cancelled: "Cancelada"
};

const PAYMENT_STATUS_LABELS = {
  pending: "Pendiente",
  uploaded: "Comprobante Recibido",
  confirmed: "Pago Confirmado",
  rejected: "Pago Rechazado"
};

const PAYMENT_METHOD_LABELS = {
  cash_on_delivery: "Pago en Tienda",
  nequi: "Nequi",
  daviplata: "Daviplata",
  bank_transfer: "Transferencia"
};

const formatOrderDate = (dateString) => {
  if (!dateString) return { date: "S/F", time: "" };
  const dateObj = new Date(dateString);
  const date = dateObj.toLocaleDateString("es-CO", { day: '2-digit', month: 'short', year: 'numeric' });
  const time = dateObj.toLocaleTimeString("es-CO", { hour: '2-digit', minute: '2-digit', hour12: true });
  return { date, time };
};

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedProof, setSelectedProof] = useState(null);
  const [selectedOrderChat, setSelectedOrderChat] = useState(null);
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/seller/orders");
      setOrders(res.data || []);
    } catch (err) {
      console.error("Error al cargar órdenes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  /* === LÓGICA DE ACCIÓN ACTUALIZADA === */
  const handleAction = async (orderId, endpoint, confirmMsg, body = {}) => {
    if (!window.confirm(confirmMsg)) return;
    try {
      setUpdatingId(orderId);
      await api.put(`/seller/orders/${orderId}/${endpoint}`, body);
      await fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || "Error al procesar la acción");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusStyle = (status) => {
    const styles = {
      pending_payment: "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900 dark:text-amber-400 dark:border-amber-700",
      payment_uploaded: "bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-900 dark:text-purple-400 dark:border-purple-700",
      processing: "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900 dark:text-blue-400 dark:border-blue-700",
      shipped: "bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-900 dark:text-indigo-400 dark:border-indigo-700",
      delivered: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900 dark:text-emerald-400 dark:border-emerald-700",
      cancelled: "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-900 dark:text-rose-400 dark:border-rose-700"
    };
    return styles[status] || "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200";
  };


  const filteredOrders = orders.filter(o =>
    o._id.toLowerCase().includes(filter.toLowerCase()) ||
    o.user?.name?.toLowerCase().includes(filter.toLowerCase())
  );

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const currentOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 py-10 px-4">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight italic uppercase">
              Panel de Ventas
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Gestiona tus pedidos y mantén contacto con tus clientes
            </p>

          </div>
          <div className="relative w-full md:w-80">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Buscar por ID o cliente..."
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-2xl shadow-sm outline-none transition-all font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
              onChange={(e) => { setFilter(e.target.value); setCurrentPage(1); }}
            />
          </div>

        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-slate-200 dark:border-slate-700 border-t-blue-600 rounded-full animate-spin mb-4" />
            <p className="font-bold uppercase tracking-widest text-xs text-slate-400 dark:text-slate-500">
              Cargando Pedidos...
            </p>
          </div>

        ) : (
          <>
            <div className="grid gap-6">
              {currentOrders.map((order) => {
                const { date, time } = formatOrderDate(order.createdAt);
                return (
                  <div key={order._id} className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-3xl shadow-sm overflow-hidden hover:shadow-md transition-all">
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row justify-between gap-8">

                        {/* INFO IZQUIERDA */}
                        <div className="flex-1 space-y-4">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="text-xs font-black text-blue-600 bg-blue-50 dark:bg-blue-900 dark:text-blue-400 px-3 py-1.5 rounded-xl border border-blue-100 dark:border-blue-700">
                              ID: #{order._id.slice(-8).toUpperCase()}
                            </span>
                            <div className="bg-slate-50 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 px-3 py-1 rounded-xl flex items-center gap-2">
                              <Calendar size={14} className="text-blue-500" />
                              <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-700 dark:text-slate-200 leading-none">{date}</span>
                                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-400 leading-none mt-0.5">{time}</span>
                              </div>
                            </div>
                            <span className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-full border ${getStatusStyle(order.status)}`}>
                              {ORDER_STATUS_LABELS[order.status]}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-slate-100 dark:bg-gray-700 rounded-lg text-slate-500 dark:text-slate-300"><User size={20} /></div>
                              <div>
                                <p className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-400">Cliente</p>
                                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{order.user?.name || "Usuario Desconocido"}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-lg ${order.paymentMethod === 'cash_on_delivery' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-800 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-gray-700 dark:text-slate-300'}`}>
                                {order.paymentMethod === 'cash_on_delivery' ? <Store size={20} /> : <CreditCard size={20} />}
                              </div>
                              <div>
                                <p className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-400">Método de Pago</p>
                                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{PAYMENT_METHOD_LABELS[order.paymentMethod] || order.paymentMethod}</p>
                                <p className={`text-[11px] font-bold ${order.paymentStatus === 'confirmed' ? 'text-emerald-600 dark:text-emerald-400' : order.paymentStatus === 'rejected' ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'}`}>
                                  {PAYMENT_STATUS_LABELS[order.paymentStatus]}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-slate-50 dark:bg-gray-700 p-4 rounded-2xl border border-slate-100 dark:border-gray-600">
                            {order.products.map((p, idx) => (
                              <div key={idx} className="flex justify-between text-sm py-1 border-b border-slate-100 last:border-0">
                                <span className="font-bold text-slate-700 dark:text-slate-200">{p.productName} <span className="text-slate-400 dark:text-slate-400">x{p.quantity}</span></span>
                                <span className="font-black text-blue-600 dark:text-blue-400">${(p.price * p.quantity).toLocaleString()}</span>
                              </div>
                            ))}
                            <div className="pt-2 flex justify-between items-center">
                              <span className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">Total Venta:</span>
                              <span className="text-xl font-black text-slate-900 dark:text-slate-100">${order.total?.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        {/* COMPROBANTE CENTRO */}
                        <div className="lg:w-32 flex flex-col items-center justify-center gap-2">
                          <p className="text-[9px] font-black text-slate-400 dark:text-slate-400 uppercase">Comprobante</p>
                          {order.paymentProof?.fileUrl ? (
                            <div onClick={() => setSelectedProof(order.paymentProof.fileUrl)} className="relative group cursor-pointer rounded-2xl overflow-hidden border-4 border-white shadow-xl aspect-square w-28 bg-slate-100">
                              <img src={order.paymentProof.fileUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="Proof" />
                              <div className="absolute inset-0 bg-blue-600/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <ExternalLink className="text-white" size={20} />
                              </div>
                            </div>
                          ) : (
                            <div className="w-28 h-28 rounded-2xl border-2 border-dashed border-slate-200 dark:border-gray-600 flex flex-col items-center justify-center text-slate-300 dark:text-slate-400 text-center p-2">
                              <Clock size={20} />
                              <span className="text-[8px] font-bold uppercase mt-1">Pendiente</span>
                            </div>
                          )}
                        </div>

                        {/* ACCIONES DERECHA (LÓGICA MEJORADA) */}
                        <div className="lg:w-60 flex flex-col justify-center gap-3 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-gray-600 pt-6 lg:pt-0 lg:pl-8">

                          <button
                            onClick={() => setSelectedOrderChat(order)}
                            className={`w-full flex items-center justify-center gap-2 border-2 py-3 rounded-2xl text-xs font-black transition-all shadow-sm ${order.status === 'delivered'
                              ? "bg-slate-50 dark:bg-gray-700 border-slate-200 dark:border-gray-600 text-slate-400 dark:text-slate-500 cursor-default"
                              : "bg-white dark:bg-gray-800 border-blue-100 dark:border-blue-700 text-slate-700 dark:text-slate-100 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900"
                              }`}
                          >
                            <MessageCircle size={18} className={order.status === 'delivered' ? "text-slate-300 dark:text-slate-400" : "text-blue-500"} />
                            {order.status === 'delivered' ? "CHAT CERRADO" : "CHAT CON CLIENTE"}
                          </button>

                          {/* LÓGICA DE BOTONES BASADA EN TU PRIMER COMPONENTE */}
                          {(order.status === "pending_payment" || order.status === "payment_uploaded") && (
                            <div className="flex flex-col gap-2">
                              <button
                                onClick={() => handleAction(order._id, 'confirm-payment', '¿Confirmar recepción del pago?')}
                                disabled={updatingId === order._id}
                                className="w-full bg-emerald-600 dark:bg-emerald-700 text-white py-3 rounded-2xl text-[10px] font-black hover:bg-emerald-700 dark:hover:bg-emerald-800 transition-all shadow-md disabled:opacity-50"
                              >
                                <CheckCircle size={16} className="inline mr-2" />
                                CONFIRMAR PAGO
                              </button>

                              <button
                                onClick={() => {
                                  const reason = prompt("Indique el motivo del rechazo (ej: Comprobante falso):");
                                  if (!reason) return;
                                  handleAction(order._id, 'reject-payment', '⚠️ ¿Rechazar este pago por fraude?', { reason });
                                }}
                                disabled={updatingId === order._id}
                                className="w-full bg-white dark:bg-gray-800 border-2 border-rose-100 dark:border-rose-700 text-rose-600 dark:text-rose-400 py-3 rounded-2xl text-[10px] font-black hover:bg-rose-50 dark:hover:bg-rose-900 transition-all"
                              >
                                <Ban size={16} className="inline mr-2" />
                                RECHAZAR PAGO
                              </button>
                            </div>
                          )}

                          {order.status === "processing" && (
                            <button
                              onClick={() => handleAction(order._id, 'shipped', order.paymentMethod === 'cash_on_delivery' ? '¿Marcar pedido como listo?' : '¿Marcar pedido como enviado?')}
                              disabled={updatingId === order._id}
                              className="w-full bg-indigo-600 dark:bg-indigo-700 text-white py-4 rounded-2xl text-xs font-black hover:bg-indigo-700 dark:hover:bg-indigo-800 transition-all shadow-lg"
                            >
                              <Truck size={18} className="inline mr-2" />
                              {order.paymentMethod === 'cash_on_delivery' ? "MARCAR LISTO" : "MARCAR ENVIADO"}
                            </button>
                          )}

                          {order.paymentStatus === "rejected" && (
                            <div className="bg-rose-50 dark:bg-rose-900 border border-rose-100 dark:border-rose-700 p-3 rounded-2xl text-center">
                              <p className="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase">Pago Rechazado</p>
                              <p className="text-[9px] text-rose-400 dark:text-rose-500 font-bold">Posible fraude detectado</p>
                            </div>
                          )}

                          {order.status === "shipped" && (
                            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900 border border-blue-100 dark:border-blue-700 rounded-2xl">
                              <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase">En Tránsito / Listo</p>
                            </div>
                          )}


                          {order.status === "delivered" && (
                            <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-900 border border-emerald-100 dark:border-emerald-700 rounded-2xl">
                              <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase">Venta Finalizada</p>
                            </div>
                          )}

                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* PAGINACIÓN */}
            {totalPages > 1 && (
  <div className="flex items-center justify-center gap-2 mt-10">
    <button
      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
      disabled={currentPage === 1}
      className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 disabled:opacity-30"
    >
      <ChevronLeft size={20} className="text-slate-900 dark:text-slate-100" />
    </button>
    <span className="text-xs font-bold px-4 text-slate-900 dark:text-slate-100">
      Página {currentPage} de {totalPages}
    </span>
    <button
      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
      disabled={currentPage === totalPages}
      className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 disabled:opacity-30"
    >
      <ChevronRight size={20} className="text-slate-900 dark:text-slate-100" />
    </button>
  </div>
)}

          </>
        )}

        {/* MODALES (CHAT E IMAGEN) - SE MANTIENEN IGUAL QUE TU SEGUNDO COMPONENTE */}
        {selectedOrderChat && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedOrderChat(null)}></div>
            <div className="relative bg-white dark:bg-gray-800 w-full max-w-lg h-[600px] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
              <div className="p-4 border-b flex justify-between items-center bg-white dark:bg-gray-700 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-md ${
    selectedOrderChat.status === 'delivered'
      ? 'bg-emerald-500 dark:bg-emerald-700'
      : 'bg-blue-600 dark:bg-blue-800'
  }`}
>
                    {selectedOrderChat.user?.name?.charAt(0) || "U"}
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-slate-800 dark:text-slate-100 uppercase leading-none">{selectedOrderChat.user?.name}</h3>
                    <p className="text-[10px] text-slate-400 dark:text-slate-400 font-bold uppercase mt-1">Orden #{selectedOrderChat._id.slice(-8).toUpperCase()}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedOrderChat(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-full text-slate-400 dark:text-slate-300"><X size={24} /></button>
              </div>
              <div className="flex-1 overflow-hidden">
                {selectedOrderChat.status === "delivered" ? (
                  <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-slate-50 dark:bg-gray-700">
                    <CheckCircle2 size={32} className="text-emerald-500 mb-4" />
                    <h4 className="font-black text-slate-800 dark:text-slate-100 uppercase text-sm">Canal Cerrado</h4>
                  </div>
                ) : (selectedOrderChat.paymentMethod === "cash_on_delivery" || selectedOrderChat.paymentStatus === "confirmed") ? (
                  <SellerMessages orderId={selectedOrderChat._id} />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-slate-50 dark:bg-gray-700">
                    <Clock size={32} className="text-amber-400 mb-4" />
                    <h4 className="font-black text-slate-800 dark:text-slate-100 uppercase text-sm">Pago Pendiente</h4>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {selectedProof && (
  <div
    className="fixed inset-0 z-[150] flex items-center justify-center p-4 cursor-zoom-out bg-black/90"
    onClick={() => setSelectedProof(null)}
  >
    <img
      src={selectedProof}
      className="max-h-full max-w-full rounded-lg shadow-2xl"
      alt="Full Proof"
    />
  </div>
)}


      </div>
    </div>
  );
}