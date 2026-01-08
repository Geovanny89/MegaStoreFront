import { useEffect } from "react";
import socket from "../../socket/socket.js";

export default function MessagesBase({ orderId, children, onNewMessage }) {
  useEffect(() => {
    if (!orderId) return;

    // 1. Unirse a la sala
    socket.emit("joinOrder", orderId);

    // 2. Escuchar el evento que definimos en el backend
    const handleNewMessage = (message) => {
      console.log("🚀 Nuevo mensaje recibido:", message);
      if (onNewMessage) {
        onNewMessage(message); // Pasamos el mensaje al componente hijo
      }
    };

    socket.on("newMessage", handleNewMessage);

    // 3. Limpieza completa
    return () => {
      socket.off("newMessage", handleNewMessage);
      // Opcional: socket.emit("leaveOrder", orderId);
    };
  }, [orderId, onNewMessage]);

  return children;
}