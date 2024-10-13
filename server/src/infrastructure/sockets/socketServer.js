// const socketIO = require("socket.io");
// const chatHandler = require("../../interfaces/socket_handlers/chatHandler");
// const { SocketMap } = require("../../shared/constants/constants");
// const getProfile = require("../../application/use-cases/getProfile");

// module.exports = (httpServer) => {
//   const io = socketIO(httpServer);

//   // Store online users per group
//   const groupOnlineUsers = new Map();
//   // Store user's joined groups for cleanup
//   const userGroups = new Map();

//   io.on("connection", async (socket) => {
//     const userId = socket.handshake.query.userId;
//     console.log("Socket connected:", userId, socket.id);

//     SocketMap.set(userId, socket.id);

//     userGroups.set(userId, new Set());

//     socket.on("joinProjectGroup", async ({ groupId, userId }) => {
//       try {
//         console.log("User joining group:", groupId, userId);
//         socket.join(groupId);
//         const user = await getProfile.execute(userId);
//         const userObject = user.toObject();

//         if (!groupOnlineUsers.has(groupId)) {
//           groupOnlineUsers.set(groupId, new Map());
//         }

//         const groupUsers = groupOnlineUsers.get(groupId);
//         groupUsers.set(userId, userObject);

//         userGroups.get(userId).add(groupId);

//         socket.emit("onlineUsers", Array.from(groupUsers.values()));

//         socket.to(groupId).emit("userJoined", userObject);
//       } catch (error) {
//         console.error("Error in joinProjectGroup:", error);
//       }
//     });

//     socket.on("leaveProjectGroup", async ({ groupId, userId }) => {
//       try {
//         console.log("User leaving group:", groupId, userId);
//         socket.leave(groupId);

//         if (groupOnlineUsers.has(groupId)) {
//           const groupUsers = groupOnlineUsers.get(groupId);
//           groupUsers.delete(userId);

//           if (groupUsers.size === 0) {
//             groupOnlineUsers.delete(groupId);
//           }
//         }

//         userGroups.get(userId)?.delete(groupId);

//         io.to(groupId).emit("userLeft", userId);
//       } catch (error) {
//         console.error("Error in leaveProjectGroup:", error);
//       }
//     });

//     socket.on("disconnect", async () => {
//       try {
//         console.log("User disconnected:", userId);

//         const userGroupSet = userGroups.get(userId);

//         if (userGroupSet) {
//           for (const groupId of userGroupSet) {
//             const groupUsers = groupOnlineUsers.get(groupId);
//             if (groupUsers) {
//               groupUsers.delete(userId);

//               if (groupUsers.size === 0) {
//                 groupOnlineUsers.delete(groupId);
//               }

//               io.to(groupId).emit("userLeft", userId);
//             }
//           }
//         }

//         userGroups.delete(userId);
//         SocketMap.delete(userId);
//       } catch (error) {
//         console.error("Error in disconnect handler:", error);
//       }
//     });

//     chatHandler.chatSoketHandler(io, socket);
//   });

//   const getOnlineUsersInGroup = (groupId) => {
//     const groupUsers = groupOnlineUsers.get(groupId);
//     return groupUsers ? Array.from(groupUsers.values()) : [];
//   };

//   return io;
// };

const socketIO = require("socket.io");
const chatHandler = require("../../interfaces/socket_handlers/chatHandler");
const taskHandler = require("../../interfaces/socket_handlers/taskHandler");
const { SocketMap } = require("../../shared/constants/constants");
const getProfile = require("../../application/use-cases/getProfile");
// const getTasks = require("../../application/use-cases/getTasks");

module.exports = (httpServer) => {
  const io = socketIO(httpServer);

  // Store online users per group (for chat) and per project (for Kanban)
  const groupOnlineUsers = new Map(); // For chat groups
  const projectUsers = new Map(); // For Kanban board

  // Store user's joined groups and projects for cleanup
  const userGroups = new Map();
  const userProjects = new Map();

  io.on("connection", async (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("Socket connected:", userId, socket.id);

    SocketMap.set(userId, socket.id);
    userGroups.set(userId, new Set());
    userProjects.set(userId, new Set());

    /**
     *  Chat Management
     */
    socket.on("joinProjectGroup", async ({ groupId, userId }) => {
      try {
        console.log("User joining chat group:", groupId, userId);
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
        console.log("User leaving chat group:", groupId, userId);
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
        console.log("User joining project task room:", projectId, userId);
        console.log(projectId, userId);
        socket.join(projectId);

        // const tasks = await getTasks.execute(projectId); // Fetch current tasks for the project
        const userObject = { userId }; // Modify as needed based on what you want to store

        if (!projectUsers.has(projectId)) {
          projectUsers.set(projectId, new Map());
        }

        const projectRoomUsers = projectUsers.get(projectId);
        projectRoomUsers.set(userId, userObject);

        console.log("userProjects === ", userProjects);

        userProjects.get(userId).add(projectId);

        console.log("groupUsers ========", projectRoomUsers);
        console.log("userGroup ========", userProjects);

        // Send the current task state to the user joining the project
        // socket.emit("currentTasks", tasks);
        socket.to(projectId).emit("userJoinedProject", userObject);
      } catch (error) {
        console.error("Error in joinProjectTask:", error);
      }
    });

    socket.on("leaveProjectTask", async ({ projectId, userId }) => {
      try {
        console.log("User leaving project task room:", projectId, userId);
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

    // Task update event
    // socket.on("taskUpdated", async ({ projectId, taskId, state }) => {
    //   try {
    //     console.log(`Task ${taskId} updated in project ${projectId}`);

    //     // Broadcast the updated task to all users in the project room
    //     io.to(projectId).emit("taskUpdated", { taskId, state });
    //   } catch (error) {
    //     console.error("Error in taskUpdated:", error);
    //   }
    // });

    /**
     * Handle disconnection and cleanup
     */
    socket.on("disconnect", async () => {
      try {
        console.log("User disconnected:", userId);

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

  // Helper to get users in chat group
  const getOnlineUsersInGroup = (groupId) => {
    const groupUsers = groupOnlineUsers.get(groupId);
    return groupUsers ? Array.from(groupUsers.values()) : [];
  };

  // Helper to get users in Kanban project room
  const getOnlineUsersInProject = (projectId) => {
    const projectRoomUsers = projectUsers.get(projectId);
    return projectRoomUsers ? Array.from(projectRoomUsers.values()) : [];
  };

  return io;
};
