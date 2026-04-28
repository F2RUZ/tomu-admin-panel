// src/services/alphabetService.ts

import api from "./api";
import {
  AlphabetApiResponse,
  AlphabetListApiResponse,
  CreateAlphabetDto,
  UpdateAlphabetDto,
} from "@/types/alphabet.types";

const AlphabetService = {
  // GET /alphabet/by-course/:courseId
  getByCourse: async (courseId: number): Promise<AlphabetListApiResponse> => {
    const res = await api.get<AlphabetListApiResponse>(
      `/alphabet/by-course/${courseId}`,
    );
    return res.data;
  },

  // GET /alphabet/:id
  getById: async (id: number): Promise<AlphabetApiResponse> => {
    const res = await api.get<AlphabetApiResponse>(`/alphabet/${id}`);
    return res.data;
  },

  // POST /alphabet — multipart/form-data
  create: async (dto: CreateAlphabetDto): Promise<AlphabetApiResponse> => {
    const formData = new FormData();
    formData.append("title", dto.title);
    formData.append("order", String(dto.order));
    formData.append("courseId", String(dto.courseId));
    formData.append("video", dto.video);

    const res = await api.post<AlphabetApiResponse>("/alphabet", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  // PATCH /alphabet/:id
  update: async (
    id: number,
    dto: UpdateAlphabetDto,
  ): Promise<AlphabetApiResponse> => {
    const formData = new FormData();
    if (dto.title !== undefined) formData.append("title", dto.title);
    if (dto.order !== undefined) formData.append("order", String(dto.order));
    if (dto.courseId !== undefined)
      formData.append("courseId", String(dto.courseId));
    if (dto.video) formData.append("video", dto.video);

    const res = await api.patch<AlphabetApiResponse>(
      `/alphabet/${id}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return res.data;
  },

  // DELETE /alphabet/:id
  delete: async (id: number): Promise<AlphabetApiResponse> => {
    const res = await api.delete<AlphabetApiResponse>(`/alphabet/${id}`);
    return res.data;
  },
};

export default AlphabetService;
