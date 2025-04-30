import api from "../lib/api";
import { FileUpload } from "../types";

export const fileService = {
  uploadFile: async (projectId: number, file: File): Promise<FileUpload> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post<FileUpload>(
      `/files/project/${projectId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  getFilesForProject: async (projectId: number): Promise<FileUpload[]> => {
    const response = await api.get<FileUpload[]>(`/files/project/${projectId}`);
    return response.data;
  },

  deleteFile: async (fileId: number): Promise<void> => {
    await api.delete(`/files/${fileId}`);
  },
};
