// src/types/homework.types.ts

export interface Homework {
  id: number;
  title?: string | null;
  videoUrl: string;
  vimeoVideoId?: string | null;
  vimeoEmbedUrl?: string | null;
  mimetype: string;
  size: number;
  order: number;
  duration: number;
  blockId: number;
  block?: { id: number; title: string };
  createdAt: string;
  lastUpdatedAt: string;
}

export interface CreateHomeworkDto {
  title: string;       // ← description emas, title!
  order: number;
  blockId: number;
  video: File;
}

export interface UpdateHomeworkDto {
  title?: string;
  order?: number;
  blockId?: number;
  video?: File;
}

export interface HomeworkApiResponse {
  statusCode: number;
  message: string;
  data: Homework;
}

export interface HomeworkListApiResponse {
  statusCode: number;
  message: string;
  data: Homework[];
}
