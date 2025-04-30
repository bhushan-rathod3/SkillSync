import { User } from "./user.types";
import { Project } from "./project.types";

export interface FileUpload {
  id: number;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedBy: User;
  project: Project;
  createdAt: string;
  updatedAt: string;
}
