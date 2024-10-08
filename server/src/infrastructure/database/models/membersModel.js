const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive", "pending"],
    default: "pending",
  },
  role: String,
  inviteTokenExpiresAt: Date,
  inviteToken: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

memberSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Member", memberSchema);
