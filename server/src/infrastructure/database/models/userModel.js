const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  isVerified: {
    type: Boolean,
    default: false,
  },
  oauthId: String,
  avatar: String,
  resetPsswordToken: String,
  resetPsswordTokenExpiresAt: Date,
  verificationToken: String,
  verificationTokenExpiresAt: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
