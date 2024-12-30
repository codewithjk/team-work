import projectApi from "../../infrastructure/api/projectApi";
import { setProjects } from "../slice/projectSlice";



export const setProjcetAction = () => async (dispatch) => {
    try {
        const response = await projectApi.getAllProjects({ allProjects: true });
        const data = response.data.projects;
        dispatch(setProjects(data))
    } catch (error) {
        console.error("profile failed", error);

    }
};
