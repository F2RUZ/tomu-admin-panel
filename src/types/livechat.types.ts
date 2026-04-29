// src/types/livechat.types.ts

export type LiveChatStatus = "pending" | "paid" | "cancelled" | "completed";
export type LiveChatGender = "male" | "female";

export interface LiveChat {
  id: number;
  firstName: string;
  lastName: string;
  gender: LiveChatGender;
  phoneNumber: string;
  duration: number;
  price: string | number;
  userId: number;
  selectedCourseId: number;
  selectedCourseName: string;
  isAccepted: boolean;
  selectedDay: string;
  selectedTime: string;
  status: LiveChatStatus;
  createdAt: string;
  lastUpdatedAt: string;
}

export interface LiveChatPrice {
  id: number;
  price: number;
  createdAt: string;
  lastUpdatedAt: string;
}

export interface LiveChatListResponse {
  statusCode: number;
  message: string;
  data: LiveChat[];
}

export interface LiveChatPriceListResponse {
  statusCode: number;
  message: string;
  data: LiveChatPrice[];
}

export interface LiveChatPriceUpdateResponse {
  statusCode: number;
  message: string;
  data: LiveChatPrice;
}

export const LIVECHAT_STATUS_CONFIG: Record<
  string,
  {
    label: string;
    light: { bg: string; color: string };
    dark: { bg: string; color: string };
  }
> = {
  pending: {
    label: "Kutilmoqda",
    light: { bg: "#fef3c7", color: "#d97706" },
    dark: { bg: "rgba(251,191,36,0.1)", color: "#fbbf24" },
  },
  paid: {
    label: "To'langan",
    light: { bg: "#dcfce7", color: "#16a34a" },
    dark: { bg: "rgba(74,222,128,0.1)", color: "#4ade80" },
  },
  cancelled: {
    label: "Bekor",
    light: { bg: "#fff1f2", color: "#dc2626" },
    dark: { bg: "rgba(248,113,113,0.1)", color: "#f87171" },
  },
  completed: {
    label: "Tugallangan",
    light: { bg: "#f3e8ff", color: "#9333ea" },
    dark: { bg: "rgba(147,51,234,0.1)", color: "#c084fc" },
  },
};
