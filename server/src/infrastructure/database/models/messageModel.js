const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  senderName: String,
  content: {
    type: String,
  },
  messageType: {
    type: String,
    enum: ["text", "image", "file"],
    default: "text",
  },
  attachmentUrl: {
    type: String,
  },
  downloadLink: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
  avatar: String,
});

module.exports = mongoose.model("Message", MessageSchema);
