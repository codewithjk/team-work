const mongoose = require("mongoose");

const ModuleSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 255 },
  description: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  status: {
    type: String,
    enum: [
      "backlog",
      "planned",
      "in-progress",
      "paused",
      "completed",
      "cancelled",
    ],
    default: "planned",
  },
  lead: { type: mongoose.Schema.ObjectId, ref: "Member" },
  members: [{ type: mongoose.Schema.ObjectId, ref: "Member" }],
  projectId: { type: mongoose.Schema.ObjectId, ref: "Project" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Module", ModuleSchema);
