export interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  budget: number;
  deadline: string;
  status: ProjectStatus;
  client?: {
    id: number;
    name: string;
  };
  assignedFreelancer?: {
    id: number;
    name: string;
  };
  bids?: {
    id: number;
    freelancer: {
      id: number;
      name: string;
    };
    amount: number;
  }[];
}

export type ProjectStatus = "open" | "assigned" | "completed" | "cancelled";

export interface CreateProjectPayload {
  title: string;
  category: string;
  description: string;
  budget: number;
  deadline: string;
}
