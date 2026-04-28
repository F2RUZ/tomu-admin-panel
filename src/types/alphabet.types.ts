// src/types/alphabet.types.ts

export interface Alphabet {
  id: number;
  title: string;
  videoUrl: string;
  vimeoVideoId: string;
  order: number;
  mimetype: string;
  size: number;
  duration: number;
  course?: {
    id: number;
    title: string;
  };
  createdAt: string;
  lastUpdatedAt: string;
}

export interface CreateAlphabetDto {
  title: string;
  order: number;
  courseId: number;
  video: File;
}

export interface UpdateAlphabetDto {
  title?: string;
  order?: number;
  courseId?: number;
  video?: File;
}

export interface AlphabetApiResponse {
  statusCode: number;
  message: string;
  data: Alphabet;
}

export interface AlphabetListApiResponse {
  statusCode: number;
  message: string;
  data: Alphabet[];
}
