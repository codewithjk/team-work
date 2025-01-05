import { io } from "socket.io-client";

const socketURL =
  import.meta.env.VITE_SOCKET_BASE_URL || "http://localhost:3000";
let socket;

export const initSocket = (userId, url = socketURL) => {
  socket = io(url, {
    transports: ["websocket"],
    query: { userId },
  });
  return socket;
};

export const getSocket = () => socket;
