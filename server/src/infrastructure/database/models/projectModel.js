const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  ownerId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  coverImage: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Project", userSchema);
