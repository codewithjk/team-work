const {
  CreateTask,
  UpdateTask,
  ListAllTask,
} = require("../../application/use-cases/task-use-cases");
const {
  CreateNotification,
} = require("../../application/use-cases/notification-use-cases");
const NotifyUser = require("../../application/use-cases/notification-use-cases/NotifyUser");
const ListAllMembers = require("../../application/use-cases/project-use-cases/ListAllMembers");
const TaskRepositoryImpl = require("../../infrastructure/database/repositories/taskRepositoryImpl");
const NotificationRepositoryImpl = require("../../infrastructure/database/repositories/notificationRepositoryImpl");
const ProjectRepositoryImpl = require("../../infrastructure/database/repositories/projectRepositoryImpl");
const UserNotificationRepositoryImpl = require("../../infrastructure/database/repositories/userNotificationRepositoryImpl");
const { SocketMap } = require("../../shared/constants/constants");

// task
const taskRepository = new TaskRepositoryImpl();
const createTaskUseCase = new CreateTask(taskRepository);
const updateTaskUseCase = new UpdateTask(taskRepository);
const listAllTasksUseCase = new ListAllTask(taskRepository);

// notification
const notificationRepository = new NotificationRepositoryImpl();
const createNotificationUseCase = new CreateNotification(
  notificationRepository
);

const userNotificationRepository = new UserNotificationRepositoryImpl();
const notifyUserUseCase = new NotifyUser(userNotificationRepository);

// get members
const projectRepository = new ProjectRepositoryImpl();
const listAllMembersUseCase = new ListAllMembers(projectRepository);

const taskSocketHandler = (io, socket) => {
  socket.on("createTask", async ({ projectId, task }) => {
    try {
      console.log(task, projectId);
      const taskData = {
        projectId,
        ...task,
        timestamp: new Date(),
      };

      const newTask = await createTaskUseCase.execute(taskData);

      let notification = {
        type: "taskCreated",
        title: `${task.creatorName} created a task`,
        message: newTask.title,
      };

      const newNotification = await createNotificationUseCase.execute(
        notification
      );

      const allMembers = await listAllMembersUseCase.execute({
        projectId,
      });

      console.log("members = ", allMembers);
      console.log("creator = ", task.creatorId);
      const memberIds = allMembers
        .filter(
          (member) => member.user._id != task.creatorId // Exclude the task creator
        )
        .map((member) => member.user._id);

      await notifyUserUseCase.execute(memberIds, newNotification._id);

      // Notify connected members
      console.log(memberIds);

      memberIds.forEach((memberId) => {
        const mId = memberId.toString();
        const socketId = SocketMap.get(mId);

        if (socketId && socketId !== undefined) {
          console.log("loop ==", socketId);

          io.to(socketId).emit("receiveNotification", notification); // Send notification via socket
        }
      });

      io.to(projectId).emit("receiveTask", newTask);
    } catch (error) {
      console.log("task creation error = >", error);

      socket.emit("error", { message: "Failed to create task" });
    }
  });

  socket.on("updateTask", async ({ projectId, taskId, state }) => {
    try {
      console.log(`Task ${taskId} updated in project ${projectId} < ${state}`);
      //   const taskData = {
      //     ...updatedTask,
      //     timestamp: new Date(),
      //   };

      //   const updatedTaskData = await updateTaskUseCase.execute({
      //     taskId,
      //     taskData,
      //   });

      //   let notification = {
      //     type: "taskUpdated",
      //     title: `${updatedTask.updaterName} updated a task`,
      //     message: updatedTaskData.title,
      //   };

      //   const newNotification = await createNotificationUseCase.execute(
      //     notification
      //   );

      //   const allMembers = await listAllMembersUseCase.execute({
      //     projectId,
      //   });

      //   const memberIds = allMembers
      //     .filter(
      //       (member) => member.user._id != updatedTask.updaterId // Exclude the user who updated the task
      //     )
      //     .map((member) => member.user._id);

      //   await notifyUserUseCase.execute(memberIds, newNotification._id);

      //   // Notify connected members
      //   console.log(memberIds);

      //   memberIds.forEach((memberId) => {
      //     const mId = memberId.toString();
      //     const socketId = SocketMap.get(mId);

      //     if (socketId && socketId !== undefined) {
      //       console.log("loop ==", socketId);

      //       io.to(socketId).emit("receiveNotification", notification); // Send notification via socket
      //     }
      //   });

      io.to(projectId).emit("receiveUpdatedTask", { state });
    } catch (error) {
      console.log("task update error = >", error);

      socket.emit("error", { message: "Failed to update task" });
    }
  });
};

const getAllTasks = async (req, res) => {
  try {
    const { projectId, timestamp } = req.query;
    const tasks = await listAllTasksUseCase.execute({
      projectId,
      timestamp,
    });

    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAllTasks, taskSocketHandler };
