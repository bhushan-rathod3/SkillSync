import { Project } from "./project.types";

export type MilestoneStatus = "pending" | "completed" | "paid";

export interface Milestone {
  id: number;
  title: string;
  description: string;
  amount: number;
  dueDate: string;
  status: MilestoneStatus;
  project: Project;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMilestonePayload {
  title: string;
  description: string;
  amount: number;
  dueDate: string;
}
