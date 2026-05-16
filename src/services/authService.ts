// src/services/authService.ts
import api from "./api";
import {
  LoginRequest,
  LoginApiResponse,
  RefreshApiResponse,
  AccessApiResponse,
  AccessRequest,
} from "@/types/auth.types";

const AuthService = {
  // POST /auth/sign-in/users
  login: async (dto: LoginRequest): Promise<LoginApiResponse> => {
    const res = await api.post<LoginApiResponse>("/auth/sign-in/users", dto);
    return res.data;
  },

  // GET /auth/refresh?refresh_token=...
  // Backend cookie dan ham o'qiydi, query param ham yuboramiz — ikki kafolat
  refresh: async (refreshToken: string): Promise<RefreshApiResponse> => {
    const res = await api.get<RefreshApiResponse>("/auth/refresh", {
      params: { refresh_token: refreshToken },
    });
    return res.data;
  },

  // POST /auth/current — token validatsiya
  getCurrentUser: async (accessToken: string): Promise<AccessApiResponse> => {
    const dto: AccessRequest = { accessToken };
    const res = await api.post<AccessApiResponse>("/auth/current", dto);
    return res.data;
  },
};

export default AuthService;
