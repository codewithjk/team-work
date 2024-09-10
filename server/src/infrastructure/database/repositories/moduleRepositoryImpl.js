const mongoose = require("mongoose");
const membersModel = require("../models/membersModel");
const moduleModel = require("../models/moduleModel");

class ModuleRepositoryImpl {
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

  async save(module) {
    const newModule = new moduleModel(module);
    return await newModule.save();
  }
  async update(id, module) {
    return await moduleModel.findByIdAndUpdate(id, module);
  }

  async delete(id) {
    return await moduleModel.findByIdAndDelete(id);
  }
  async findAll(queries) {
    try {
      const { search, filter, page, limit, projectId } = queries;
      const query = { projectId };

      if (search) {
        query.name = { $regex: search, $options: "i" };
      }

      if (filter) {
        query.category = filter;
      }

      const totalProjects = await moduleModel.countDocuments(query);
      const totalPages = Math.ceil(totalProjects / limit);

      const modules = await moduleModel
        .find(query)
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
      return { modules, totalPages };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ModuleRepositoryImpl;
