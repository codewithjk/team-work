import { io } from "socket.io-client";

let socket;

export const initSocket = (userId, url) => {
  socket = io(url, {
    transports: ["websocket"],
    query: { userId },
  });
  return socket;
};

export const getSocket = () => socket;
