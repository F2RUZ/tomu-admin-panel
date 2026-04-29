// src/services/blockService.ts
import api from "./api";
import {
  BlockApiResponse,
  BlockListApiResponse,
  CreateBlockDto,
  UpdateBlockDto,
} from "@/types/block.types";

const BlockService = {
  // GET /block/course-lesson/:courseId — faqat LESSON bloklari
  getLessonBlocks: async (courseId: number): Promise<BlockListApiResponse> => {
    const res = await api.get<BlockListApiResponse>(
      `/block/course-lesson/${courseId}`,
    );
    return res.data;
  },

  // GET /block/course-homework/:courseId — faqat HOMEWORK bloklari
  getHomeworkBlocks: async (
    courseId: number,
  ): Promise<BlockListApiResponse> => {
    const res = await api.get<BlockListApiResponse>(
      `/block/course-homework/${courseId}`,
    );
    return res.data;
  },

  // GET /block/:id
  getById: async (id: number): Promise<BlockApiResponse> => {
    const res = await api.get<BlockApiResponse>(`/block/${id}`);
    return res.data;
  },

  // POST /block
  create: async (dto: CreateBlockDto): Promise<BlockApiResponse> => {
    const res = await api.post<BlockApiResponse>("/block", dto);
    return res.data;
  },

  // PATCH /block/:id
  update: async (
    id: number,
    dto: UpdateBlockDto,
  ): Promise<BlockApiResponse> => {
    const res = await api.patch<BlockApiResponse>(`/block/${id}`, dto);
    return res.data;
  },

  // DELETE /block/:id
  delete: async (id: number): Promise<BlockApiResponse> => {
    const res = await api.delete<BlockApiResponse>(`/block/${id}`);
    return res.data;
  },
};

export default BlockService;
