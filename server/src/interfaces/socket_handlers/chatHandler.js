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
      console.log(message, groupId);
      const messageData = {
        groupId,
        ...message,
        timestamp: new Date(),
      };

      const newMessage = await createMessageUseCase.execute(messageData);
      const notification = {
        type: "messageReceived",
        title: `${message.senderName} sent a message`,
        message: newMessage.content,
      };
      const newNotification = await createNotificationUseCase.execute(
        notification
      );
      const allMembers = await listAllMembersUseCase.execute({
        projectId: groupId,
      });
      console.log("members = ", allMembers);
      console.log("sender = ", message.senderId);
      const memberIds = allMembers
        .filter(
          (member) => member.user._id != message.senderId // TODO: consider the sending user
        )
        .map((member) => member.user._id);

      await notifyUserUseCase.execute(memberIds, newNotification._id);

      // Notify connected members
      console.log(memberIds);

      memberIds.forEach((memberId) => {
        const socketId = memberId.toString();
        if (socketId) {
          console.log("loop ==", socketId);

          // io.to(socketId).emit("receiveNotification", notification); // Send notification via socket
          // io.to(groupId).emit("receiveNotification", notification); // Send notification via socket
        }
      });
      // io.to(groupId).emit("receiveNotification", notification);
      io.to(groupId).emit("receiveMessage", newMessage);
      socket.emit("receiveNotification", notification);
    } catch (error) {
      console.log("group message error = >", error);

      socket.emit("error", { message: "Failed to send message" });
    }
  });
};

const getAllChats = async (req, res) => {
  try {
    console.log(req.query);
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
