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
          as: "assignees",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "assignees.userId",
          foreignField: "_id",
          as: "assigneeDetails",
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
          assignees: "$assigneeDetails",
          project: { name: "$project.name" },
          module: "$moduleDetails",
        },
      },
    ]);
  }

  async save(task) {
    const newTask = new taskModel(task);
    return await newTask.save();
  }
  async update(taskId, task) {
    // const id = new mongoose.Types.ObjectId(taskId);
    return await taskModel.findByIdAndUpdate(taskId, task, { new: true });
  }

  async delete(id) {
    return await taskModel.findByIdAndDelete(id);
  }
  async findAll(queries) {
    try {
      let { search, filter, page, limit, projectId } = queries;
      projectId = new mongoose.Types.ObjectId(projectId);
      const query = { projectId };

      if (search) {
        query.name = { $regex: search, $options: "i" };
      }

      if (filter) {
        query = { ...query, ...filter };
      }

      const totalProjects = await taskModel.countDocuments(query);
      const totalPages = Math.ceil(totalProjects / limit);

      // const tasks = await taskModel
      //   .find(query)
      //   .skip((page - 1) * limit)
      //   .limit(parseInt(limit));
      const tasks = await taskModel.aggregate([
        {
          $match: query, // Apply the query conditions
        },
        {
          $lookup: {
            from: "members",
            localField: "assignees",
            foreignField: "_id",
            as: "assignees",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "assignees.userId",
            foreignField: "_id",
            as: "assigneeDetails",
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
            assignees: "$assigneeDetails",
            project: { name: "$project.name" },
            module: "$moduleDetails",
            files: 1
          },
        },
        {
          $sort: { endDate: -1 }, // Sort tasks by `endDate` in descending order (most recent first)
        },
        {
          $skip: (page - 1) * limit, // Pagination: skip documents
        },
        {
          $limit: parseInt(limit), // Pagination: limit documents
        },
      ]);


      return { tasks, totalPages };
    } catch (error) {
      throw error;
    }
  }
  async findByUserId(userId) {
    try {
      const result = await mongoose.model("Task").aggregate([
        {
          $match: {
            assignees: new mongoose.Types.ObjectId(userId), // Match userId within the assignees array
          },
        },
        {
          $lookup: {
            from: "modules",
            localField: "module",
            foreignField: "_id",
            as: "moduleDetails",
          },
        },
        {
          $lookup: {
            from: "projects",
            localField: "projectId",
            foreignField: "_id",
            as: "projectDetails",
          },
        },
        {
          $project: {
            name: 1,
            description: 1,
            state: 1,
            priority: 1,
            startDate: 1,
            endDate: 1,
            moduleDetails: { $arrayElemAt: ["$moduleDetails.name", 0] },
            projectDetails: { $arrayElemAt: ["$projectDetails.name", 0] },
          },
        },
        {
          $group: {
            _id: null,
            tasksAssignedToUser: { $push: "$$ROOT" },
            totalTasks: { $sum: 1 },
            completedTasks: {
              $push: {
                $cond: [{ $eq: ["$state", "completed"] }, "$$ROOT", null],
              },
            },
          },
        },
        {
          $project: {
            tasksAssignedToUser: 1,
            totalTasks: 1,
            completedTasks: {
              $filter: {
                input: "$completedTasks",
                as: "item",
                cond: { $ne: ["$$item", null] },
              },
            },
          },
        },
      ]);

      return result.length > 0
        ? result[0]
        : {
          tasksAssignedToUser: [],
          totalTasks: 0,
          completedTasks: [],
        };
    } catch (error) {
      console.error("Error fetching assigned tasks for user:", error);
      throw error;
    }
  }

}

module.exports = TaskRepositoryImpl;
