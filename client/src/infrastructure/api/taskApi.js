import axios from "../../presentation/utils/axiosInstance";

const getTask = (id) => {
  return axios.get(`/task/${id}`);
};

const getAllTasks = (projectId) => {
  return axios.get(`/task?projectId=${projectId}`);
};

const createTask = (projectId, task) => {
  return axios.post(`/task?projectId=${projectId}`, task);
};

const updateTask = (id, task) => {
  return axios.put(`/task/${id}`, task);
};

const deleteTask = (id) => {
  return axios.delete(`/task/${id}`);
};

const taskApi = {
  getTask,
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
};
export default taskApi;
