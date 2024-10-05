import axios from "../../presentation/utils/axiosInstance";

const getNotification = (id) => {
  return axios.get(`/notification/${id}`);
};

const getAllNotifications = () => {
  return axios.get(`/notification`);
};

const deleteNotification = (notificationId) => {
  return axios.delete(`/notification/${notificationId}`);
};

const clearAll = () => {
  return axios.delete(`/notification`);
};

const notificationApi = {
  getNotification,
  getAllNotifications,
  deleteNotification,
  clearAll,
};
export default notificationApi;
