
import axios from "axios";

const baseURL = import.meta.env.VITE_BACKEND_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true, // Ensure cookies are sent with requests
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  }, // Directly return response
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status == 403) {
      window.location.href = '/error/403'
      return;
    }

    // Handle token expiration (401)
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call the refresh endpoint
        const response = await axios.post(`${baseURL}/auth/refresh`, {}, {
          withCredentials: true, // Include cookies for refresh
        });

        const accessToken = response.data.accessToken; // Use response data, not headers
        localStorage.setItem('accessToken', accessToken);

        // Retry the original request with the new access token
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
        window.location.href = '/signup';
        return Promise.reject(refreshError);
      }
    }

    // Handle payment required (402)
    // if (error.response.status === 402) {
    //   alert("Please make payment to proceed.");
    // }

    return Promise.reject(error);
  }
);

export default axiosInstance;
