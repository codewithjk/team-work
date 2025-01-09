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



const chatSoketHandler = (io, socket) => {
  socket.on("sendMessage", async ({ groupId, message }) => {
    try {
      const messageData = {
        groupId,
        ...message,
        timestamp: new Date(),
      };

      const newMessage = await createMessageUseCase.execute(messageData);
      let notification = {};
      if (newMessage.attachmentUrl) {
        notification = {
          type: "messageReceived",
          title: `${message.senderName} sent a file`,
          previewUrl: newMessage.attachmentUrl,
        };
      } else {
        notification = {
          type: "messageReceived",
          title: `${message.senderName} sent a message`,
          message: newMessage.content,
        };
      }
      const newNotification = await createNotificationUseCase.execute(
        notification
      );
      const allMembers = await listAllMembersUseCase.execute(
        groupId
      );
      const memberIds = allMembers
        .map((member) => member.user._id)

      const idsForSendNotification = memberIds.filter((id) => id != message.senderId);

      await notifyUserUseCase.execute(idsForSendNotification, newNotification._id);
      // Notify connected members
      memberIds.forEach((memberId) => {
        const mId = memberId.toString();
        const socketId = SocketMap.get(mId);

        if (socketId && socketId !== undefined) {
          if (memberId != message.senderId) io.to(socketId).emit("receiveNotification", notification); // Send notification via socket
          io.to(socketId).emit("receiveMessage", newMessage);
        }
      });
      // io.to(groupId).emit("receiveMessage", newMessage);
    } catch (error) {
      socket.emit("error", { message: "Failed to send message" });
    }
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
