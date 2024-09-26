import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  connected: false,
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    socketConnected: (state) => {
      state.connected = true;
    },
    socketDisconnected: (state) => {
      state.connected = false;
    },
  },
});

export const { socketConnected, socketDisconnected } = socketSlice.actions;
export default socketSlice.reducer;
