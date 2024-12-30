
const {
  CreateTask,
  ListAllTask,
  GetTask,
  UpdateTask,
  DeleteTask,
  GetAllTasksByUserId,
} = require("../../application/use-cases/task-use-cases");
const membersModel = require("../../infrastructure/database/models/membersModel");
const userModel = require("../../infrastructure/database/models/userModel");
const TaskRepositoryImpl = require("../../infrastructure/database/repositories/taskRepositoryImpl");
const convertToHumanReadableDate = require("../../shared/utils/convertDateToReadbel");

const pulse = require("../../shared/utils/pulseCron")


const taskRepository = new TaskRepositoryImpl();

const creatTaskUseCase = new CreateTask(taskRepository);
const listAllTaskUseCase = new ListAllTask(taskRepository);
const getTaskUsecase = new GetTask(taskRepository);
const updateTaskUsecase = new UpdateTask(taskRepository);
const deleteTaskUsecase = new DeleteTask(taskRepository);
const getAllTaskByUserIdUsecase = new GetAllTasksByUserId(taskRepository);

class TaskController {
  async createTask(req, res) {
    try {
      const { projectId } = req.query;
      const createdBy = req.userId;
      const newTask = await creatTaskUseCase.execute({
        projectId,
        ...req.body,
        createdBy,
      });
      // create a cron job
      await pulse.start();
      const { assignees, endDate } = newTask;
      const memberId = assignees[0];
      const { userId } = await membersModel.findById(memberId)
      const assignedUser = await userModel.findById(userId);
      const email = assignedUser.email;
      const name = assignedUser.name;
      const taskName = newTask.name;
      const taskEndIn = convertToHumanReadableDate(endDate);
      const scheduleTime = new Date(endDate.getTime() - 24 * 60 * 60 * 1000);
      const job = pulse.create('send email', { email, name, taskName, taskEndIn });
      await job.schedule(new Date(scheduleTime)).save();
      res.status(200).json({ message: "successful", task: newTask });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  async getAllTasks(req, res) {
    try {
      const { search, filter, page = 1, limit = 10, projectId } = req.query;
      if (projectId !== "undefined") {
        const { tasks, totalPages } = await listAllTaskUseCase.execute({
          search,
          filter,
          page,
          limit,
          projectId,
        });
        res.status(200).json({
          tasks,
          totalPages,
          currentPage: parseInt(page),
        });
      } else {
        const userId = req.userId;

        let result = await getAllTaskByUserIdUsecase.execute(userId);

        res.status(200).json({
          ...result,
        });
      }
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to fetch tasks", message: error.message });
    }
  }
  async getTaskById(req, res) {
    try {
      const id = req.params.taskId;
      const task = await getTaskUsecase.execute(id);
      res.status(200).json({ message: "successful", task });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateTaskById(req, res) {
    try {
      const task = req.body;
      const id = req.params.taskId;
      const updatedTask = await updateTaskUsecase.execute(id, task);
      await pulse.start();
      const { assignees, endDate } = updatedTask;
      const memberId = assignees[0];
      const { userId } = await membersModel.findById(memberId)
      const assignedUser = await userModel.findById(userId);
      const email = assignedUser.email;
      const name = assignedUser.name;
      const taskName = updatedTask.name;
      const taskEndIn = convertToHumanReadableDate(endDate);
      const scheduleTime = new Date(endDate.getTime() - 24 * 60 * 60 * 1000);
      const job = pulse.create('send email', { email, name, taskName, taskEndIn });
      await job.schedule(new Date(scheduleTime)).save();
      res.status(200).json({ message: "successful", updatedTask });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to update task", message: error.message });
    }
  }
  async deleteTaskById(req, res) {
    try {
      const id = req.params.taskId;
      await deleteTaskUsecase.execute(id);
      res.status(200).json({ message: "successful" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to delete task", message: error.message });
    }
  }
}

module.exports = TaskController;
