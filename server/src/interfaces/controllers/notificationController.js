const {
  CreateNotification,
  ListAllNotification,
  GetNotification,
  UpdateNotification,
  DeleteNotification,
} = require("../../application/use-cases/notification-use-cases");
const ClearAllNotification = require("../../application/use-cases/notification-use-cases/ClearAllNotification");
const {
  ListAllProject,
} = require("../../application/use-cases/project-use-cases");

const ProjectRepositoryImpl = require("../../infrastructure/database/repositories/projectRepositoryImpl");
const UserNotificationRepositoryImpl = require("../../infrastructure/database/repositories/userNotificationRepositoryImpl");

// projects
const projectRepository = new ProjectRepositoryImpl();
const listAllProjectUseCase = new ListAllProject(projectRepository);

const userNotificationRepository = new UserNotificationRepositoryImpl();

const listAllNotificationUseCase = new ListAllNotification(
  userNotificationRepository
);
const getNotificationUsecase = new GetNotification(userNotificationRepository);

const deleteNotificationUsecase = new DeleteNotification(
  userNotificationRepository
);

const clearAllNotificationUsecase = new ClearAllNotification(
  userNotificationRepository
);

class NotificationController {
  async getAllNotifications(req, res) {
    try {
      const userId = req.userId;
      const projectData = await listAllProjectUseCase.execute({
        filter: "true",
        ownerId: userId,
      });
      const projects = projectData.projects;
      const projectIds = projects.map((pro) => pro._id);
      console.log(projectIds, userId)

      const { search, filter, page = 1, limit = 10 } = req.query;
      const { notifications, totalPages } = await listAllNotificationUseCase.execute({
        search,
        filter,
        page,
        limit,
        projectIds,
        userId,
      });



      res.status(200).json({
        notifications,
        totalPages,
        currentPage: parseInt(page),
      });
    } catch (error) {
      res.status(500).json({
        error: "Failed to fetch notifications",
        message: error.message,
      });
    }
  }

  async getNotificationById(req, res) {
    try {
      const id = req.params.notificationId;
      const notification = await getNotificationUsecase.execute(id);
      res.status(200).json({ message: "successful", notification });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateNotificationById(req, res) {
    try {
      const notification = req.body;
      const id = req.params.notificationId;
      await updateNotificationUsecase.execute(id, notification);
      res.status(200).json({ message: "successful", notification });
    } catch (error) {
      res.status(500).json({
        error: "Failed to update notification",
        message: error.message,
      });
    }
  }
  async deleteNotificationById(req, res) {
    try {
      const id = req.params.notificationId;
      await deleteNotificationUsecase.execute(id);
      res.status(200).json({ message: "successful" });
    } catch (error) {
      res.status(500).json({
        error: "Failed to delete notification",
        message: error.message,
      });
    }
  }

  async clearAll(req, res) {
    const userId = req.userId;
    try {
      await clearAllNotificationUsecase.execute(userId);
      res.status(200).json({ message: "successful" });
    } catch (error) {
      res.status(500).json({
        error: "Failed to delete notification",
        message: error.message,
      });
    }
  }
}

module.exports = NotificationController;
