import api, { uploadApi } from "./api";
import {
  AlphabetApiResponse,
  AlphabetListApiResponse,
  CreateAlphabetDto,
  UpdateAlphabetDto,
} from "@/types/alphabet.types";

const AlphabetService = {
  getByCourse: async (courseId: number): Promise<AlphabetListApiResponse> => {
    const res = await api.get<AlphabetListApiResponse>(
      `/alphabet/by-course/${courseId}`,
    );
    return res.data;
  },

  getById: async (id: number): Promise<AlphabetApiResponse> => {
    const res = await api.get<AlphabetApiResponse>(`/alphabet/${id}`);
    return res.data;
  },

  create: async (
    dto: CreateAlphabetDto,
    onProgress?: (percent: number) => void,
  ): Promise<AlphabetApiResponse> => {
    const formData = new FormData();
    formData.append("title", dto.title);
    formData.append("order", String(dto.order));
    formData.append("courseId", String(dto.courseId));
    formData.append("video", dto.video);

    const res = await uploadApi.post<AlphabetApiResponse>(
      "/alphabet",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          if (onProgress && e.total) {
            onProgress(Math.min(Math.round((e.loaded / e.total) * 85), 85));
          }
        },
      },
    );

    onProgress?.(99);
    return res.data;
  },

  update: async (
    id: number,
    dto: UpdateAlphabetDto,
    onProgress?: (percent: number) => void,
  ): Promise<AlphabetApiResponse> => {
    const formData = new FormData();
    if (dto.title !== undefined) formData.append("title", dto.title);
    if (dto.order !== undefined) formData.append("order", String(dto.order));
    if (dto.courseId !== undefined)
      formData.append("courseId", String(dto.courseId));
    if (dto.video) formData.append("video", dto.video);

    const instance = dto.video ? uploadApi : api;

    const res = await instance.patch<AlphabetApiResponse>(
      `/alphabet/${id}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        ...(dto.video && {
          onUploadProgress: (e: any) => {
            if (onProgress && e.total) {
              onProgress(Math.min(Math.round((e.loaded / e.total) * 85), 85));
            }
          },
        }),
      },
    );

    onProgress?.(99);
    return res.data;
  },

  delete: async (id: number): Promise<AlphabetApiResponse> => {
    const res = await api.delete<AlphabetApiResponse>(`/alphabet/${id}`);
    return res.data;
  },
};

export default AlphabetService;
