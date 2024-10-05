const mongoose = require("mongoose");
const membersModel = require("../models/membersModel");
const notificationModel = require("../models/notificationModel");

class NotificationRepositoryImpl {
  async findById(id) {
    return await notificationModel.findById(id);
  }

  async save(notification) {
    const newNotification = new notificationModel(notification);
    return await newNotification.save();
  }
  async update(id, notification) {
    return await notificationModel.findByIdAndUpdate(id, notification);
  }

  async delete(id) {
    return await notificationModel.findByIdAndDelete(id);
  }
  async findAll(queries) {
    try {
      const { search, filter, page, limit, projectIds, userId } = queries;
      // const query = { projectId: { $in: projectIds } };

      if (search) {
        query.name = { $regex: search, $options: "i" };
      }

      if (filter) {
        query.category = filter;
      }

      const totalNotifications = await notificationModel.countDocuments(query);
      const totalPages = Math.ceil(totalNotifications / limit);

      const notifications = await notificationModel
        .find(query)
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

      return { notifications, totalPages };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = NotificationRepositoryImpl;
