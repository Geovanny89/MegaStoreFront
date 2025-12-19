import { useEffect } from "react";
import socket from "../../socket/socket.js";

export default function MessagesBase({ orderId, children }) {
  useEffect(() => {
    socket.emit("joinOrder", orderId);

    return () => {
      socket.off("newMessage");
    };
  }, [orderId]);

  return children;
}
