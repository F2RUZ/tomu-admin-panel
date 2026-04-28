// src/services/alphabetService.ts
import api from "./api";
import axios from "axios";
import {
  AlphabetApiResponse,
  AlphabetListApiResponse,
  CreateAlphabetDto,
  UpdateAlphabetDto,
} from "@/types/alphabet.types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://tomubackend.tomu.uz/api";

// Video upload uchun alohida instance
const uploadApi = axios.create({
  baseURL: BASE_URL,
  timeout: 600000, // 10 daqiqa
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

const AlphabetService = {
  getByCourse: async (courseId: number): Promise<AlphabetListApiResponse> => {
    const res = await api.get<AlphabetListApiResponse>(`/alphabet/by-course/${courseId}`);
    return res.data;
  },

  getById: async (id: number): Promise<AlphabetApiResponse> => {
    const res = await api.get<AlphabetApiResponse>(`/alphabet/${id}`);
    return res.data;
  },

  create: async (
    dto: CreateAlphabetDto,
    onProgress?: (percent: number) => void
  ): Promise<AlphabetApiResponse> => {
    const formData = new FormData();
    formData.append("title", dto.title);
    formData.append("order", String(dto.order));
    formData.append("courseId", String(dto.courseId));
    formData.append("video", dto.video);

    const res = await uploadApi.post<AlphabetApiResponse>("/alphabet", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (e) => {
        if (onProgress && e.total) {
          const percent = Math.round((e.loaded * 100) / e.total);
          onProgress(Math.min(percent, 99)); // 99 da tutib turadi
        }
      },
    });

    onProgress?.(100);
    return res.data;
  },

  update: async (id: number, dto: UpdateAlphabetDto): Promise<AlphabetApiResponse> => {
    const formData = new FormData();
    if (dto.title !== undefined) formData.append("title", dto.title);
    if (dto.order !== undefined) formData.append("order", String(dto.order));
    if (dto.courseId !== undefined) formData.append("courseId", String(dto.courseId));
    if (dto.video) formData.append("video", dto.video);

    const res = await uploadApi.patch<AlphabetApiResponse>(`/alphabet/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  delete: async (id: number): Promise<AlphabetApiResponse> => {
    const res = await api.delete<AlphabetApiResponse>(`/alphabet/${id}`);
    return res.data;
  },
};

export default AlphabetService;
