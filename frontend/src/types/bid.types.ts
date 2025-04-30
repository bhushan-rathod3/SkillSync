export interface Bid {
  id: number;
  projectId: number;
  bidAmount: number;
  durationDays: number;
  bidMessage: string;
  status: BidStatus;
  createdAt: string;
  freelancer: {
    id: number;
    name: string;
    profileImage: string;
  };
  project?: {
    id: number;
    title: string;
  };
}

export type BidStatus = "pending" | "accepted" | "rejected";

export interface CreateBidPayload {
  bidAmount: number;
  durationDays: number;
  bidMessage: string;
}

export interface UpdateBidPayload {
  bidAmount?: number;
  durationDays?: number;
  bidMessage?: string;
}
