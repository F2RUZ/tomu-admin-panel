// src/services/lessonService.ts
import api from "./api";
import axios from "axios";
import {
  LessonApiResponse,
  LessonListApiResponse,
  CreateLessonDto,
  UpdateLessonDto,
} from "@/types/lesson.types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://tomubackend.tomu.uz/api";

// Video upload uchun alohida instance — 10 daqiqa timeout
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

const LessonService = {
  // GET /lesson/by-block/:blockId
  getByBlock: async (blockId: number): Promise<LessonListApiResponse> => {
    const res = await api.get<LessonListApiResponse>(
      `/lesson/by-block/${blockId}`,
    );
    return res.data;
  },

  // GET /lesson/:id
  getById: async (id: number): Promise<LessonApiResponse> => {
    const res = await api.get<LessonApiResponse>(`/lesson/${id}`);
    return res.data;
  },

  // POST /lesson — video upload
  create: async (
    dto: CreateLessonDto,
    onProgress?: (percent: number) => void,
  ): Promise<LessonApiResponse> => {
    const formData = new FormData();
    formData.append("title", dto.title);
    formData.append("order", String(dto.order));
    formData.append("blockId", String(dto.blockId));
    formData.append("video", dto.video);
    if (dto.grammarLink) formData.append("grammarLink", dto.grammarLink);

    const res = await uploadApi.post<LessonApiResponse>("/lesson", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (e) => {
        if (onProgress && e.total) {
          onProgress(Math.min(Math.round((e.loaded * 100) / e.total), 99));
        }
      },
    });
    onProgress?.(100);
    return res.data;
  },

  // PATCH /lesson/:id
  update: async (
    id: number,
    dto: UpdateLessonDto,
    onProgress?: (percent: number) => void,
  ): Promise<LessonApiResponse> => {
    const formData = new FormData();
    if (dto.title !== undefined) formData.append("title", dto.title);
    if (dto.order !== undefined) formData.append("order", String(dto.order));
    if (dto.blockId !== undefined)
      formData.append("blockId", String(dto.blockId));
    if (dto.grammarLink !== undefined)
      formData.append("grammarLink", dto.grammarLink);
    if (dto.video) formData.append("video", dto.video);

    const res = await uploadApi.patch<LessonApiResponse>(
      `/lesson/${id}`,
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

  // DELETE /lesson/:id
  delete: async (id: number): Promise<LessonApiResponse> => {
    const res = await api.delete<LessonApiResponse>(`/lesson/${id}`);
    return res.data;
  },
};

export default LessonService;
