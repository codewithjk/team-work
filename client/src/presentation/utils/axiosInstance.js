
import axios from "axios";

const baseURL = import.meta.env.VITE_BACKEND_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true, // Ensure cookies are sent with requests
});

// Token refresh state management
let isRefreshing = false;
let refreshSubscribers = [];

const onAccessTokenFetched = (accessToken) => {
  refreshSubscribers.forEach((callback) => callback(accessToken));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback) => {
  refreshSubscribers.push(callback);
};

// Request interceptor to add Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => response, // Directly return successful responses
  async (error) => {
    const originalRequest = error.config;

    // Handle forbidden error (403)
    if (error.response.status === 403) {
      window.location.href = "/error/403";
      return Promise.reject(error);
    }

    // Handle unauthorized error (401) and retry logic
    // if (error.response.status === 401 && !originalRequest._retry) {
    //   originalRequest._retry = true;

    //   if (isRefreshing) {
    //     // If a refresh is already in progress, queue the request
    //     return new Promise((resolve, reject) => {
    //       addRefreshSubscriber((newAccessToken) => {
    //         originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
    //         axiosInstance(originalRequest)
    //           .then(resolve) // Pass the retried response to resolve
    //           .catch(reject); // Pass the retried error to reject
    //       });
    //     });
    //   }

    //   isRefreshing = true;

    //   try {
    //     // Call the refresh token endpoint
    //     const response = await axios.post(`${baseURL}/auth/refresh`, {}, {
    //       withCredentials: true, // Include cookies for refresh
    //     });

    //     const newAccessToken = response.data.accessToken; // Fetch the new token
    //     localStorage.setItem("accessToken", newAccessToken);

    //     // Notify all subscribers about the new token
    //     onAccessTokenFetched(newAccessToken);

    //     isRefreshing = false;

    //     // Retry the original request with the new access token
    //     originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
    //     return axiosInstance(originalRequest);
    //   } catch (refreshError) {
    //     isRefreshing = false;
    //     console.error("Error refreshing token:", refreshError);
    //     window.location.href = "/login"; // Redirect to signup on failure
    //     return Promise.reject(refreshError);
    //   }
    // }

    return Promise.reject(error); // Propagate other errors
  }
);

export default axiosInstance;
