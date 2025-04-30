import axios, { AxiosError, AxiosRequestConfig } from "axios";

// Create axios instance
const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for CORS with credentials
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      // Ensure headers object exists
      config.headers = config.headers || {};

      // Set Authorization header with Bearer token
      config.headers.Authorization = `Bearer ${token}`;

      console.log(
        `API Request to ${config.url} with token: ${token.substring(0, 10)}...`
      );
    } else {
      console.warn(`API Request to ${config.url} without authentication token`);
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // Only attempt to refresh token if we get a 401 and haven't tried already
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log("Received 401, attempting to refresh token");
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");

      // Only attempt refresh if we have a refresh token
      if (refreshToken) {
        try {
          console.log("Refreshing token with refresh token");
          const response = await axios.post(
            `${
              import.meta.env.VITE_API_URL || "http://localhost:3000"
            }/auth/refresh`,
            { refreshToken },
            {
              headers: { "Content-Type": "application/json" },
            }
          );

          const { access_token } = response.data;
          console.log("Token refresh successful, got new access token");

          // Store the new token
          localStorage.setItem("accessToken", access_token);

          // Update default headers
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${access_token}`;

          // Update the original request headers
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
          }

          // Retry the original request with the new token
          console.log("Retrying original request with new token");
          return api(originalRequest);
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);

          // If refresh token fails, clear tokens but don't redirect automatically
          // This prevents redirect loops
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");

          // Only redirect if we're not already on the login page
          if (!window.location.pathname.includes("/login")) {
            console.log("Redirecting to login page");
            window.location.href = "/login";
          }

          return Promise.reject(refreshError);
        }
      } else {
        console.log("No refresh token available");
        // If no refresh token, just reject the request
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
