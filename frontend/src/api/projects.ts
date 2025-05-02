import api from "./index";
import {
  Project,
  CreateProjectDto,
  ApiResponse,
  PaginatedResponse,
} from "../types";

export const createProject = (data: CreateProjectDto) =>
  api.post<ApiResponse<Project>>("/projects", data);

export const getProjects = (page = 1, limit = 10) =>
  api.get<ApiResponse<PaginatedResponse<Project>>>("/projects", {
    params: { page, limit },
  });

export const getProjectById = (id: number) =>
  api.get<ApiResponse<Project>>(`/projects/${id}`);

export const getMyProjects = () =>
  api.get<Project[] | ApiResponse<Project[]>>("/projects/client/my-projects");

export const getFreelancerProjects = () =>
  api.get<Project[] | ApiResponse<Project[]>>(
    "/projects/freelancer/my-projects"
  );

export const searchProjects = (searchTerm: string) =>
  api.get<ApiResponse<Project[]>>("/projects/search", {
    params: { query: searchTerm },
  });

export const searchFreelancers = (searchTerm: string) =>
  api.get<ApiResponse<any[]>>("/users/freelancers/search", {
    params: { query: searchTerm },
  });
