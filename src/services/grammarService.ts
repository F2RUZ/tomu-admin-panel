// src/services/grammarService.ts
import api from "./api";
import axios from "axios";
import {
  GrammarApiResponse,
  GrammarListApiResponse,
  CreateGrammarDto,
  UpdateGrammarDto,
} from "@/types/grammar.types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://tomubackend.tomu.uz/api";

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

const GrammarService = {
  // GET /grammar/course/:courseId
  getByCourse: async (courseId: number): Promise<GrammarListApiResponse> => {
    const res = await api.get<GrammarListApiResponse>(
      `/grammar/course/${courseId}`,
    );
    return res.data;
  },

  // GET /grammar/:id
  getById: async (id: number): Promise<GrammarApiResponse> => {
    const res = await api.get<GrammarApiResponse>(`/grammar/${id}`);
    return res.data;
  },

  // POST /grammar
  create: async (
    dto: CreateGrammarDto,
    onProgress?: (percent: number) => void,
  ): Promise<GrammarApiResponse> => {
    const formData = new FormData();
    formData.append("title", dto.title);
    formData.append("order", String(dto.order));
    formData.append("courseId", String(dto.courseId));
    formData.append("video", dto.video);

    const res = await uploadApi.post<GrammarApiResponse>("/grammar", formData, {
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

  // PATCH /grammar/:id
  update: async (
    id: number,
    dto: UpdateGrammarDto,
    onProgress?: (percent: number) => void,
  ): Promise<GrammarApiResponse> => {
    const formData = new FormData();
    if (dto.title !== undefined) formData.append("title", dto.title);
    if (dto.order !== undefined) formData.append("order", String(dto.order));
    if (dto.courseId !== undefined)
      formData.append("courseId", String(dto.courseId));
    if (dto.video) formData.append("video", dto.video);

    const res = await uploadApi.patch<GrammarApiResponse>(
      `/grammar/${id}`,
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

  // DELETE /grammar/:id
  delete: async (id: number): Promise<GrammarApiResponse> => {
    const res = await api.delete<GrammarApiResponse>(`/grammar/${id}`);
    return res.data;
  },
};

export default GrammarService;
