import api, { uploadApi } from "./api";
import {
  LessonApiResponse,
  LessonListApiResponse,
  CreateLessonDto,
  UpdateLessonDto,
} from "@/types/lesson.types";

const LessonService = {
  getByBlock: async (blockId: number): Promise<LessonListApiResponse> => {
    const res = await api.get<LessonListApiResponse>(
      `/lesson/by-block/${blockId}`,
    );
    return res.data;
  },

  getById: async (id: number): Promise<LessonApiResponse> => {
    const res = await api.get<LessonApiResponse>(`/lesson/${id}`);
    return res.data;
  },

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
          onProgress(Math.min(Math.round((e.loaded / e.total) * 85), 85));
        }
      },
    });

    onProgress?.(99);
    return res.data;
  },

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

    const instance = dto.video ? uploadApi : api;

    const res = await instance.patch<LessonApiResponse>(
      `/lesson/${id}`,
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

  delete: async (id: number): Promise<LessonApiResponse> => {
    const res = await api.delete<LessonApiResponse>(`/lesson/${id}`);
    return res.data;
  },
};

export default LessonService;
