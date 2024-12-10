const mongoose = require("mongoose");

const MeetingSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 255 },
  roomId: { type: String },
  projectId: { type: mongoose.Schema.ObjectId, ref: "Project" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Meeting", MeetingSchema);
