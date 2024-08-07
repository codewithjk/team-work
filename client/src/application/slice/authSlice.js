// src/application/slice/authSlice.js
import { createSlice } from "@reduxjs/toolkit";
import User from "../../domain/entities/User";

const initialState = {
  user: null,
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginRequest: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.user =
        action.payload instanceof User
          ? action.payload
          : new User(
              action.payload.id,
              action.payload.email,
              action.payload.token
            );
      state.isAuthenticated = true;
      state.loading = false;
    },
    loginFail: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { loginFail, loginRequest, loginSuccess, logout } =
  authSlice.actions;
export default authSlice.reducer;
