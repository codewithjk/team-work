import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import profileReducer from "./slice/profileSlice";
import chatReducer from "./slice/chatSlice";
import taskReducer from "./slice/taskSlice";
import socketReducer from "./slice/socketSlice";
import notificationReducer from "./slice/notificationSlice";
import projectReducer from "./slice/projectSlice";


import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedReducer,
    profile: profileReducer,
    chat: chatReducer,
    task: taskReducer,
    socket: socketReducer,
    notification: notificationReducer,
    project: projectReducer
  },
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);
