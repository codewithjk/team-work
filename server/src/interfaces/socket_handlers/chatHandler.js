const {
  CreateMessage,
  ListAllMessage,
} = require("../../application/use-cases/message-use-cases");
const MessageRepositoryImpl = require("../../infrastructure/database/repositories/messageRepositoryImpl");

const messageRepository = new MessageRepositoryImpl();
const createMessageUseCase = new CreateMessage(messageRepository);
const listAllMessageUseCase = new ListAllMessage(messageRepository);

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

      console.log("group message ==> ", newMessage);

      // Broadcast message to all members of the group
      io.to(groupId).emit("receiveMessage", newMessage);
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
