// src/services/tariffService.ts
import api from "./api";
import {
  TariffApiResponse,
  TariffListApiResponse,
  CreateTariffDto,
  UpdateTariffDto,
} from "@/types/tariff.types";

const TariffService = {
  // GET /tariff/course/:courseId
  getByCourse: async (courseId: number): Promise<TariffListApiResponse> => {
    const res = await api.get<TariffListApiResponse>(
      `/tariff/course/${courseId}`,
    );
    return res.data;
  },

  // GET /tariff/:id
  getById: async (id: number): Promise<TariffApiResponse> => {
    const res = await api.get<TariffApiResponse>(`/tariff/${id}`);
    return res.data;
  },

  // POST /tariff — JSON body
  create: async (dto: CreateTariffDto): Promise<TariffApiResponse> => {
    const res = await api.post<TariffApiResponse>("/tariff", dto);
    return res.data;
  },

  // PATCH /tariff/:id — JSON body
  update: async (
    id: number,
    dto: UpdateTariffDto,
  ): Promise<TariffApiResponse> => {
    const res = await api.patch<TariffApiResponse>(`/tariff/${id}`, dto);
    return res.data;
  },

  // DELETE /tariff/:id
  delete: async (id: number): Promise<TariffApiResponse> => {
    const res = await api.delete<TariffApiResponse>(`/tariff/${id}`);
    return res.data;
  },
};

export default TariffService;
