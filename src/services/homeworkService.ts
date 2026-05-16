// src/services/homeworkService.ts
import api from "./api";
import axios from "axios";
import {
  HomeworkApiResponse,
  HomeworkListApiResponse,
  CreateHomeworkDto,
  UpdateHomeworkDto,
} from "@/types/homework.types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://213.136.64.206:7777/api";

const uploadApi = axios.create({
  baseURL: BASE_URL,
  timeout: 600000,
  withCredentials: true,
});

uploadApi.interceptors.request.use((config) => {
  try {
    const stored = localStorage.getItem("tomu-admin-auth");
    if (stored) {
      const { state } = JSON.parse(stored);
      const token = state?.tokens?.accessToken;
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {}
  return config;
});

const HomeworkService = {
  // GET /homework/by-block/:blockId
  getByBlock: async (blockId: number): Promise<HomeworkListApiResponse> => {
    const res = await api.get<HomeworkListApiResponse>(
      `/homework/by-block/${blockId}`,
    );
    return res.data;
  },

  // GET /homework/:id
  getById: async (id: number): Promise<HomeworkApiResponse> => {
    const res = await api.get<HomeworkApiResponse>(`/homework/${id}`);
    return res.data;
  },

  // POST /homework
  create: async (
    dto: CreateHomeworkDto,
    onProgress?: (percent: number) => void,
  ): Promise<HomeworkApiResponse> => {
    const formData = new FormData();
    formData.append("title", dto.title);
    formData.append("order", String(dto.order));
    formData.append("blockId", String(dto.blockId));
    formData.append("video", dto.video);

    const res = await uploadApi.post<HomeworkApiResponse>(
      "/homework",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          if (onProgress && e.total) {
            onProgress(Math.min(Math.round((e.loaded * 100) / e.total), 99));
          }
        },
      },
    );
    onProgress?.(100);
    return res.data;
  },

  // PATCH /homework/:id
  update: async (
    id: number,
    dto: UpdateHomeworkDto,
    onProgress?: (percent: number) => void,
  ): Promise<HomeworkApiResponse> => {
    const formData = new FormData();
    if (dto.title !== undefined)
      formData.append("title", dto.title);
    if (dto.order !== undefined) formData.append("order", String(dto.order));
    if (dto.blockId !== undefined)
      formData.append("blockId", String(dto.blockId));
    if (dto.video) formData.append("video", dto.video);

    const res = await uploadApi.patch<HomeworkApiResponse>(
      `/homework/${id}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          if (onProgress && e.total) {
            onProgress(Math.min(Math.round((e.loaded * 100) / e.total), 99));
          }
        },
      },
    );
    onProgress?.(100);
    return res.data;
  },

  // DELETE /homework/:id
  delete: async (id: number): Promise<HomeworkApiResponse> => {
    const res = await api.delete<HomeworkApiResponse>(`/homework/${id}`);
    return res.data;
  },
};

export default HomeworkService;
