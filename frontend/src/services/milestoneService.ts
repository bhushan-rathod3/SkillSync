import api from "../lib/api";
import { CreateMilestonePayload, Milestone } from "../types";

export const milestoneService = {
  getMilestonesForProject: async (projectId: number): Promise<Milestone[]> => {
    const response = await api.get<Milestone[]>(
      `/milestones/project/${projectId}`
    );
    return response.data;
  },

  createMilestone: async (
    projectId: number,
    data: CreateMilestonePayload
  ): Promise<Milestone> => {
    const response = await api.post<Milestone>(
      `/milestones/project/${projectId}`,
      data
    );
    return response.data;
  },

  markMilestoneAsPaid: async (milestoneId: number): Promise<Milestone> => {
    const response = await api.patch<Milestone>(
      `/milestones/${milestoneId}/pay`
    );
    return response.data;
  },
};
