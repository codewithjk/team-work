const mongoose = require("mongoose");
const { Schema } = mongoose;

const SubscriptionSchema = new Schema(
  {
    userId: { type: mongoose.Schema.ObjectId, ref: "User" },
    plan: {
      type: String,
      enum: ["free", "premium"],
      default: "free",
    },
    period: {
      type: String,
      enum: ["monthly", "yearly"],
    },
    startDate: {
      type: Date,
      default: Date.now(),
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
  },
  {
    timestamps: true,
  }
);

const Subscription = mongoose.model("Subscription", SubscriptionSchema);

module.exports = Subscription;
