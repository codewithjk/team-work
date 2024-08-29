import axios from "../../presentation/utils/axiosInstance";

const login = (email, password) => {
  return axios.post("/auth/login", { email, password });
};

const signup = (user) => {
  return axios.post("/auth/register", user);
};
const forgotPassword = (email) => {
  return axios.post("/auth/forgot-password", { email });
};
const resetPassword = (token, password) => {
  return axios.post(`/auth/reset-password/${token}`, { password });
};
const verifyMail = (code) => {
  console.log(code);
  return axios.post(`/auth/verify-email/`, { code });
};
const checkAuth = () => {
  return axios.post(`/auth/check-auth`, {});
};
const logout = () => {
  return axios.post(`/auth/logout`, {});
};
const resendCode = (userId) => {
  return axios.put("/auth/resend-code", { userId });
};

const authApi = {
  login,
  signup,
  forgotPassword,
  resetPassword,
  verifyMail,
  checkAuth,
  logout,
  resendCode,
};

export default authApi;
