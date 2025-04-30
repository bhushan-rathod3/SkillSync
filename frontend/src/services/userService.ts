import api from "../lib/api";
import { UpdateProfilePayload, User } from "../types";

export const userService = {
  getProfile: async (): Promise<User> => {
    try {
      console.log("Fetching user profile");
      const token = localStorage.getItem("accessToken");
      console.log("Token exists:", !!token);

      const response = await api.get<User>("/users/profile");
      console.log("Profile response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  },

  updateProfile: async (data: UpdateProfilePayload): Promise<User> => {
    const response = await api.patch<User>("/users/me", data);
    return response.data;
  },

  uploadProfileImage: async (file: File): Promise<{ profileImage: string }> => {
    const formData = new FormData();
    formData.append("profileImage", file);

    const response = await api.post<{ profileImage: string }>(
      "/users/profile-image",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },
};
