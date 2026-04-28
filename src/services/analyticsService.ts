// src/services/analyticsService.ts
import api from "./api";
import { AnalyticsData } from "@/types/analytics.types";

const AnalyticsService = {
  getByYear: async (year: number): Promise<AnalyticsData> => {
    const res = await api.get<AnalyticsData>("/analytics", {
      params: { year },
    });
    return res.data;
  },

  getUserCount: async (): Promise<number> => {
    const res = await api.get("/user", { params: { limit: 1, page: 1 } });
    return res.data?.total ?? res.data?.data?.length ?? 0;
  },

  getCourseCount: async (): Promise<number> => {
    const res = await api.get("/course");
    const data = res.data?.data;
    return Array.isArray(data) ? data.length : 0;
  },

  getOrderCount: async (): Promise<number> => {
    const res = await api.get("/orders");
    const data = res.data?.data;
    return Array.isArray(data) ? data.length : 0;
  },
};

export default AnalyticsService;
