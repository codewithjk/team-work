import axios from "../../presentation/utils/axiosInstance";

const getMeeting = (id) => {
  return axios.get(`/meeting/${id}`);
};

const getAllMeetings = () => {
  return axios.get(`/meeting`);
};

const createMeeting = (meeting) => {
  return axios.post(`/meeting`, meeting);
};

const updateMeeting = (id, meeting) => {
  return axios.put(`/meeting/${id}`, meeting);
};
const deleteMeeting = (id) => {
  return axios.delete(`/meeting/${id}`);
};

const meetingApi = {
  getMeeting,
  getAllMeetings,
  createMeeting,
  updateMeeting,
  deleteMeeting,
};
export default meetingApi;
