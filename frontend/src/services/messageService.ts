import api from "../lib/api";
import { Message, SendMessagePayload } from "../types";

export const messageService = {
  getMessagesForProject: async (projectId: number): Promise<Message[]> => {
    const response = await api.get<Message[]>(`/messages/project/${projectId}`);
    return response.data;
  },

  sendMessage: async (
    projectId: number,
    data: SendMessagePayload
  ): Promise<Message> => {
    const response = await api.post<Message>(
      `/messages/project/${projectId}`,
      data
    );
    return response.data;
  },
};
