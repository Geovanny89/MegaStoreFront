import React, { useEffect, useState } from "react";
import api from "../../../api/axios";
import { 
  CheckCircle, XCircle, Truck, ExternalLink, User, Package, CreditCard,
  Search, Clock, AlertCircle, ChevronLeft, ChevronRight, MessageCircle,
  X, CheckCircle2, Calendar, Store
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

/* ================= FUNCIÓN PARA FECHA ================= */
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

  const handleAction = async (orderId, endpoint, confirmMsg) => {
    if (!window.confirm(confirmMsg)) return;
    try {
      setUpdatingId(orderId);
      await api.put(`/seller/orders/${orderId}/${endpoint}`);
      await fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || "Error al procesar la acción");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusStyle = (status) => {
    const styles = {
      pending_payment: "bg-amber-50 text-amber-600 border-amber-100",
      payment_uploaded: "bg-purple-50 text-purple-600 border-purple-100",
      processing: "bg-blue-50 text-blue-600 border-blue-100",
      shipped: "bg-indigo-50 text-indigo-600 border-indigo-100",
      delivered: "bg-emerald-50 text-emerald-600 border-emerald-100",
      cancelled: "bg-rose-50 text-rose-600 border-rose-100"
    };
    return styles[status] || "bg-slate-100 text-slate-700";
  };

  const filteredOrders = orders.filter(o => 
    o._id.toLowerCase().includes(filter.toLowerCase()) || 
    o.user?.name?.toLowerCase().includes(filter.toLowerCase())
  );

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Panel de Ventas</h2>
            <p className="text-slate-500 font-medium">Gestiona tus pedidos y mantén contacto con tus clientes</p>
          </div>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por ID o cliente..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
              onChange={(e) => { setFilter(e.target.value); setCurrentPage(1); }}
            />
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4" />
            <p className="font-bold uppercase tracking-widest text-xs text-slate-400">Cargando Pedidos...</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6">
              {currentOrders.map((order) => {
                const { date, time } = formatOrderDate(order.createdAt);
                return (
                  <div key={order._id} className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden hover:shadow-md transition-all">
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row justify-between gap-8">
                        
                        {/* INFO IZQUIERDA */}
                        <div className="flex-1 space-y-4">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100">
                              ID: #{order._id.slice(-8).toUpperCase()}
                            </span>
                            
                            {/* BADGE DE FECHA ESTILIZADO */}
                            <div className="bg-slate-50 border border-slate-200 px-3 py-1 rounded-xl flex items-center gap-2">
                              <Calendar size={14} className="text-blue-500" />
                              <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-700 leading-none">{date}</span>
                                <span className="text-[9px] font-bold text-slate-400 leading-none mt-0.5">{time}</span>
                              </div>
                            </div>

                            <span className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-full border ${getStatusStyle(order.status)}`}>
                              {ORDER_STATUS_LABELS[order.status]}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-slate-100 rounded-lg text-slate-500"><User size={20} /></div>
                              <div>
                                <p className="text-[10px] uppercase font-black text-slate-400">Cliente</p>
                                <p className="text-sm font-bold text-slate-800">{order.user?.name || "Usuario Desconocido"}</p>
                                <p className="text-xs text-slate-500">{order.user?.email}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-lg ${order.paymentMethod === 'cash_on_delivery' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                                {order.paymentMethod === 'cash_on_delivery' ? <Store size={20} /> : <CreditCard size={20} />}
                              </div>
                              <div>
                                <p className="text-[10px] uppercase font-black text-slate-400">Método de Pago</p>
                                <p className="text-sm font-bold text-slate-800">{PAYMENT_METHOD_LABELS[order.paymentMethod] || order.paymentMethod}</p>
                                <p className={`text-[11px] font-bold ${order.paymentStatus === 'confirmed' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                  {PAYMENT_STATUS_LABELS[order.paymentStatus]}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            {order.products.map((p, idx) => (
                              <div key={idx} className="flex justify-between text-sm py-1 border-b border-slate-100 last:border-0">
                                <span className="font-bold text-slate-700">{p.productName} <span className="text-slate-400">x{p.quantity}</span></span>
                                <span className="font-black text-blue-600">${(p.price * p.quantity).toLocaleString()}</span>
                              </div>
                            ))}
                            <div className="pt-2 flex justify-between items-center">
                               <span className="text-xs font-black uppercase text-slate-500">Total Venta:</span>
                               <span className="text-xl font-black text-slate-900">${order.total?.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        {/* COMPROBANTE CENTRO */}
                        <div className="lg:w-32 flex flex-col items-center justify-center gap-2">
                          <p className="text-[9px] font-black text-slate-400 uppercase">Comprobante</p>
                          {order.paymentProof?.fileUrl ? (
                            <div 
                              onClick={() => setSelectedProof(order.paymentProof.fileUrl)}
                              className="relative group cursor-pointer rounded-2xl overflow-hidden border-4 border-white shadow-xl aspect-square w-28 bg-slate-100"
                            >
                              <img src={order.paymentProof.fileUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="Proof" />
                              <div className="absolute inset-0 bg-blue-600/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <ExternalLink className="text-white" size={20} />
                              </div>
                            </div>
                          ) : (
                            <div className="w-28 h-28 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300 text-center p-2">
                               {order.paymentMethod === 'cash_on_delivery' ? (
                                 <>
                                   <Store size={24} className="text-emerald-400" />
                                   <span className="text-[8px] font-black text-emerald-500 uppercase mt-2">Paga en Tienda</span>
                                 </>
                               ) : (
                                 <>
                                   <Clock size={20} />
                                   <span className="text-[8px] font-bold uppercase mt-1">Pendiente</span>
                                 </>
                               )}
                            </div>
                          )}
                        </div>

                        {/* ACCIONES DERECHA */}
                        <div className="lg:w-60 flex flex-col justify-center gap-3 border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-8">
                          
                          {/* BOTÓN CHAT - LÓGICA DE ACTIVACIÓN POR PAGO O TIENDA */}
                          <button
                            onClick={() => setSelectedOrderChat(order)}
                            className={`w-full flex items-center justify-center gap-2 border-2 py-3 rounded-2xl text-xs font-black transition-all active:scale-95 shadow-sm ${
                              order.status === 'delivered' 
                                ? "bg-slate-50 border-slate-200 text-slate-400 cursor-default" 
                                : "bg-white border-blue-100 text-slate-700 hover:border-blue-500 hover:bg-blue-50"
                            }`}
                          >
                            <MessageCircle size={18} className={order.status === 'delivered' ? "text-slate-300" : "text-blue-500"} /> 
                            {order.status === 'delivered' ? "CHAT CERRADO" : "CHAT CON CLIENTE"}
                          </button>

                          {/* ACCIONES DE ESTADO */}
                          {(order.status === "pending_payment" || order.status === "payment_uploaded") && (
                            <button
                              onClick={() => handleAction(order._id, 'confirm-payment', '¿Confirmas la recepción del pago?')}
                              disabled={updatingId === order._id}
                              className="w-full bg-slate-900 text-white py-4 rounded-2xl text-xs font-black hover:bg-emerald-600 transition-all shadow-lg disabled:opacity-50"
                            >
                              CONFIRMAR PAGO
                            </button>
                          )}

                          {order.status === "processing" && (
                            <button
                              onClick={() => handleAction(order._id, 'shipped', order.paymentMethod === 'cash_on_delivery' ? '¿Marcar pedido como listo para recoger?' : '¿Marcar pedido como enviado?')}
                              disabled={updatingId === order._id}
                              className="w-full bg-indigo-600 text-white py-4 rounded-2xl text-xs font-black hover:bg-indigo-700 transition-all shadow-lg"
                            >
                              <Truck size={18} className="inline mr-2" /> 
                              {order.paymentMethod === 'cash_on_delivery' ? "MARCAR LISTO" : "MARCAR ENVIADO"}
                            </button>
                          )}

                          {order.status === "shipped" && (
                              <div className="text-center p-3 bg-blue-50 border border-blue-100 rounded-2xl">
                                <p className="text-[10px] font-black text-blue-600 uppercase">
                                  {order.paymentMethod === 'cash_on_delivery' ? "Esperando al Cliente" : "En Tránsito"}
                                </p>
                              </div>
                          )}

                          {order.status === "delivered" && (
                              <div className="text-center p-3 bg-emerald-50 border border-emerald-100 rounded-2xl">
                                <p className="text-[10px] font-black text-emerald-600 uppercase">Venta Finalizada</p>
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
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-3 bg-white rounded-xl border border-slate-200 disabled:opacity-30"><ChevronLeft size={20}/></button>
                <span className="text-xs font-bold px-4">Página {currentPage} de {totalPages}</span>
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-3 bg-white rounded-xl border border-slate-200 disabled:opacity-30"><ChevronRight size={20}/></button>
              </div>
            )}
          </>
        )}

        {/* MODAL DE CHAT - LÓGICA DE APERTURA PARA PAGO EN TIENDA */}
        {selectedOrderChat && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedOrderChat(null)}></div>
            <div className="relative bg-white w-full max-w-lg h-[600px] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
              <div className="p-4 border-b flex justify-between items-center bg-white">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-md ${selectedOrderChat.status === 'delivered' ? 'bg-emerald-500' : 'bg-blue-600'}`}>
                    {selectedOrderChat.user?.name?.charAt(0) || "U"}
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-slate-800 uppercase leading-none">{selectedOrderChat.user?.name}</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Orden #{selectedOrderChat._id.slice(-8).toUpperCase()}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedOrderChat(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={24} /></button>
              </div>
              
              <div className="flex-1 overflow-hidden">
                {selectedOrderChat.status === "delivered" ? (
                  <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-slate-50">
                    <CheckCircle2 size={32} className="text-emerald-500 mb-4" />
                    <h4 className="font-black text-slate-800 uppercase text-sm mb-2">Canal Cerrado</h4>
                    <p className="text-[11px] text-slate-500 font-medium">Este pedido ya fue completado.</p>
                  </div>
                ) : (selectedOrderChat.paymentMethod === "cash_on_delivery" || selectedOrderChat.paymentStatus === "confirmed") ? (
                  /* EL CHAT SE ABRE SI ES PAGO EN TIENDA O PAGO CONFIRMADO */
                  <SellerMessages orderId={selectedOrderChat._id} />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-slate-50">
                    <Clock size={32} className="text-amber-400 mb-4" />
                    <h4 className="font-black text-slate-800 uppercase text-sm mb-2">Pago Pendiente</h4>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                      El cliente debe subir el comprobante de pago para activar el chat (a menos que sea Pago en Tienda).
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* MODAL IMAGEN COMPROBANTE */}
        {selectedProof && (
          <div className="fixed inset-0 bg-black/90 z-[150] flex items-center justify-center p-4 cursor-zoom-out" onClick={() => setSelectedProof(null)}>
            <img src={selectedProof} className="max-h-full max-w-full rounded-lg shadow-2xl" alt="Full Proof" />
          </div>
        )}

      </div>
    </div>
  );
}