import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    Allprojects: []
};

const projectSlice = createSlice({
    name: "project",
    initialState,
    reducers: {
        setProjects: (state, action) => {
            state.Allprojects = action.payload
        }
    },
});

export const {
    setProjects
} = projectSlice.actions;
export default projectSlice.reducer;
