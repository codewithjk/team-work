const mongoose = require("mongoose");
const membersModel = require("../models/membersModel");
const meetingModel = require("../models/meetingModel");

class MeetingRepositoryImpl {
  async findById(id) {
    return await meetingModel.aggregate([
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

  async save(meeting) {
    const newMeeting = new meetingModel(meeting);
    return await newMeeting.save();
  }
  async update(id, meeting) {
    return await meetingModel.findByIdAndUpdate(id, meeting);
  }

  async delete(id) {
    return await meetingModel.findByIdAndDelete(id);
  }
  async findAll(queries) {
    try {
      const { search, filter, page, limit, projectIds } = queries;
      const query = { projectId: { $in: projectIds } };

      if (search) {
        query.name = { $regex: search, $options: "i" };
      }

      if (filter) {
        query.category = filter;
      }

      const totalMeetings = await meetingModel.countDocuments(query);
      const totalPages = Math.ceil(totalMeetings / limit);

      const meetings = await meetingModel
        .find(query)
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

      return { meetings, totalPages };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = MeetingRepositoryImpl;
