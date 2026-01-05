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
  pending: { label: "Pendiente", color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200", accent: "border-l-amber-500", icon: <Clock size={18} className="animate-pulse" /> },
  processing: { label: "En preparación", color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200", accent: "border-l-blue-500", icon: <Package size={18} /> },
  shipped: { label: "En camino / Listo", color: "text-indigo-700", bg: "bg-indigo-50", border: "border-indigo-200", accent: "border-l-indigo-500", icon: <Truck size={18} /> },
  delivered: { label: "Entregado", color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", accent: "border-l-emerald-500", icon: <CheckCircle2 size={18} /> },
  cancelled: { label: "Cancelado", color: "text-rose-700", bg: "bg-rose-50", border: "border-rose-200", accent: "border-l-rose-500", icon: <X size={18} /> }
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
    <div className="min-h-screen bg-[#FBFDFF] py-10 px-4 font-sans text-slate-900">
      <div className="max-w-4xl mx-auto">
        
        {/* CABECERA */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-black tracking-tight">Mis Compras</h2>
            <p className="text-slate-500 text-sm font-medium">Historial de pedidos y seguimiento</p>
          </div>
          <div className="bg-white border border-slate-200 px-4 py-2 rounded-2xl shadow-sm flex items-center gap-2">
            <Package size={18} className="text-blue-600" />
            <span className="font-bold text-sm">{orders.length} pedidos</span>
          </div>
        </div>

        {/* LISTADO DE ORDENES */}
        {loading ? (
          <div className="flex flex-col items-center py-20 gap-4">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid gap-4">
            {currentOrders.map(order => {
              const theme = STATUS_THEME[order.status] || STATUS_THEME.pending;
              const { date, time } = formatOrderDate(order.createdAt);

              return (
                <div key={order._id} className={`bg-white rounded-[24px] border border-slate-100 border-l-4 ${theme.accent} p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-center gap-6`}>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${theme.bg} ${theme.color}`}>
                    {theme.icon}
                  </div>
                  
                  <div className="flex-1 w-full grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Orden</p>
                      <p className="text-sm font-bold">#{order._id.slice(-6).toUpperCase()}</p>
                    </div>

                    <div className="flex flex-col items-start">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Realizado</p>
                      <div className="bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg flex items-center gap-2">
                        <Calendar size={12} className="text-blue-500" />
                        <div>
                          <p className="text-[10px] font-black text-slate-700 leading-none">{date}</p>
                          <p className="text-[9px] font-bold text-slate-400 leading-none mt-0.5">{time}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</p>
                      <p className="text-sm font-black text-slate-900">${order.total?.toLocaleString('es-CO')}</p>
                    </div>

                    <div className="text-right md:text-left">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pago</p>
                      <span className={`text-[9px] font-bold px-2 py-1 rounded-md uppercase inline-block ${order.paymentMethod === 'cash_on_delivery' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                        {PAYMENT_LABELS[order.paymentStatus]}
                      </span>
                    </div>
                  </div>

                  <button onClick={() => setSelectedOrder(order)} className="w-full md:w-auto bg-slate-900 text-white px-6 py-3 rounded-xl text-xs font-black hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
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
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="p-2 rounded-xl border bg-white disabled:opacity-20"><ChevronRight className="rotate-180"/></button>
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Página {currentPage} de {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className="p-2 rounded-xl border bg-white disabled:opacity-20"><ChevronRight/></button>
          </div>
        )}
      </div>

      {/* ================= MODAL DE DETALLES ================= */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
                  <Calendar size={22} />
                </div>
                <div>
                  <h3 className="text-xl font-black leading-none">Detalles del Pedido</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">ID: {selectedOrder._id}</span>
                    <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-black">
                      {formatOrderDate(selectedOrder.createdAt).date} • {formatOrderDate(selectedOrder.createdAt).time}
                    </span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              
              {/* ESTADO ACTUAL */}
              <div className={`p-4 rounded-2xl border ${STATUS_THEME[selectedOrder.status]?.bg} ${STATUS_THEME[selectedOrder.status]?.border} flex items-center gap-4`}>
                <div className={`p-3 rounded-xl bg-white shadow-sm ${STATUS_THEME[selectedOrder.status]?.color}`}>
                  {STATUS_THEME[selectedOrder.status]?.icon}
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Estado del pedido</p>
                  <p className={`font-black ${STATUS_THEME[selectedOrder.status]?.color}`}>{STATUS_THEME[selectedOrder.status]?.label}</p>
                </div>
              </div>

              {/* BOTÓN DE CHAT ACTUALIZADO CON LÓGICA DE TIENDA */}
              <button 
                onClick={() => setShowChatModal(true)}
                className={`w-full rounded-[2rem] p-5 flex items-center justify-between shadow-xl transition-all group ${
                    selectedOrder.status === 'delivered' ? "bg-slate-100 border border-slate-200" : "bg-slate-900 hover:bg-blue-600 cursor-pointer"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedOrder.status === 'delivered' ? "bg-slate-200 text-slate-400" : "bg-white/10 text-white"}`}>
                    <Info size={20} />
                  </div>
                  <div className="text-left">
                    <h4 className={`font-black text-sm uppercase ${selectedOrder.status === 'delivered' ? "text-slate-400" : "text-white"}`}>Chat con el Vendedor</h4>
                    <p className={`text-[9px] font-bold uppercase tracking-widest italic ${selectedOrder.status === 'delivered' ? "text-slate-400" : "text-white/50"}`}>
                      {selectedOrder.status === 'delivered' 
                        ? "Chat finalizado" 
                        : (selectedOrder.paymentMethod === 'cash_on_delivery' || selectedOrder.paymentStatus === 'confirmed')
                          ? "Disponible ahora • Coordinar entrega" 
                          : "Se activará al validar el pago"}
                    </p>
                  </div>
                </div>
                <ChevronRight size={18} className={selectedOrder.status === 'delivered' ? "text-slate-300" : "text-white"} />
              </button>

              {/* PRODUCTOS */}
              <section>
                <div className="flex items-center gap-2 mb-4 font-black text-xs uppercase tracking-widest text-slate-400 px-2">
                  <Receipt size={14}/> <h4>Resumen de Productos</h4>
                </div>
                <div className="space-y-3">
                  {selectedOrder.products.map(item => (
                    <div key={item._id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-sm text-slate-800">{item.productName}</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase">Cantidad: {item.quantity}</p>
                        </div>
                        <p className="font-black text-sm text-slate-900">${(item.price * item.quantity).toLocaleString('es-CO')}</p>
                      </div>
                      {selectedOrder.status === "delivered" && !item.reviewed && (
                        <div className="mt-4 pt-4 border-t border-slate-200">
                           <ReviewForm orderId={selectedOrder._id} productId={item.product?._id} sellerId={item.seller} onSuccess={fetchOrders} />
                        </div>
                      )}
                      {selectedOrder.status === "delivered" && (
  <section className="bg-rose-50 border border-rose-200 rounded-2xl p-5 flex items-center justify-between">
    <div>
      <p className="text-[11px] font-black uppercase text-rose-700">
        ¿Tuviste un problema?
      </p>
      <p className="text-[10px] text-rose-600 font-medium">
        Reporta solo si hubo un inconveniente real con este pedido.
      </p>
    </div>

    <button
      onClick={() => setShowReportModal(true)}
      className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow"
    >
      Reportar
    </button>
  </section>
)}

                    </div>
                  ))}
                </div>
              </section>

              {/* COMPROBANTE DE PAGO (Solo si no es efectivo) */}
              {selectedOrder.paymentStatus === "pending" && selectedOrder.paymentMethod !== "cash_on_delivery" && (
                <section className="bg-blue-50 border-2 border-dashed border-blue-200 rounded-[24px] p-6 text-center space-y-4">
                  <p className="text-blue-600 font-black text-xs uppercase tracking-widest">Subir Comprobante</p>
                  <label className="w-full cursor-pointer bg-white border border-blue-200 p-4 rounded-xl flex flex-col items-center gap-2 hover:bg-blue-100/50 transition-colors shadow-sm">
                    <UploadCloud className="text-blue-500" />
                    <span className="text-[10px] font-bold text-slate-600 truncate max-w-full">
                        {proofFile ? proofFile.name : "Seleccionar Imagen del Pago"}
                    </span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => setProofFile(e.target.files[0])} />
                  </label>
                  <button onClick={() => uploadPaymentProof(selectedOrder._id)} disabled={uploadingProof || !proofFile} className="w-full bg-blue-600 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-50 shadow-lg">
                    {uploadingProof ? "Subiendo..." : "Enviar Pago"}
                  </button>
                </section>
              )}

              {/* INFO RECOGER EN TIENDA */}
              {selectedOrder.paymentMethod === 'cash_on_delivery' && selectedOrder.status !== 'delivered' && (
                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-4">
                    <div className="bg-white p-2 rounded-xl text-emerald-600 shadow-sm"><Store size={20}/></div>
                    <div>
                        <p className="text-[11px] font-black text-emerald-800 uppercase leading-none mb-1">Pago en Tienda</p>
                        <p className="text-[10px] text-emerald-600 font-bold uppercase">Usa el chat para avisar al vendedor que vas en camino.</p>
                    </div>
                </div>
              )}
            </div>

            {/* TOTAL Y CONFIRMACIÓN */}
            <div className="p-6 border-t bg-slate-50 space-y-4">
              <div className="flex justify-between items-center px-2">
                <span className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Pago Total</span>
                <span className="text-2xl font-black text-slate-900">${selectedOrder.total?.toLocaleString('es-CO')}</span>
              </div>
              {selectedOrder.status === "shipped" && (
                <button onClick={() => confirmReceived(selectedOrder._id)} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-black text-sm shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95">
                  <CheckCircle2 size={18} /> CONFIRMAR RECEPCIÓN
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL DE CHAT ================= */}
      {showChatModal && selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-[60] p-4 animate-in zoom-in duration-200">
          <div className="bg-white rounded-[40px] w-full max-w-lg h-[80vh] flex flex-col shadow-2xl overflow-hidden border border-white/20">
            <div className="p-6 bg-white border-b flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg ${selectedOrder.status === 'delivered' ? "bg-emerald-500" : "bg-blue-600"}`}>
                  <Info size={20} />
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-sm uppercase">Mensajería</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Orden #{selectedOrder._id.slice(-6).toUpperCase()}</p>
                </div>
              </div>
              <button onClick={() => setShowChatModal(false)} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-hidden">
              {selectedOrder.status === "delivered" ? (
                <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-slate-50">
                  <div className="w-16 h-16 bg-emerald-100 rounded-3xl flex items-center justify-center mb-4 text-emerald-600 shadow-sm"><CheckCircle2 size={32} /></div>
                  <h4 className="font-black text-slate-800 uppercase text-sm mb-2">Chat Finalizado</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Este pedido ya fue entregado y la conversación se ha cerrado satisfactoriamente.</p>
                </div>
              ) : (selectedOrder.paymentMethod === "cash_on_delivery" || selectedOrder.paymentStatus === "confirmed") ? (
                /* CHAT ACTIVO SI ES PAGO EN TIENDA O PAGO YA CONFIRMADO */
                <UserMessages orderId={selectedOrder._id} />
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-slate-50">
                  <div className="w-16 h-16 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-4 text-slate-300"><Clock size={32} /></div>
                  <h4 className="font-black text-slate-800 uppercase text-sm mb-2">Validando Pago</h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">Sube tu comprobante de pago para habilitar el chat con el vendedor.</p>
                </div>
              )}
            </div>
          </div>
          
        </div>
        
        
      )}
      {showReportModal && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[80] p-4">
    <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
      
      <h3 className="font-black text-sm uppercase text-slate-800">
        Reportar Vendedor
      </h3>

      <select
        value={reportReason}
        onChange={(e) => setReportReason(e.target.value)}
        className="w-full border rounded-xl p-3 text-sm"
      >
        <option value="">Selecciona un motivo</option>
        <option value="producto_no_entregado">Producto no entregado</option>
        <option value="producto_falso">Producto falso</option>
        <option value="cobro_fraude">Cobro fraudulento</option>
        <option value="comunicacion_falsa">Comunicación falsa</option>
        <option value="otro">Otro</option>
      </select>

      <textarea
        rows={3}
        value={reportDescription}
        onChange={(e) => setReportDescription(e.target.value)}
        className="w-full border rounded-xl p-3 text-sm"
        placeholder="Describe brevemente el problema (opcional)"
      />

      <p className="text-[10px] text-slate-400 font-medium">
        ⚠️ Los reportes falsos pueden causar sanciones.
      </p>

      <div className="flex justify-end gap-3 pt-2">
        <button
          onClick={() => setShowReportModal(false)}
          className="px-4 py-2 text-sm font-bold text-slate-500"
        >
          Cancelar
        </button>
        <button
          onClick={submitReport}
          disabled={sendingReport}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-black disabled:opacity-50"
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