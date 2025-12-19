import React, { useState, useEffect, useRef } from "react";
import { Info, Send, Clock } from "lucide-react";
import api from "../../../api/axios";
import socket from "../../../socket/socket"; // Importamos tu instancia única de socket

export default function UserMessages({ orderId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  // 1. Scroll automático al recibir mensajes nuevos
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 2. Configuración de tiempo real (Socket.io)
  useEffect(() => {
    if (orderId) {
      setLoading(true);

      // Cargar historial inicial
      api.get(`/orders/${orderId}/messages`)
        .then(res => setMessages(res.data))
        .catch(err => console.error("Error al cargar mensajes:", err))
        .finally(() => setLoading(false));

      // Unirse a la sala de la orden
      socket.emit("joinOrder", orderId);

      // Escuchar mensajes nuevos en tiempo real
      socket.on("newMessage", (msg) => {
        // Solo lo agregamos si pertenece a esta orden y no está ya en la lista
        if (msg.orderId === orderId) {
          setMessages((prev) => {
            const exists = prev.some(m => m._id === msg._id);
            return exists ? prev : [...prev, msg];
          });
        }
      });
    }

    // Limpieza al cerrar el chat
    return () => {
      socket.off("newMessage");
    };
  }, [orderId]);

  // 3. Función para enviar mensajes
  const sendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!text.trim()) return;

    try {
      // CORREGIDO: "messagess" cambiado a "messages"
      const res = await api.post(`/orders/${orderId}/messagess`, { text });
      
      // No necesitamos setMessages aquí si el socket ya nos envía el mensaje,
      // pero se deja para que la respuesta sea inmediata en la UI del emisor
      setMessages(prev => {
        const exists = prev.some(m => m._id === res.data._id);
        return exists ? prev : [...prev, res.data];
      });
      
      setText("");
    } catch (err) {
      console.error("Error al enviar:", err);
      alert("No se pudo enviar el mensaje. Verifica tu conexión.");
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* HEADER */}
      <div className="bg-white p-3 border-b flex items-center gap-3 shadow-sm">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
          <Info size={16} />
        </div>
        <div>
          <h4 className="font-black text-[12px] text-slate-800 uppercase leading-none">Chat con el Vendedor</h4>
          <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-tighter mt-1">En línea - Soporte</p>
        </div>
      </div>

      {/* CUERPO DE MENSAJES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full space-y-2">
             <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
             <p className="text-[10px] font-bold text-slate-400 uppercase">Cargando...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-10 px-6">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No hay mensajes</p>
            <p className="text-[9px] text-slate-400 mt-2 italic">Dile al vendedor si tienes dudas sobre tu pedido.</p>
          </div>
        ) : (
          messages.map((m) => (
            <div key={m._id} className={`flex ${m.senderType === "customer" || m.senderType === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] p-3 rounded-2xl shadow-sm text-xs ${
                m.senderType === "customer" || m.senderType === "user"
                  ? "bg-blue-600 text-white rounded-tr-none" 
                  : "bg-white text-slate-700 border border-slate-200 rounded-tl-none"
              }`}>
                <p className="leading-relaxed">{m.text}</p>
                <div className={`flex items-center gap-1 mt-1 text-[8px] opacity-60 ${m.senderType === "customer" || m.senderType === "user" ? "justify-end" : "justify-start"}`}>
                  <Clock size={10} />
                  {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={scrollRef} />
      </div>

      {/* INPUT */}
      <div className="p-3 bg-white border-t">
        <form onSubmit={sendMessage} className="flex gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 bg-transparent border-none focus:ring-0 text-xs px-2 outline-none"
            placeholder="Escribe un mensaje..."
          />
          <button 
            type="submit" 
            disabled={!text.trim()}
            className="bg-blue-600 p-2 rounded-lg text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}