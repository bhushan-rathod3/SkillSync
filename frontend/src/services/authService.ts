import api from "../lib/api";
import { AxiosError } from "axios";
import { LoginPayload, LoginResponse, RegisterPayload, User } from "../types";

export const authService = {
  login: async (data: LoginPayload): Promise<LoginResponse> => {
    console.log("Attempting login with:", {
      email: data.email,
      passwordLength: data.password.length,
    });
    try {
      const response = await api.post<{ access_token: string }>(
        "/auth/login",
        data
      );
      console.log("Login response:", response.data);

      // Use the correct property name from the response
      const loginResponse: LoginResponse = {
        accessToken: response.data.access_token,
        refreshToken: response.data.access_token, // Using access_token as refresh token for now
      };
      return loginResponse;
    } catch (error: unknown) {
      console.error("Login API error:", error);
      if (error instanceof AxiosError && error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
      throw error;
    }
  },

  register: async (data: RegisterPayload): Promise<User> => {
    try {
      const response = await api.post<User>("/users/register", data);
      return response.data;
    } catch (error: unknown) {
      console.error("Register API error:", error);
      if (error instanceof AxiosError && error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },
};
