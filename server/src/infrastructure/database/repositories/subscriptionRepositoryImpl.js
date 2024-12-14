const mongoose = require("mongoose");
const membersModel = require("../models/membersModel");
const subscriptionModel = require("../models/subscriptionModel");

class SubscriptionRepositoryImpl {
  async findById(id) {
    return await subscriptionModel.aggregate([
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
  async findOne(query) {
    return await subscriptionModel.findOne(query)
  }

  async save(subscription) {
    const newSubscription = new subscriptionModel(subscription);
    return await newSubscription.save();
  }
  async update(query, subscription, options) {
    return await subscriptionModel.findOneAndUpdate(
      query,
      subscription,
      options
    );
  }
  async delete(id) {
    return await subscriptionModel.findByIdAndDelete(id);
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

      const totalSubscriptions = await subscriptionModel.countDocuments(query);
      const totalPages = Math.ceil(totalSubscriptions / limit);

      const subscriptions = await subscriptionModel
        .find(query)
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

      return { subscriptions, totalPages };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = SubscriptionRepositoryImpl;
