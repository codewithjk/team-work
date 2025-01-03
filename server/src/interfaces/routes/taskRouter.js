const express = require("express");
const TaskController = require("../controllers/taskController");
const verifyProjectMember = require("../middlewares/verifyProjectMember");

const router = express.Router();

const taskController = new TaskController();

// router.use(verifyProjectMember)

router
  .route("/")
  .get(taskController.getAllTasks)
  .post(taskController.createTask);

router
  .route("/:taskId")
  .get(taskController.getTaskById)
  .put(taskController.updateTaskById)
  .delete(taskController.deleteTaskById);

module.exports = router;
