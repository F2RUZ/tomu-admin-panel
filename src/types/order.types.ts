// src/types/order.types.ts

export type OrderStatus = "PENDING" | "PAID" | "CANCELLED" | "EXPIRED";
export type PaymentType =
  | "livechat"
  | "tariff"
  | "payme"
  | "click"
  | "uzum"
  | "cash";

export interface Order {
  id: number;
  userId: number;
  type: PaymentType;
  totalPrice: number;
  status: OrderStatus;
  liveChatId?: number | null;
  tariffId?: number | null;
  courseId?: number | null;
  createdAt: string;
  lastUpdatedAt: string;
}

export interface OrderApiResponse {
  statusCode: number;
  message: string;
  data: Order;
}

export interface OrderListApiResponse {
  statusCode: number;
  message: string;
  data: Order[];
}

export const ORDER_STATUS_CONFIG: Record<
  string,
  {
    label: string;
    light: { bg: string; color: string };
    dark: { bg: string; color: string };
  }
> = {
  PENDING: {
    label: "Kutilmoqda",
    light: { bg: "#fef3c7", color: "#d97706" },
    dark: { bg: "rgba(251,191,36,0.1)", color: "#fbbf24" },
  },
  PAID: {
    label: "To'langan",
    light: { bg: "#dcfce7", color: "#16a34a" },
    dark: { bg: "rgba(74,222,128,0.1)", color: "#4ade80" },
  },
  CANCELLED: {
    label: "Bekor qilingan",
    light: { bg: "#fff1f2", color: "#dc2626" },
    dark: { bg: "rgba(248,113,113,0.1)", color: "#f87171" },
  },
  EXPIRED: {
    label: "Muddati o'tgan",
    light: { bg: "#f1f5f9", color: "#64748b" },
    dark: { bg: "rgba(113,113,125,0.1)", color: "#71717d" },
  },
};

export const PAYMENT_TYPE_CONFIG: Record<
  string,
  { label: string; color: string }
> = {
  livechat: { label: "Live Chat", color: "#9333ea" },
  tariff: { label: "Tarif", color: "#0284c7" },
  payme: { label: "Payme", color: "#00BFFF" },
  click: { label: "Click", color: "#FF6B00" },
  uzum: { label: "Uzum", color: "#9B1FE8" },
  cash: { label: "Naqd", color: "#16a34a" },
};
