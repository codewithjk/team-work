import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  taskLoading: false,
  tasks: [],
  taskError: null,
  currentTask: null,
};

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    tasksRequest: (state, action) => {
      state.taskLoading = true;
    },
    tasksSuccess: (state, action) => {
      state.taskLoading = false;
      state.tasks = action.payload.tasks;
    },
    tasksFail: (state, action) => {
      state.taskLoading = false;
      state.taskError = action.payload;
    },
    updateTasksRequest: (state, action) => {
      state.taskLoading = true;
    },
    updateTasksSuccess: (state, action) => {
      state.taskLoading = false;
      const updatedTask = action.payload.updatedTask;
      const index = state.tasks.findIndex(
        (task) => task._id === updatedTask._id
      );
      if (index !== -1) {
        state.tasks[index] = updatedTask;
      }
    },
    updateTasksFail: (state, action) => {
      state.taskLoading = false;
      state.taskError = action.payload;
    },
    deleteTasksRequest: (state) => {
      state.taskLoading = true;
    },
    deleteTasksSuccess: (state, action) => {
      state.taskLoading = false;
      const deletedTaskId = action.payload;
      state.tasks = state.tasks.filter((task) => task._id !== deletedTaskId);
    },
    deleteTasksFail: (state, action) => {
      state.taskLoading = false;
      state.taskError = action.payload;
    },

    // method to set current task
    setCurrentTask: (state, action) => {
      state.currentTask = action.payload;
    },
  },
});

export const {
  tasksSuccess,
  tasksFail,
  tasksRequest,
  updateTasksSuccess,
  updateTasksFail,
  updateTasksRequest,
  deleteTasksSuccess,
  deleteTasksFail,
  deleteTasksRequest,
  setCurrentTask,
} = taskSlice.actions;
export default taskSlice.reducer;
