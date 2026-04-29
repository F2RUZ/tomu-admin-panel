// src/services/notificationService.ts
import api from "./api";

export interface SendToAllDto {
  title: string;
  body: string;
}

export interface SendToUserDto {
  title: string;
  body: string;
  userId: number;
  data?: Record<string, any>;
}

export interface NotificationResult {
  message: string;
  success: number;
  failure: number;
  totalSent?: number;
}

const NotificationService = {
  // POST /notifications/send-to-all
  sendToAll: async (dto: SendToAllDto): Promise<NotificationResult> => {
    const res = await api.post<NotificationResult>(
      "/notifications/send-to-all",
      dto,
    );
    return res.data;
  },

  // POST /notifications/send-to-user
  sendToUser: async (dto: SendToUserDto): Promise<NotificationResult> => {
    const res = await api.post<NotificationResult>(
      "/notifications/send-to-user",
      dto,
    );
    return res.data;
  },

  // GET /notifications/status
  getStatus: async (): Promise<{ status: string; message: string }> => {
    const res = await api.get("/notifications/status");
    return res.data;
  },
};

export default NotificationService;
