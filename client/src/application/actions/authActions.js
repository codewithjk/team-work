import {
  loginRequest,
  loginSuccess,
  loginFail,
  logout as logoutAction,
} from "../slice/authSlice";
import AuthService from "../services/AuthService";

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch(loginRequest());
    const user = await AuthService.authenticateUser(email, password);
    dispatch(loginSuccess(user));
  } catch (error) {
    console.error("Login failed", error);
    dispatch(loginFail(error?.response?.data?.error || error.message)); // TODO : display exact error from response
  }
};

export const signup = (data) => (dispatch) => {
  try {
    dispatch(signupRequest());
    const user = awaitAuthService.createUser(data);
  } catch (error) {}
};

export const logout = () => (dispatch) => {
  localStorage.removeItem("token"); // Remove token from local storage
  dispatch(logoutAction());
};
