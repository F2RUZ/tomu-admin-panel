// src/types/course.types.ts

export interface Course {
  id: number;
  title: string;
  description: string;
  imageUrl?: string | null;
  videoUrl?: string | null;
  vimeoVideoId?: string | null;
  vimeoEmbedUrl?: string | null;
  mimetype?: string | null;
  size?: number | null;
  isActive: boolean;
  lang?: string | null;
  createdAt: string;
  lastUpdatedAt: string;
  alphabetCount?: number;
  lessonCount?: number;
  grammarCount?: number;
  homeworkCount?: number;
  isActiveForUser?: boolean;
  subscriptionStatus?: string;
  startedAt?: string | null;
  endedAt?: string | null;
}

export interface CreateCourseDto {
  title: string;
  description: string;
  videoUrl?: string;
  image?: File;
}

export interface UpdateCourseDto {
  title?: string;
  description?: string;
  videoUrl?: string;
  lang?: string;
  isActive?: boolean;
  image?: File;
}

export interface CourseApiResponse {
  statusCode: number;
  message: string;
  data: Course;
}

export interface CourseListApiResponse {
  statusCode: number;
  message: string;
  data: Course[];
}

export const LANG_OPTIONS = [
  { value: "ar", label: "Arab tili", flag: "🇸🇦" },
  { value: "en", label: "Ingliz tili", flag: "🇬🇧" },
  { value: "ru", label: "Rus tili", flag: "🇷🇺" },
  { value: "uz", label: "O'zbek tili", flag: "🇺🇿" },
] as const;

export type CourseLang = "ar" | "en" | "ru" | "uz";
