import api from "../lib/api";
import { Bid, CreateBidPayload, Project, UpdateBidPayload } from "../types";

export const bidService = {
  getBidsForProject: async (projectId: number): Promise<Bid[]> => {
    const response = await api.get<Bid[]>(`/bids/project/${projectId}`);
    return response.data;
  },

  createBid: async (
    projectId: number,
    data: CreateBidPayload
  ): Promise<Bid> => {
    const response = await api.post<Bid>(`/bids/project/${projectId}`, data);
    return response.data;
  },

  updateBid: async (bidId: number, data: UpdateBidPayload): Promise<Bid> => {
    const response = await api.patch<Bid>(`/bids/${bidId}`, data);
    return response.data;
  },

  assignFreelancer: async (
    projectId: number,
    bidId: number
  ): Promise<Project> => {
    const response = await api.post<Project>(
      `/projects/${projectId}/assign/${bidId}`
    );
    return response.data;
  },
};
