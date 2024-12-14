import taskApi from "../../infrastructure/api/taskApi";

class TaskService {
  async getTask(projectId) {
    const response = await taskApi.getAllTasks(projectId);
    if (response.status === 200) {
      return response.data;
    }
    throw new Error("Authentication failed");
  }
  async updateTask(taskId, data) {
    const response = await taskApi.updateTask(taskId, data);
    if (response.status === 200) {
      return response.data;
    }
    throw new Error("Authentication failed");
  }
  async deleteTask(taskId) {
    const response = await taskApi.deleteTask(taskId);
    if (response.status === 200) {
      return response.data;
    }
    throw new Error("Authentication failed");
  }
}

export default new TaskService();
