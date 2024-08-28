import axios from "../../presentation/utils/axiosInstance";

const getProfile = (id) => {
  return axios.get(`/profile/${id}`);
};

const profileApi = {
  getProfile,
};
export default profileApi;
