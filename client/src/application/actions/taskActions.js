import { data } from "autoprefixer";
import TaskService from "../services/TaskService";
import {
  tasksFail,
  tasksRequest,
  tasksSuccess,
  updateTasksSuccess,
  updateTasksFail,
  updateTasksRequest,
  deleteTasksSuccess,
  deleteTasksFail,
  deleteTasksRequest,
} from "../slice/taskSlice";

export const getTasks = (id) => async (dispatch) => {
  try {
    dispatch(tasksRequest());
    const tasks = await TaskService.getTask(id);
    dispatch(tasksSuccess(tasks));
  } catch (error) {
    console.error("task failed", error);
    dispatch(tasksFail(error?.response?.data?.error || error.message));
  }
};

export const updateTask = (taskId, data) => async (dispatch) => {
  try {
    dispatch(updateTasksRequest());
    const task = await TaskService.updateTask(taskId, data);

    dispatch(updateTasksSuccess(task));
  } catch (error) {
    console.error("task update failed", error);
    dispatch(updateTasksFail(error?.response?.data?.error || error.message));
  }
};

export const deleteTask = (taskId) => async (dispatch) => {
  try {
    dispatch(deleteTasksRequest());
    const task = await TaskService.deleteTask(taskId);
    dispatch(deleteTasksSuccess(taskId));
  } catch (error) {
    console.error("task delete failed", error);
    dispatch(deleteTasksFail(error?.response?.data?.error || error.message));
  }
};
