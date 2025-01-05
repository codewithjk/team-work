import axios from "axios";

const baseURL = import.meta.env.VITE_BACKEND_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true, // Include cookies with requests
});

// Request interceptor: Attach Authorization token to headers
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

// Response interceptor: Handle token expiration and retry requests
axiosInstance.interceptors.response.use(
  (response) => response, // Return successful response directly
  async (error) => {
    console.log("this is from interceptor : ", error);

    const originalRequest = error.config;

    // if (error.response.status === 403) {
    //   // Forbidden error, redirect to error page
    //   window.location.href = "/error/403";
    //   return Promise.reject(error);
    // }

    if (error.response.status === 401 && !originalRequest._retry) {
      // Handle Unauthorized error (Token expired)
      console.log("this is endter to 401");

      originalRequest._retry = true;

      try {
        // Attempt to refresh the access token
        console.log("Attempting refresh");

        const response = await axios.post(`${baseURL}/auth/refresh`, {}, {
          withCredentials: true,
        });

        const newAccessToken = response.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

        // Retry the original request with the new token
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        console.log("retrying with original request")
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Error refreshing token:", refreshError);
        // window.location.href = "/login"; // Redirect to login page on failure
        return Promise.reject(refreshError);
      }
    }

    // If the error is not 401 or 403, reject the promise
    return Promise.reject(error);
  }
);

export default axiosInstance;
