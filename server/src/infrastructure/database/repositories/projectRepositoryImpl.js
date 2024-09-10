const mongoose = require("mongoose");
const ProjectRepository = require("../../../domain/repositories/projectRepository");
const membersModel = require("../models/membersModel");
const projectModel = require("../models/projectModel");

class ProjectRepositoryImpl extends ProjectRepository {
  async findById(id) {
    return await projectModel.findById(id);
  }

  async findByOwnerId(ownerId) {
    return await projectModel.find({ ownerId });
  }

  async save(project) {
    const newProject = new projectModel(project);
    return await newProject.save();
  }
  async update(id, project) {
    return await projectModel.findByIdAndUpdate(id, project);
  }

  async delete(id) {
    return await projectModel.findByIdAndDelete(id);
  }
  async findAll(queries) {
    try {
      const { search, filter, page, limit, ownerId } = queries;
      const query = { ownerId };

      if (search) {
        query.name = { $regex: search, $options: "i" }; // Search by project name
      }

      if (filter) {
        query.category = filter; // Assuming projects have a 'category' field
      }

      const totalProjects = await projectModel.countDocuments(query);
      const totalPages = Math.ceil(totalProjects / limit);

      const projects = await projectModel
        .find(query)
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
      return { projects, totalPages };
    } catch (error) {
      throw error;
    }
  }

  async addMember({ email, projectId, inviteToken, role }) {
    try {
      const inviteTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000;
      const newMember = new membersModel({
        email,
        projectId,
        inviteToken,
        inviteTokenExpiresAt,
        role,
      });
      return await newMember.save();
    } catch (error) {
      throw error;
    }
  }
  async verifyMember({ token, userId }) {
    try {
      const member = await membersModel.findOne({
        inviteToken: token,
        inviteTokenExpiresAt: { $gt: Date.now() },
      });
      if (member) {
        member.userId = userId;
        member.status = "active";
        member.inviteToken = undefined;
        member.inviteTokenExpiresAt = undefined;
        return await member.save();
      } else {
        throw new Error("token is invalid");
      }
    } catch (error) {
      throw error;
    }
  }
  async getMembersByProjectId(projectId) {
    try {
      const members = await membersModel.aggregate([
        { $match: { projectId: new mongoose.Types.ObjectId(projectId) } }, // Match members by projectId
        {
          $lookup: {
            from: "users", // The name of the collection for users
            localField: "userId",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        {
          $unwind: "$userDetails", // Flatten the userDetails array
        },
        {
          $project: {
            email: 1,
            status: 1,
            role: 1,
            user: {
              name: "$userDetails.name",
              email: "$userDetails.email",
              avatar: "$userDetails.avatar",
            },
          },
        },
      ]);

      return members;
    } catch (error) {
      console.error("Error fetching members:", error);
      throw error;
    }
  }
}

module.exports = ProjectRepositoryImpl;
