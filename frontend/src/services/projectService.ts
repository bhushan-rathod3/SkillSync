import api from "../lib/api";
import { CreateProjectPayload, Project } from "../types";

export const projectService = {
  // Get all projects with optional filters
  getProjects: async (filters?: Record<string, any>): Promise<Project[]> => {
    try {
      // Ensure we have a token
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("No authentication token found when fetching projects");
        throw new Error("Authentication required");
      }

      // Make the request with explicit authorization header
      const response = await api.get<Project[]>("/projects", {
        params: filters,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error in getProjects service:", error);
      throw error;
    }
  },

  // Get a specific project by ID
  getProjectById: async (id: number): Promise<Project> => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error(
          "No authentication token found when fetching project details"
        );
        throw new Error("Authentication required");
      }

      const response = await api.get<Project>(`/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching project ${id}:`, error);
      throw error;
    }
  },

  // Create a new project
  createProject: async (data: CreateProjectPayload): Promise<Project> => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("No authentication token found when creating project");
        throw new Error("Authentication required");
      }

      const response = await api.post<Project>("/projects", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating project:", error);
      throw error;
    }
  },

  // Update an existing project
  updateProject: async (
    id: number,
    data: Partial<CreateProjectPayload>
  ): Promise<Project> => {
    const response = await api.patch<Project>(`/projects/${id}`, data);
    return response.data;
  },

  // Delete a project
  deleteProject: async (id: number): Promise<void> => {
    await api.delete(`/projects/${id}`);
  },

  // Get projects created by the current client
  getClientProjects: async (): Promise<Project[]> => {
    const response = await api.get<Project[]>("/projects/client");
    return response.data;
  },

  // Get projects assigned to the current freelancer
  getFreelancerProjects: async (): Promise<Project[]> => {
    const response = await api.get<Project[]>("/projects/freelancer");
    return response.data;
  },

  // Get available projects for freelancers to bid on
  getAvailableProjects: async (): Promise<Project[]> => {
    const response = await api.get<Project[]>("/projects/available");
    return response.data;
  },

  // Get recommended projects based on freelancer skills
  getRecommendedProjects: async (): Promise<Project[]> => {
    const response = await api.get<Project[]>("/projects/recommended");
    return response.data;
  },
};
