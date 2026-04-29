// src/services/feedbackService.ts
import api from "./api";
import {
  FeedbackListApiResponse,
  FeedbackApiResponse,
} from "@/types/feedback.types";

const FeedbackService = {
  // GET /feedback
  getAll: async (): Promise<FeedbackListApiResponse> => {
    const res = await api.get<FeedbackListApiResponse>("/feedback");
    return res.data;
  },

  // GET /feedback/:id
  getById: async (id: number): Promise<FeedbackApiResponse> => {
    const res = await api.get<FeedbackApiResponse>(`/feedback/${id}`);
    return res.data;
  },

  // DELETE /feedback/:id
  delete: async (id: number): Promise<FeedbackApiResponse> => {
    const res = await api.delete<FeedbackApiResponse>(`/feedback/${id}`);
    return res.data;
  },
};

export default FeedbackService;
