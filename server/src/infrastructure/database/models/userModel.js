const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  isVerified: {
    type: Boolean,
    default: false,
  },
  coverPhoto: String,
  oauthId: String,
  avatar: String,
  resetPsswordToken: String,
  resetPsswordTokenExpiresAt: Date,
  verificationToken: String,
  verificationTokenExpiresAt: Date,

  plan: {
    type: String,
    enum: ["free", "premium"],
    default: "free",
  },
  customerId: String,
  subscription: {
    type: Schema.Types.ObjectId,
    ref: "Subscription",
  },
  socketId:String,

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
