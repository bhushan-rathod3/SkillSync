import api from "./index";
import { Message, ApiResponse } from "../types";

export const sendMessage = (
  projectId: number,
  receiverId: number,
  data: { message: string; attachment?: File }
) => {
  // Use FormData for file uploads
  const formData = new FormData();
  formData.append("message", data.message);
  formData.append("receiverId", receiverId.toString());

  if (data.attachment) {
    formData.append("attachment", data.attachment);
  }

  return api.post<ApiResponse<Message>>(
    `/messages/project/${projectId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export const getMessages = (projectId: number) =>
  api.get<ApiResponse<Message[]>>(`/messages/project/${projectId}`);

export const getConversations = () =>
  api.get<
    ApiResponse<
      {
        projectId: number;
        otherPartyId: number;
        otherPartyName: string;
        lastMessage: {
          id: number;
          message: string;
          createdAt: Date;
          sender: {
            id: number;
            name: string;
          };
          project: {
            id: number;
            title: string;
            status: string;
          };
        };
      }[]
    >
  >(`/messages/conversations`);
