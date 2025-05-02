import axios from "axios";

// Create axios instance with base URL
const api = axios.create({
  baseURL: "http://localhost:3000",
});

// Request interceptor to add auth token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with token refresh logic
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Don't redirect if we're already on the login page
      const isLoginPage = window.location.pathname === "/login";

      // Try to refresh the token
      const refreshToken = localStorage.getItem("refresh_token");

      if (refreshToken && !isLoginPage) {
        try {
          // Attempt to refresh the token
          // This would be a call to your refresh token endpoint
          console.log("Token expired, should refresh but redirecting to login");

          // Clear tokens and redirect to login
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/login";
        } catch (refreshError) {
          console.error("Error refreshing token:", refreshError);

          // Clear tokens and redirect to login
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          if (!isLoginPage) {
            window.location.href = "/login";
          }
        }
      } else if (!isLoginPage) {
        // No refresh token, redirect to login
        localStorage.removeItem("access_token");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
