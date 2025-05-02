import api from "./index";
import {
  Bid,
  CreateBidDto,
  UpdateBidDto,
  ApproveBidDto,
  ApiResponse,
  BidStatus,
} from "../types";

export const createBid = (
  projectId: number,
  data: Omit<CreateBidDto, "projectId">
) => api.post<ApiResponse<Bid>>(`/bids/project/${projectId}`, data);

export const getBidsOnProject = (projectId: number) =>
  api.get<ApiResponse<Bid[]>>(`/bids/project/${projectId}`);

export const getMyBids = () => api.get<ApiResponse<Bid[]>>("/bids/my-bids");

export const updateBid = (id: number, data: UpdateBidDto) =>
  api.put<ApiResponse<Bid>>(`/bids/${id}`, data);

export const approveBid = (id: number, status: BidStatus) =>
  api.patch<ApiResponse<Bid>>(`/bids/${id}/approve`, {
    status,
  } as ApproveBidDto);
