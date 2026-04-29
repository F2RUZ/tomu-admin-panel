// src/types/user.types.ts

export type UserRole = "student" | "teacher" | "admin" | "director";
export type UserGender = "male" | "female";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  gender?: UserGender | null;
  role: UserRole;
  courseId?: number | null;
  avatar?: string | null;
  email?: string | null;
  maxDevices: number;
  deviceManagementEnabled: boolean;
  telegramChatId?: string | null;
  createdAt: string;
  lastUpdatedAt: string;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  gender?: UserGender;
  role?: UserRole;
  courseId?: number;
  maxDevices?: number;
}

export interface UserListResponse {
  statusCode: number;
  message: string;
  data: {
    users: User[];
    count: number;
    total_page: number;
  };
}

export interface UserApiResponse {
  statusCode: number;
  message: string;
  data: User;
}

export const ROLE_CONFIG: Record<
  UserRole,
  {
    label: string;
    light: { bg: string; color: string };
    dark: { bg: string; color: string };
  }
> = {
  student: {
    label: "Talaba",
    light: { bg: "#e0f2fe", color: "#0284c7" },
    dark: { bg: "rgba(2,132,199,0.1)", color: "#38bdf8" },
  },
  teacher: {
    label: "O'qituvchi",
    light: { bg: "#f3e8ff", color: "#9333ea" },
    dark: { bg: "rgba(147,51,234,0.1)", color: "#c084fc" },
  },
  admin: {
    label: "Admin",
    light: { bg: "#fef3c7", color: "#d97706" },
    dark: { bg: "rgba(251,191,36,0.1)", color: "#fbbf24" },
  },
  director: {
    label: "Direktor",
    light: { bg: "#fff1f2", color: "#dc2626" },
    dark: { bg: "rgba(248,113,113,0.1)", color: "#f87171" },
  },
};
