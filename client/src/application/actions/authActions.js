import {
  loginRequest,
  loginSuccess,
  loginFail,
  forgotPasswordRequest,
  forgotPasswordSuccess,
  forgotPasswordFail,
  resetPasswordRequest,
  resetPasswordSuccess,
  resetPasswordFail,
  verifyMailRequest,
  verifyMailSuccess,
  verifyMailFail,
  signupRequest,
  signupSuccess,
  signupFail,
  checkAuthSuccess,
  checkAuthFail,
  checkAuthRequest,
  logoutSuccess,
  logoutFail,
  logoutRequest,
  resendSuccess,
  resendFail,
  resendRequest,
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

export const signup = (data) => async (dispatch) => {
  try {
    dispatch(signupRequest());
    const user = await AuthService.createUser(data);
    dispatch(signupSuccess(user));
  } catch (error) {
    dispatch(signupFail(error?.response?.data?.error || error.message));
  }
};

export const forgotPassword = (email) => async (dispatch) => {
  try {
    dispatch(forgotPasswordRequest());
    const data = await AuthService.forgotPassword(email);
    dispatch(forgotPasswordSuccess(data));
  } catch (error) {
    dispatch(forgotPasswordFail(error?.response?.data?.error || error.message));
  }
};
export const resetPassword = (token, password) => async (dispatch) => {
  try {
    dispatch(resetPasswordRequest());
    const data = await AuthService.resetPassword(token, password);
    dispatch(resetPasswordSuccess(data.message));
  } catch (error) {
    dispatch(resetPasswordFail(error?.response?.data?.error || error.message));
  }
};
export const verifyMail = (code) => async (dispatch) => {
  try {
    dispatch(verifyMailRequest());
    const data = await AuthService.verifyMail(code);
    dispatch(verifyMailSuccess(data));
  } catch (error) {
    dispatch(verifyMailFail(error?.response?.data?.error || error.message));
  }
};

export const checkAuth = () => async (dispatch) => {
  try {
    dispatch(checkAuthRequest());
    const data = await AuthService.checkAuth();
    dispatch(checkAuthSuccess(data));
  } catch (error) {
    console.log("check auth action : ", error);
    dispatch(checkAuthFail(error?.response?.data?.error || error.message));
  }
};

export const logout = () => async (dispatch) => {
  try {
    dispatch(logoutRequest());
    const data = await AuthService.logout();
    dispatch(logoutSuccess(data));
  } catch (error) {
    dispatch(logoutFail(error?.response?.data?.error || error.message));
  }
};

export const resendVerificationCode = (id) => async (dispatch) => {
  try {
    dispatch(resendRequest());
    const data = await AuthService.resendCode(id);
    dispatch(resendSuccess(data.user));
  } catch (error) {
    dispatch(resendFail(error?.response?.data?.error || error.message));
  }
};
