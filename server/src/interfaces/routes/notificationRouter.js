const express = require("express");
const NotificationController = require("../controllers/notificationController");

const router = express.Router();

const notificationController = new NotificationController();

router
  .route("/")
  .get(notificationController.getAllNotifications)
  .delete(notificationController.clearAll);

router
  .route("/:notificationId")
  .get(notificationController.getNotificationById)
  .put(notificationController.updateNotificationById)
  .delete(notificationController.deleteNotificationById);

module.exports = router;
