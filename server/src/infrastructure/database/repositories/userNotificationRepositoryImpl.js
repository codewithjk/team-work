const mongoose = require("mongoose");
const membersModel = require("../models/membersModel");
const userNotificationModel = require("../models/userNotificationModel");

class UserNotificationRepositoryImpl {
  async findById(id) {
    return await userNotificationModel.findById(id);
  }

  async save(userNotifications) {
    // const newUserNotification = new userNotificationModel(userNotification);
    // return await newUserNotification.save();
    return await userNotificationModel.insertMany(userNotifications);
  }
  async update(id, userNotification) {
    return await userNotificationModel.findByIdAndUpdate(id, userNotification);
  }

  async delete(id) {
    return await userNotificationModel.findByIdAndDelete(id);
  }
  async findAll(queries) {
    try {
      const { search, filter, page, limit, projectIds, userId } = queries;
      // const query = { projectId: { $in: projectIds } };
      const query = { user: userId };

      if (search) {
        query.name = { $regex: search, $options: "i" };
      }

      if (filter) {
        query.category = filter;
      }

      const totalUserNotifications = await userNotificationModel.countDocuments(
        query
      );
      const totalPages = Math.ceil(totalUserNotifications / limit);

      const notifications = await userNotificationModel
        .find(query)
        .sort({ createdAt: -1 }) // Sorting by createdAt in descending order
        .populate("notification")
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

      return { notifications, totalPages };
    } catch (error) {
      throw error;
    }
  }
  async clearAll(userId) {
    return await userNotificationModel.deleteMany({ user: userId });
  }
}

module.exports = UserNotificationRepositoryImpl;
