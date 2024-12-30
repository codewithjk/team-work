const mongoose = require("mongoose");
const { Schema } = mongoose;

const TaskSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    state: {
      type: String,
      enum: [
        "backlog",
        "planned",
        "in-progress",
        "paused",
        "completed",
        "cancelled",
      ],
      required: [true, "State is required"],
    },
    priority: {
      type: String,
      enum: ["urgent", "high", "medium", "low", "none"],
      required: [true, "Priority is required"],
    },
    assignees: [
      {
        type: Schema.Types.ObjectId,
        ref: "Member",
        required: [true, "At least one assignee is required"],
      },
    ],
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    module: {
      type: Schema.Types.ObjectId,
      ref: "Module",
      required: [true, "Module is required"],
    },
    projectId: { type: mongoose.Schema.ObjectId, ref: "Project" },
    createdBy: { type: mongoose.Schema.ObjectId, ref: "User" },
    files: {
      type: Array
    }
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", TaskSchema);

module.exports = Task;
