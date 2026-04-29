// src/types/group.types.ts

export type GroupStatus = "FILLING" | "ACTIVE" | "SCHEDULED" | "COMPLETED";
export type GenderType = "MALE" | "FEMALE";

export interface Group {
  id: number;
  name: string;
  gender: GenderType;
  studentsCount: number;
  maxStudents: number;
  currentScheduleStep: number;
  fillAt?: string | null;
  status: GroupStatus;
  courseId: number;
  startDate?: string | null;
  completedAt?: string | null;
  course?: { id: number; title: string };
  createdAt: string;
  lastUpdatedAt: string;
}

export interface CreateGroupDto {
  name: string;
  gender: GenderType;
  maxStudents?: number;
  courseId: number;
}

export interface UpdateGroupDto {
  name?: string;
  gender?: GenderType;
  maxStudents?: number;
  courseId?: number;
}

export interface GroupApiResponse {
  statusCode: number;
  message: string;
  data: Group;
}

export interface GroupListApiResponse {
  statusCode: number;
  message: string;
  data: Group[];
}

export const GROUP_STATUS_CONFIG: Record<string, { label: string; light: { bg: string; color: string }; dark: { bg: string; color: string } }> = {
  FILLING: {
    label: "Tolmoqda",
    light: { bg: "#e0f2fe", color: "#0284c7" },
    dark: { bg: "rgba(2,132,199,0.1)", color: "#38bdf8" },
  },
  ACTIVE: {
    label: "Faol",
    light: { bg: "#dcfce7", color: "#16a34a" },
    dark: { bg: "rgba(74,222,128,0.1)", color: "#4ade80" },
  },
  SCHEDULED: {
    label: "Rejalashtirilgan",
    light: { bg: "#f3e8ff", color: "#9333ea" },
    dark: { bg: "rgba(147,51,234,0.1)", color: "#c084fc" },
  },
  COMPLETED: {
    label: "Tugallangan",
    light: { bg: "#f1f5f9", color: "#64748b" },
    dark: { bg: "rgba(113,113,125,0.1)", color: "#71717d" },
  },
};

export type GenderInput = "male" | "female";
