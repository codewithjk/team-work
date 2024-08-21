import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  isCheckingAuth: null,
  message: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginRequest: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.loading = false;
      state.message = action.payload.message;
    },
    loginFail: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    forgotPasswordRequest: (state) => {
      state.loading = true;
    },
    forgotPasswordSuccess: (state, action) => {
      state.loading = false;
    },
    forgotPasswordFail: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    signupRequest: (state) => {
      state.loading = true;
    },
    signupSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    signupFail: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    resetPasswordRequest: (state) => {
      state.loading = true;
    },
    resetPasswordSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload;
    },
    resetPasswordFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    verifyMailRequest: (state) => {
      state.loading = true;
    },
    verifyMailSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    verifyMailFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    checkAuthRequest: (state) => {
      state.loading = true;
    },
    checkAuthSuccess: (state, action) => {
      state.user = action.payload.user;
      state.loading = false;
      state.isAuthenticated = true;
    },
    checkAuthFail: (state, action) => {
      state.loading = false;
    },
    logoutRequest: (state) => {
      state.loading = true;
    },
    logoutSuccess: (state, action) => {
      state.user = null;
      state.loading = false;
      state.isAuthenticated = false;
      state.message = action.payload.message;
    },
    logoutFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  loginFail,
  loginRequest,
  loginSuccess,
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
} = authSlice.actions;
export default authSlice.reducer;
