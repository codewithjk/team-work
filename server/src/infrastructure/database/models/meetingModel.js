const mongoose = require("mongoose");

const MeetingSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 255 },
  roomId: { type: String },
  projectId: { type: mongoose.Schema.ObjectId, ref: "Project" },
  subject: String,
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        return value > this.startTime;
      },
      message: "End time must be after start time.",
    },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Meeting", MeetingSchema);
