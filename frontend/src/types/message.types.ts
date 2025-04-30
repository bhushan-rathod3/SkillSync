import { User } from "./user.types";
import { Project } from "./project.types";

export interface Message {
  id: number;
  content: string;
  sender: User;
  project: Project;
  createdAt: string;
  updatedAt: string;
}

export interface SendMessagePayload {
  content: string;
}
