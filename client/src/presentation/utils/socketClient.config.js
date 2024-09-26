import { io } from "socket.io-client";

let socket;

export const initSocket = (url) => {
  socket = io(url, {
    transports: ["websocket"],
  });
  return socket;
};

export const getSocket = () => socket;
