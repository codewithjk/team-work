import ProfileService from "../services/ProfileService";
import {
  profileFail,
  profileRequest,
  profileSuccess,
} from "../slice/profileSlice";

export const getProfile = (id) => async (dispatch) => {
  try {
    console.log("getting profile....");
    dispatch(profileRequest());
    const user = await ProfileService.getProfile(id);
    console.log("profile ", user);
    dispatch(profileSuccess(user));
  } catch (error) {
    console.error("profile failed", error);
    dispatch(profileFail(error?.response?.data?.error || error.message)); // TODO : display exact error from response
  }
};
