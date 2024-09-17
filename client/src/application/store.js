import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import profileReducer from "./slice/profileSlice";
import chatReducer from "./slice/chatSlice";
import taskReducer from "./slice/taskSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    chat: chatReducer,
    task: taskReducer,
  },
});

export default store;
