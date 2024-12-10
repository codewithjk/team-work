import axios from "axios";

const baseURL = import.meta.env.VITE_BACKEND_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,  // Ensure credentials (cookies) are sent with requests
});


axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    console.log(accessToken)
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  
  (response) => {
console.log(response)
   return response
  },
  
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;  

      try {
        const response = await axios.post(`${baseURL}/refresh`, {}, {
          withCredentials: true, 
        });
        const  accessToken  = response.headers['AccessToken'];
        localStorage.setItem('accessToken', accessToken);
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
        // Optionally, handle logout or redirect to login page if refresh fails
        // window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
