// src/services/userService.ts
import api from "./api";
import {
  UserListResponse,
  UserApiResponse,
  UpdateUserDto,
} from "@/types/user.types";

export interface UserQueryParams {
  search?: string;
  limit?: number;
  page?: number;
  role?: string;
}

const UserService = {
  // GET /user?search=&limit=10&page=1&role=
  getAll: async (params: UserQueryParams = {}): Promise<UserListResponse> => {
    const res = await api.get<UserListResponse>("/user", { params });
    return res.data;
  },

  // GET /user/:id
  getById: async (id: number): Promise<UserApiResponse> => {
    const res = await api.get<UserApiResponse>(`/user/${id}`);
    return res.data;
  },

  // PATCH /user/update/:id
  update: async (id: number, dto: UpdateUserDto): Promise<UserApiResponse> => {
    const res = await api.patch<UserApiResponse>(`/user/update/${id}`, dto);
    return res.data;
  },

  // DELETE /user/delete/:id
  delete: async (id: number): Promise<UserApiResponse> => {
    const res = await api.delete<UserApiResponse>(`/user/delete/${id}`);
    return res.data;
  },
};

export default UserService;
