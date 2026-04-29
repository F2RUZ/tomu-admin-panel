// src/types/grammar.types.ts

export interface Grammar {
  id: number;
  title: string;
  order: number;
  videoUrl: string;
  vimeoVideoId?: string | null;
  vimeoEmbedUrl?: string | null;
  mimetype: string;
  size: number;
  duration: number;
  courseId: number;
  createdAt: string;
  lastUpdatedAt: string;
}

export interface CreateGrammarDto {
  title: string;
  order: number;
  courseId: number;
  video: File;
}

export interface UpdateGrammarDto {
  title?: string;
  order?: number;
  courseId?: number;
  video?: File;
}

export interface GrammarApiResponse {
  statusCode: number;
  message: string;
  data: Grammar;
}

export interface GrammarListApiResponse {
  statusCode: number;
  message: string;
  data: Grammar[];
}
