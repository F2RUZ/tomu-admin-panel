// src/services/courseService.ts
import api from "./api";
import {
  CourseApiResponse,
  CourseListApiResponse,
  CreateCourseDto,
  UpdateCourseDto,
} from "@/types/course.types";

const CourseService = {
  getAll: async (): Promise<CourseListApiResponse> => {
    const res = await api.get<CourseListApiResponse>("/course");
    return res.data;
  },

  getById: async (id: number): Promise<CourseApiResponse> => {
    const res = await api.get<CourseApiResponse>(`/course/${id}`);
    return res.data;
  },

  create: async (dto: CreateCourseDto): Promise<CourseApiResponse> => {
    const formData = new FormData();
    formData.append("title", dto.title);
    formData.append("description", dto.description);
    if (dto.videoUrl) formData.append("videoUrl", dto.videoUrl);
    if (dto.image) formData.append("fileName", dto.image);

    const res = await api.post<CourseApiResponse>("/course", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  update: async (
    id: number,
    dto: UpdateCourseDto,
  ): Promise<CourseApiResponse> => {
    const formData = new FormData();
    if (dto.title !== undefined) formData.append("title", dto.title);
    if (dto.description !== undefined)
      formData.append("description", dto.description);
    if (dto.videoUrl !== undefined) formData.append("videoUrl", dto.videoUrl);
    if (dto.lang !== undefined) formData.append("lang", dto.lang);
    if (dto.isActive !== undefined)
      formData.append("isActive", String(dto.isActive));
    if (dto.image) formData.append("fileName", dto.image);

    const res = await api.patch<CourseApiResponse>(`/course/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  delete: async (id: number): Promise<CourseApiResponse> => {
    const res = await api.delete<CourseApiResponse>(`/course/${id}`);
    return res.data;
  },
};

export default CourseService;
