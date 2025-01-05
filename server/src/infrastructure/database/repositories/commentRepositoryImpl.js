const mongoose = require("mongoose");
const membersModel = require("../models/membersModel");
const commentModel = require("../models/commentModel");

class CommentRepositoryImpl {
  async findById(id) {

  }

  async save(comment) {
    const newComment = new commentModel(comment);
    return await newComment.save();
  }
  async update(commentId, comment) {
    // const id = new mongoose.Types.ObjectId(commentId);
    return await commentModel.findByIdAndUpdate(commentId, comment, { new: true });
  }

  async delete(id) {
    return await commentModel.findByIdAndDelete(id);
  }
  async findAll(queries) {
    try {
      let { search, filter, page, limit, taskId } = queries;
      taskId = new mongoose.Types.ObjectId(taskId);
      const query = { taskId };

      if (search) {
        query.name = { $regex: search, $options: "i" };
      }

      if (filter) {
        query = { ...query, ...filter };
      }

      const totalProjects = await commentModel.countDocuments(query);
      const totalPages = Math.ceil(totalProjects / limit);

      // const comments = await commentModel
      //   .find(query)
      //   .skip((page - 1) * limit)
      //   .limit(parseInt(limit));
      const comments = await commentModel.aggregate([
        {
          $match: query, // Apply the query conditions
        },
        {
          $lookup: {
            from: "users",
            localField: "author",
            foreignField: "_id",
            as: "author",
          },
        }, {
          $unwind: {
            path: "$author"
          }
        },
        {
          $sort: { "timestamp": -1 }
        },
        {
          $skip: (page - 1) * limit, // Pagination: skip documents
        },
        {
          $limit: parseInt(limit), // Pagination: limit documents
        },
      ])

      return { comments, totalPages };
    } catch (error) {
      throw error;
    }
  }
  async findByUserId(userId) {
    try {
      const result = await mongoose.model("Comment").aggregate([
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
            commentsAssignedToUser: { $push: "$$ROOT" },
            totalComments: { $sum: 1 },
            completedComments: {
              $push: {
                $cond: [{ $eq: ["$state", "completed"] }, "$$ROOT", null],
              },
            },
          },
        },
        {
          $project: {
            commentsAssignedToUser: 1,
            totalComments: 1,
            completedComments: {
              $filter: {
                input: "$completedComments",
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
          commentsAssignedToUser: [],
          totalComments: 0,
          completedComments: [],
        };
    } catch (error) {
      console.error("Error fetching assigned comments for user:", error);
      throw error;
    }
  }

}

module.exports = CommentRepositoryImpl;
