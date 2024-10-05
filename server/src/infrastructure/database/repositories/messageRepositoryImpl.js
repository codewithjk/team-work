const mongoose = require("mongoose");
const membersModel = require("../models/membersModel");
const moduleModel = require("../models/moduleModel");
const messageModel = require("../models/messageModel");

class MessageRepositoryImpl {
  async findById(id) {
    return await moduleModel.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) },
      },
      {
        $lookup: {
          from: "members",
          localField: "lead",
          foreignField: "_id",
          as: "lead",
        },
      },
      {
        $unwind: {
          path: "$lead",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "lead.userId",
          foreignField: "_id",
          as: "leadDetails",
        },
      },
      {
        $unwind: {
          path: "$leadDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "members",
          localField: "members",
          foreignField: "_id",
          as: "members",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "members.userId",
          foreignField: "_id",
          as: "memberDetails",
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
        $project: {
          name: 1,
          description: 1,
          startDate: 1,
          endDate: 1,
          status: 1,
          lead: {
            name: "$leadDetails.name",
            email: "$leadDetails.email",
            _id: "$leadDetails._id",
          },
          members: "$memberDetails",
          project: { name: "$project.name" },
        },
      },
    ]);
  }

  async save(message) {
    const newMessage = new messageModel(message);
    return await newMessage.save();
  }
  async update(id, module) {
    return await moduleModel.findByIdAndUpdate(id, module);
  }

  async delete(id) {
    return await moduleModel.findByIdAndDelete(id);
  }
  async findAll(queries) {
    try {
      const { groupId, timestamp, limit = 20 } = queries;
      const messages = await messageModel
        .find({
          groupId,
          timestamp: { $lt: new Date(timestamp) },
        })
        .sort({ timestamp: -1 })
        .limit(parseInt(limit));

      return messages.reverse();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = MessageRepositoryImpl;
