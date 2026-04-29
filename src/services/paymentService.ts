// src/services/paymentService.ts
import api from "./api";
import {
  CoursePaymentListResponse,
  LiveChatPaymentListResponse,
} from "@/types/payment.types";

const PaymentService = {
  // GET /course-payment-history?limit=10&page=1
  getCoursePayments: async (
    limit = 10,
    page = 1,
  ): Promise<CoursePaymentListResponse> => {
    const res = await api.get<CoursePaymentListResponse>(
      "/course-payment-history",
      { params: { limit, page } },
    );
    return res.data;
  },

  // GET /livechat-payment-history?limit=10&page=1
  getLiveChatPayments: async (
    limit = 10,
    page = 1,
  ): Promise<LiveChatPaymentListResponse> => {
    const res = await api.get<LiveChatPaymentListResponse>(
      "/livechat-payment-history",
      { params: { limit, page } },
    );
    return res.data;
  },
};

export default PaymentService;
