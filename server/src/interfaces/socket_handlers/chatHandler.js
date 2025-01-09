const {
  CreateMessage,
  ListAllMessage,
} = require("../../application/use-cases/message-use-cases");
const {
  CreateNotification,
} = require("../../application/use-cases/notification-use-cases");
const NotifyUser = require("../../application/use-cases/notification-use-cases/NotifyUser");
const ListAllMembers = require("../../application/use-cases/project-use-cases/ListAllMembers");
const MessageRepositoryImpl = require("../../infrastructure/database/repositories/messageRepositoryImpl");
const NotificationRepositoryImpl = require("../../infrastructure/database/repositories/notificationRepositoryImpl");
const ProjectRepositoryImpl = require("../../infrastructure/database/repositories/projectRepositoryImpl");
const UserNotificationRepositoryImpl = require("../../infrastructure/database/repositories/userNotificationRepositoryImpl");
const { SocketMap } = require("../../shared/constants/constants");

//message
const messageRepository = new MessageRepositoryImpl();
const createMessageUseCase = new CreateMessage(messageRepository);
const listAllMessageUseCase = new ListAllMessage(messageRepository);

//notification
const notificationRepository = new NotificationRepositoryImpl();
const createNotificationUseCase = new CreateNotification(
  notificationRepository
);

const userNotificationRepository = new UserNotificationRepositoryImpl();
const notifyUserUseCase = new NotifyUser(userNotificationRepository);

//get members
const projectRepository = new ProjectRepositoryImpl();
const listAllMembersUseCase = new ListAllMembers(projectRepository);

const onlineUsers = new Map();

const chatSoketHandler = (io, socket) => {
  // Handle joinGroup event
  socket.on("joinGroup", async (data) => {
    const { groupId, user } = data;

    // Add user to onlineUsers map
    if (!onlineUsers.has(groupId)) {
      onlineUsers.set(groupId, new Set());
    }
    const groupUsers = onlineUsers.get(groupId);
    groupUsers.add(user);

    // Notify connected members
    const allMembers = await listAllMembersUseCase.execute(groupId);
    const memberIds = allMembers.map((member) => member.user._id);

    memberIds.forEach((memberId) => {
      const mId = memberId.toString();
      const socketId = SocketMap.get(mId);

      if (socketId && socketId !== undefined) {
        if (memberId !== user._id) {
          io.to(socketId).emit("userJoined", { groupId, user });
        }
      }
    });

    // Emit updated online users
    io.to(groupId).emit("onlineUsers", Array.from(groupUsers));
  });

  // Handle leftGroup event
  socket.on("leftGroup", async (data) => {
    const { groupId, user } = data;

    // Remove user from onlineUsers map
    if (onlineUsers.has(groupId)) {
      const groupUsers = onlineUsers.get(groupId);
      groupUsers.delete(user);

      // Remove the group entry if no users are left
      if (groupUsers.size === 0) {
        onlineUsers.delete(groupId);
      }
    }

    // Notify connected members
    const allMembers = await listAllMembersUseCase.execute(groupId);
    const memberIds = allMembers.map((member) => member.user._id);

    memberIds.forEach((memberId) => {
      const mId = memberId.toString();
      const socketId = SocketMap.get(mId);

      if (socketId && socketId !== undefined) {
        if (memberId !== user._id) {
          io.to(socketId).emit("userLeft", { groupId, user });
        }
      }
    });

    // Emit updated online users
    io.to(groupId).emit("onlineUsers", Array.from(onlineUsers.get(groupId) || []));
  });

  // Emit all online users for a group
  socket.on("getOnlineUsers", ({ groupId }) => {
    const groupUsers = onlineUsers.get(groupId) || new Set();
    socket.emit("onlineUsers", Array.from(groupUsers));
  });
};

const getAllChats = async (req, res) => {
  try {
    const { groupId, timestamp } = req.query;
    const messages = await listAllMessageUseCase.execute({
      groupId,
      timestamp,
    });
    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = { getAllChats, chatSoketHandler };
