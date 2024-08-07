import axios from "../../presentation/utils/axiosInstance";

const login = (email, password) => {
  return axios.post("/auth/login", { email, password });
};

const authApi = {
  login,
};

export default authApi;
