const mongoose = require("mongoose");
const userNotificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  notification: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Notification",
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("UserNotification", userNotificationSchema);
