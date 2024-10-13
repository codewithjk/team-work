import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  unread: [],
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotification: (state, action) => {
      state.unread = [action.payload, ...state.unread];
    },
    clearNotification: (state, action) => {
      state.unread = [];
    },
  },
});

export const { setNotification, clearNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
