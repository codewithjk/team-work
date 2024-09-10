const mongoose = require("mongoose");
const membersModel = require("../models/membersModel");
const taskModel = require("../models/taskModel");

class TaskRepositoryImpl {
  async findById(id) {
    return await taskModel.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) },
      },
      {
        $lookup: {
          from: "members",
          localField: "assignees",
          foreignField: "_id",
          as: "assignees", // Changed alias to "assignees"
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "assignees.userId", // Changed localField to use "assignees"
          foreignField: "_id",
          as: "assigneeDetails", // Changed alias to "assigneeDetails"
        },
      },
      {
        $lookup: {
          from: "projects",
          localField: "projectId",
          foreignField: "_id",
          as: "project",
        },
      },
      {
        $unwind: {
          path: "$project",
          preserveNullAndEmptyArrays: true,
        },
      },
      // New lookup for module details
      {
        $lookup: {
          from: "modules",
          localField: "module",
          foreignField: "_id",
          as: "moduleDetails",
        },
      },
      {
        $unwind: {
          path: "$moduleDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          name: 1,
          description: 1,
          startDate: 1,
          endDate: 1,
          state: 1,
          priority: 1,
          assignees: "$assigneeDetails", // Changed projection to use "assignees"
          project: { name: "$project.name" },
          module: "$moduleDetails", // Project module name
        },
      },
    ]);
  }

  async save(task) {
    const newTask = new taskModel(task);
    return await newTask.save();
  }
  async update(id, task) {
    return await taskModel.findByIdAndUpdate(id, task);
  }

  async delete(id) {
    return await taskModel.findByIdAndDelete(id);
  }
  async findAll(queries) {
    try {
      console.log("queries : ", queries);

      const { search, filter, page, limit, projectId } = queries;
      const query = { projectId };

      if (search) {
        query.name = { $regex: search, $options: "i" };
      }

      if (filter) {
        query.category = filter;
      }

      const totalProjects = await taskModel.countDocuments(query);
      const totalPages = Math.ceil(totalProjects / limit);

      const tasks = await taskModel
        .find(query)
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

      return { tasks, totalPages };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = TaskRepositoryImpl;
