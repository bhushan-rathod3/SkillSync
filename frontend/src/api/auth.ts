import api from "./index";
import {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  ApiResponse,
} from "../types";

export const login = (data: LoginCredentials) =>
  api.post<AuthResponse>("/auth/login", data).then((response) => {
    return response.data;
  });

export const register = (data: RegisterData) =>
  api.post<ApiResponse<AuthResponse>>("/users/register", data);

export const refreshToken = (refresh_token: string) =>
  api
    .post<AuthResponse>("/auth/refresh", { refresh_token })
    .then((response) => {
      return response.data;
    });
