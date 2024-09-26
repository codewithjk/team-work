const socketIO = require("socket.io");
const chatHandler = require("../../interfaces/socket_handlers/chatHandler");

module.exports = (httpServer) => {
  const io = socketIO(httpServer);

  io.on("connection", (socket) => {
    socket.on("joinProjectGroup", ({ groupId, userId }) => {
      console.log("room  == ", groupId, userId);

      socket.join(groupId);

      io.to(groupId).emit("userJoined", { userId });
    });

    // chatHandler(io, socket);
    chatHandler.chatSoketHandler(io, socket);

    socket.on("leaveProjectGroup", ({ groupId, userId }) => {
      console.log("User leaving group: ", groupId, userId);

      socket.leave(groupId);

      // Optionally, notify the group that a user left
      io.to(groupId).emit("userLeft", { userId });
    });

    socket.on("disconnect", () => {
      // Handle disconnection logic
    });
  });

  return io;
};
