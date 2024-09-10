import axios from "../../presentation/utils/axiosInstance";

const getProfile = (id) => {
  return axios.get(`/profile/${id}`);
};
const updateProfile = (data) => {
  return axios.put(`/profile`, data);
};

const profileApi = {
  getProfile,
  updateProfile,
};
export default profileApi;
