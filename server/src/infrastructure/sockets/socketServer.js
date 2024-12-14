
const socketIO = require("socket.io");
const chatHandler = require("../../interfaces/socket_handlers/chatHandler");
const taskHandler = require("../../interfaces/socket_handlers/taskHandler");
const { SocketMap } = require("../../shared/constants/constants");
const getProfile = require("../../application/use-cases/getProfile");
const UpdateUser = require("../../application/use-cases/updateProfile")


module.exports = (httpServer) => {
  const io = socketIO(httpServer);
  const groupOnlineUsers = new Map(); // For chat groups
  const projectUsers = new Map(); // For Kanban board

  const userGroups = new Map();
  const userProjects = new Map();

  io.on("connection", async (socket) => {
    const userId = socket.handshake.query.userId;
    const res = await UpdateUser.execute(userId, { socketId: socket.id });
    SocketMap.set(userId, socket.id);
    userGroups.set(userId, new Set());
    userProjects.set(userId, new Set());

    /**
     *  Chat Management
     */
    socket.on("joinProjectGroup", async ({ groupId, userId }) => {
      try {
        socket.join(groupId);
        const user = await getProfile.execute(userId);
        const userObject = user.toObject();

        if (!groupOnlineUsers.has(groupId)) {
          groupOnlineUsers.set(groupId, new Map());
        }

        const groupUsers = groupOnlineUsers.get(groupId);
        groupUsers.set(userId, userObject);

        userGroups.get(userId).add(groupId);

        socket.emit("onlineUsers", Array.from(groupUsers.values()));
        socket.to(groupId).emit("userJoined", userObject);
      } catch (error) {
        console.error("Error in joinProjectGroup:", error);
      }
    });

    socket.on("leaveProjectGroup", async ({ groupId, userId }) => {
      try {
        socket.leave(groupId);
        if (groupOnlineUsers.has(groupId)) {
          const groupUsers = groupOnlineUsers.get(groupId);
          groupUsers.delete(userId);

          if (groupUsers.size === 0) {
            groupOnlineUsers.delete(groupId);
          }
        }

        userGroups.get(userId)?.delete(groupId);
        io.to(groupId).emit("userLeft", userId);
      } catch (error) {
        console.error("Error in leaveProjectGroup:", error);
      }
    });

    /**
     *  Kanban Task Management
     */
    socket.on("joinProjectTask", async ({ projectId, userId }) => {
      try {
        socket.join(projectId);
        const userObject = { userId };

        if (!projectUsers.has(projectId)) {
          projectUsers.set(projectId, new Map());
        }

        const projectRoomUsers = projectUsers.get(projectId);
        projectRoomUsers.set(userId, userObject);
        console.log(userProjects);

        userProjects.get(userId).add(projectId);
        // Send the current task state to the user joining the project
        socket.to(projectId).emit("userJoinedProject", userObject);
      } catch (error) {
        console.error("Error in joinProjectTask:", error);
      }
    });

    socket.on("leaveProjectTask", async ({ projectId, userId }) => {
      try {
        socket.leave(projectId);
        if (projectUsers.has(projectId)) {
          const projectRoomUsers = projectUsers.get(projectId);
          projectRoomUsers.delete(userId);

          if (projectRoomUsers.size === 0) {
            projectUsers.delete(projectId);
          }
        }
        userProjects.get(userId)?.delete(projectId);
        io.to(projectId).emit("userLeftProject", userId);
      } catch (error) {
        console.error("Error in leaveProjectTask:", error);
      }
    });

    /**
     * Handle disconnection and cleanup
     */
    socket.on("disconnect", async () => {
      try {
        const userGroupSet = userGroups.get(userId);
        const userProjectSet = userProjects.get(userId);

        // Cleanup for chat groups
        if (userGroupSet) {
          for (const groupId of userGroupSet) {
            const groupUsers = groupOnlineUsers.get(groupId);
            if (groupUsers) {
              groupUsers.delete(userId);
              if (groupUsers.size === 0) {
                groupOnlineUsers.delete(groupId);
              }
              io.to(groupId).emit("userLeft", userId);
            }
          }
        }

        // Cleanup for Kanban task rooms
        if (userProjectSet) {
          for (const projectId of userProjectSet) {
            const projectRoomUsers = projectUsers.get(projectId);
            if (projectRoomUsers) {
              projectRoomUsers.delete(userId);
              if (projectRoomUsers.size === 0) {
                projectUsers.delete(projectId);
              }
              io.to(projectId).emit("userLeftProject", userId);
            }
          }
        }

        // Remove the user from global maps
        userGroups.delete(userId);
        userProjects.delete(userId);
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
