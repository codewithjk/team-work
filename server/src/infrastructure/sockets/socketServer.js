
const socketIO = require("socket.io");
const chatHandler = require("../../interfaces/socket_handlers/chatHandler");
const taskHandler = require("../../interfaces/socket_handlers/taskHandler");
const { SocketMap } = require("../../shared/constants/constants");
const getProfile = require("../../application/use-cases/getProfile");
const UpdateUser = require("../../application/use-cases/updateProfile")


module.exports = (httpServer) => {
  const io = socketIO(httpServer);

  io.on("connection", async (socket) => {
    console.log("socket connected")
    const userId = socket.handshake.query.userId;
    const res = await UpdateUser.execute(userId, { socketId: socket.id });
    SocketMap.set(userId, socket.id);

    /**
     * Handle disconnection and cleanup
     */
    socket.on("disconnect", async () => {
      console.log("socket disconnected")
      try {
        SocketMap.delete(userId);
      } catch (error) {
        console.error("Error in disconnect handler:", error);
      }
    });

    // Custom handlers for chat and task logic
    chatHandler.chatSoketHandler(io, socket);
    taskHandler.taskSocketHandler(io, socket);
  });


  return io;
};
