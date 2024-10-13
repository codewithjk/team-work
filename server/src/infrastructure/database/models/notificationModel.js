// Notification Schema (Stores Notification Details)
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["taskAssigned", "messageReceived", "meetingCreated"],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
  },
  link: {
    type: String,
    required: false,
  },
  previewUrl: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Notification", notificationSchema);
