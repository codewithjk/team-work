import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import profileReducer from "./slice/profileSlice";
import chatReducer from "./slice/chatSlice";
import taskReducer from "./slice/taskSlice";
import socketReducer from "./slice/socketSlice";
import notificationReducer from "./slice/notificationSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    chat: chatReducer,
    task: taskReducer,
    socket: socketReducer,
    notification: notificationReducer,
  },
});

export default store;
