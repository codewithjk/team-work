import axios from "../../presentation/utils/axiosInstance";

const getChat = (id) => {
  return axios.get(`/chat/${id}`);
};

const getAllChats = (groupId, timestamp) => {
  console.log(groupId, timestamp);

  return axios.get(`/chat`, {
    params: {
      groupId,
      timestamp,
    },
  });
};

const createChat = (projectId, chat) => {
  return axios.post(`/chat?projectId=${projectId}`, chat);
};

const updateChat = (id, chat) => {
  return axios.put(`/chat/${id}`, chat);
};

const deleteChat = (id) => {
  return axios.delete(`/chat/${id}`);
};

const chatApi = {
  getChat,
  getAllChats,
  createChat,
  updateChat,
  deleteChat,
};
export default chatApi;
