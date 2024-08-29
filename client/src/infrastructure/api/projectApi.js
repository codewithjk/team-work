import axios from "../../presentation/utils/axiosInstance";

const getProject = (id) => {
  return axios.get(`/project/${id}`);
};

const getAllProjects = () => {
  return axios.get(`/project/`);
};

const createProject = (project) => {
  return axios.post("/project/", project);
};

const updateProject = (id, project) => {
  return axios.put(`/project/${id}`, project);
};
const deleteProject = (id) => {
  return axios.delete(`/project/${id}`);
};
const verifyInvitationToken = (token) => {
  return axios.post("/project/verify", { token });
};

const addMember = (projectId, data) => {
  return axios.post(`/project/${projectId}/members`, data);
};

const projectApi = {
  getProject,
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
  verifyInvitationToken,
  addMember,
};
export default projectApi;
