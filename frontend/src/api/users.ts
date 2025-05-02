import api from "./index";
import { User, ApiResponse } from "../types";

export const getProfile = () => {
  return api.get<ApiResponse<User>>("/users/profile");
};

// Alias for backward compatibility
export const getUserProfile = getProfile;

export const updateProfile = (data: {
  name?: string;
  bio?: string;
  skills?: string[];
  profileImage?: File;
  email?: string;
  password?: string;
}) => {
  const formData = new FormData();

  // Add text fields
  if (data.name) formData.append("name", data.name);
  if (data.email) formData.append("email", data.email);
  if (data.password) formData.append("password", data.password);
  if (data.bio) formData.append("bio", data.bio);
  if (data.skills && data.skills.length > 0) {
    console.log("Sending skills to API:", data.skills);
    formData.append("skills", JSON.stringify(data.skills));
  }

  // Add file if present
  if (data.profileImage) formData.append("profileImage", data.profileImage);

  return api.patch<ApiResponse<User>>("/users/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Alias for backward compatibility
export const updateUserProfile = updateProfile;

// Get all freelancers
export const getFreelancers = () => {
  return api.get<ApiResponse<User[]>>("/users/freelancers");
};

// Search freelancers
export const searchFreelancers = (query: string) => {
  return api.get<ApiResponse<User[]>>("/users/freelancers/search", {
    params: { query },
  });
};
