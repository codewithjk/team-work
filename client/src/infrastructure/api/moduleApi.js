import axios from "../../presentation/utils/axiosInstance";

const getModule = (id) => {
  return axios.get(`/module/${id}`);
};

const getAllModules = (projectId) => {
  return axios.get(`/module?projectId=${projectId}`);
};

const createModule = (projectId, module) => {
  return axios.post(`/module?projectId=${projectId}`, module);
};

const updateModule = (id, module) => {
  return axios.put(`/module/${id}`, module);
};
const deleteModule = (id) => {
  return axios.delete(`/module/${id}`);
};

const moduleApi = {
  getModule,
  getAllModules,
  createModule,
  updateModule,
  deleteModule,
};
export default moduleApi;
