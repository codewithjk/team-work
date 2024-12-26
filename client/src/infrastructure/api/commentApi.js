import axios from "../../presentation/utils/axiosInstance";

const getComment = (id) => {
    return axios.get(`/comment/${id}`);
};

const getAllComments = (taskId) => {
    return axios.get(`/comment?taskId=${taskId}`);
};

const createComment = (taskId, comment) => {
    return axios.post(`/comment?taskId=${taskId}`, comment);
};

const updateComment = (id, comment) => {
    return axios.put(`/comment/${id}`, comment);
};

const deleteComment = (id) => {
    return axios.delete(`/comment/${id}`);
};

const commentApi = {
    getComment,
    getAllComments,
    createComment,
    updateComment,
    deleteComment,
};
export default commentApi;
