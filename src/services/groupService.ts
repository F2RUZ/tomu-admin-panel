// src/services/groupService.ts
import api from "./api";
import {
  GroupApiResponse,
  GroupListApiResponse,
  CreateGroupDto,
  UpdateGroupDto,
} from "@/types/group.types";

// Backend DTO lowercase, DB uppercase — shuning uchun convert qilamiz
const toBackendGender = (gender: string) =>
  gender.toLowerCase() as "male" | "female";

const GroupService = {
  getAll: async (): Promise<GroupListApiResponse> => {
    const res = await api.get<GroupListApiResponse>("/group");
    return res.data;
  },

  getById: async (id: number): Promise<GroupApiResponse> => {
    const res = await api.get<GroupApiResponse>(`/group/${id}`);
    return res.data;
  },

  create: async (dto: CreateGroupDto): Promise<GroupApiResponse> => {
    const res = await api.post<GroupApiResponse>("/group", {
      ...dto,
      gender: toBackendGender(dto.gender),
    });
    return res.data;
  },

  update: async (id: number, dto: UpdateGroupDto): Promise<GroupApiResponse> => {
    const res = await api.patch<GroupApiResponse>(`/group/${id}`, {
      ...dto,
      ...(dto.gender && { gender: toBackendGender(dto.gender) }),
    });
    return res.data;
  },

  delete: async (id: number): Promise<GroupApiResponse> => {
    const res = await api.delete<GroupApiResponse>(`/group/${id}`);
    return res.data;
  },
};

export default GroupService;
