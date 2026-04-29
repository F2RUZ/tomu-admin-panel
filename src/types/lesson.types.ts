// src/types/lesson.types.ts

export interface Lesson {
  id: number;
  title: string;
  videoUrl: string;
  vimeoVideoId?: string | null;
  vimeoEmbedUrl?: string | null;
  order: number;
  mimetype: string;
  size: number;
  duration: number;
  grammarLink?: string | null;
  grammarVideoId?: string | null;
  block?: { id: number; title: string };
  course?: { id: number; title: string };
  createdAt: string;
  lastUpdatedAt: string;
}

export interface CreateLessonDto {
  title: string;
  order: number;
  blockId: number;
  video: File;
  grammarLink?: string;
}

export interface UpdateLessonDto {
  title?: string;
  order?: number;
  blockId?: number;
  video?: File;
  grammarLink?: string;
}

export interface LessonApiResponse {
  statusCode: number;
  message: string;
  data: Lesson;
}

export interface LessonListApiResponse {
  statusCode: number;
  message: string;
  data: Lesson[];
}
