// src/services/liveChatService.ts
import api from "./api";
import {
  LiveChatListResponse,
  LiveChatPriceListResponse,
  LiveChatPriceUpdateResponse,
} from "@/types/livechat.types";

const LiveChatService = {
  // GET /live-chat
  getAll: async (): Promise<LiveChatListResponse> => {
    const res = await api.get<LiveChatListResponse>("/live-chat");
    return res.data;
  },

  // GET /live-chat/:id
  getById: async (id: number) => {
    const res = await api.get(`/live-chat/${id}`);
    return res.data;
  },

  // DELETE /live-chat/delete/:id
  delete: async (id: number) => {
    const res = await api.delete(`/live-chat/delete/${id}`);
    return res.data;
  },

  // GET /livechat-price
  getPrice: async (): Promise<LiveChatPriceListResponse> => {
    const res = await api.get<LiveChatPriceListResponse>("/livechat-price");
    return res.data;
  },

  // PUT /livechat-price/update/:id
  updatePrice: async (
    id: number,
    price: number,
  ): Promise<LiveChatPriceUpdateResponse> => {
    const res = await api.put<LiveChatPriceUpdateResponse>(
      `/livechat-price/update/${id}`,
      { price },
    );
    return res.data;
  },
};

export default LiveChatService;
