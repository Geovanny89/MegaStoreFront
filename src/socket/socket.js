import { io } from "socket.io-client";

const socket = io("https://api.k-dice.com", {
  withCredentials: true,
  transports: ["websocket"]
});

export default socket;
