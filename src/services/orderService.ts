// src/services/orderService.ts
import api from "./api";
import { OrderListApiResponse, OrderApiResponse } from "@/types/order.types";

const OrderService = {
  // GET /orders
  getAll: async (): Promise<OrderListApiResponse> => {
    const res = await api.get<OrderListApiResponse>("/orders");
    return res.data;
  },

  // GET /orders/:id
  getById: async (id: number): Promise<OrderApiResponse> => {
    const res = await api.get<OrderApiResponse>(`/orders/${id}`);
    return res.data;
  },
};

export default OrderService;
