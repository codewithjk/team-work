import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profileLoading: false,
  profileData: null,
  profileError: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    profileRequest: (state, action) => {
      state.profileLoading = true;
    },
    profileSuccess: (state, action) => {
      state.profileLoading = false;
      state.profileData = action.payload.profile;
    },
    profileFail: (state, action) => {
      state.profileLoading = false;
      state.profileError = action.payload;
    },
  },
});

export const { profileSuccess, profileFail, profileRequest } =
  profileSlice.actions;
export default profileSlice.reducer;
