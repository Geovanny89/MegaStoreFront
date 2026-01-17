import React, { useEffect, useState, useRef } from "react";
import api from "../../../api/axios";
import socket from "../../../socket/socket"; // Importamos tu instancia de socket
import { Send, Clock } from "lucide-react";

export default function SellerMessages({ orderId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const scrollRef = useRef();

  // 1. Scroll automático al final cuando hay nuevos mensajes
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 2. Carga inicial y configuración de Tiempo Real
  useEffect(() => {
    if (orderId) {
      // Cargar historial de mensajes
      api.get(`/orders/${orderId}/messages`)
        .then(res => setMessages(res.data)) 
        .catch(err => console.error("Error al cargar:", err));

      // Unirse a la sala de la orden
      socket.emit("joinOrder", orderId);

      // Escuchar nuevos mensajes
      socket.on("newMessage", (msg) => {
        // Validamos que el mensaje sea de esta orden
        if (msg.orderId === orderId) {
          setMessages((prev) => {
            // Evitar duplicados
            const exists = prev.some(m => m._id === msg._id);
            return exists ? prev : [...prev, msg];
          });
        }
      });
    }

    // Limpieza al desmontar el componente
    return () => {
      socket.off("newMessage");
    };
  }, [orderId]);

  // 3. Función para enviar mensajes
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      // CORREGIDO: De "messagess" a "messages"
      const res = await api.post(`/orders/${orderId}/messagess`, { text });
      
      // Actualizamos localmente de inmediato (el socket también lo hará)
      setMessages(prev => {
        const exists = prev.some(m => m._id === res.data._id);
        return exists ? prev : [...prev, res.data];
      });
      
      setText("");
    } catch (err) {
      console.error("Error al enviar mensaje:", err.response?.data || err.message);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 overflow-hidden">
      {/* AREA DE MENSAJES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">No hay mensajes aún</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 px-10 mt-2 italic">Aclara dudas al cliente sobre su envío o pago.</p>
          </div>
        ) : (
          messages.map((m) => (
            <div key={m._id} className={`flex ${m.senderType === "seller" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] p-3 rounded-2xl shadow-sm ${
                m.senderType === "seller" 
                  ? "bg-emerald-600 text-white rounded-tr-none" 
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-none"
              }`}>
                <p className="text-sm font-medium leading-relaxed">{m.text}</p>
                <div  className={`flex items-center gap-1 mt-1 text-[9px] opacity-70 ${
                  m.senderType === "seller"
                    ? "justify-end text-white/70"
                    : "justify-start text-slate-500 dark:text-slate-400"
                }`}
              >
                  <Clock size={10} />
                  {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={scrollRef} />
      </div>

      {/* INPUT DE TEXTO */}
      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <form onSubmit={sendMessage} className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-2 rounded-2xl border border-slate-200 dark:border-slate-700
                   focus-within:ring-2 focus-within:ring-emerald-500">

          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-2 outline-none
                     text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
            placeholder="Escribe un mensaje al cliente..."
          />
          <button 
            type="submit" 
            disabled={!text.trim()}
            className="bg-emerald-600 p-2.5 rounded-xl text-white hover:bg-emerald-700
                     disabled:opacity-50 shadow-lg shadow-emerald-600/20"
          >
            <Send size={18} />
          </button>
        </form>
        <p className="text-[9px] text-slate-400 dark:text-slate-500 text-center mt-2 font-bold uppercase tracking-tight">
          La mensajería es solo informativa
        </p>
      </div>
    </div>
  );
}