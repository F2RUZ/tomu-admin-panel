// src/types/block.types.ts

export type BlockCategory = "lesson" | "homework";

export interface Block {
  id: number;
  title: string;
  order: number;
  duration: number;
  countVideos: number;
  category: BlockCategory;
  course?: { id: number; title: string };
  createdAt: string;
  lastUpdatedAt: string;
}

export interface CreateBlockDto {
  title: string;
  order: number;
  courseId: number;
  category: BlockCategory;
}

export interface UpdateBlockDto {
  title?: string;
  order?: number;
  courseId?: number;
  category?: BlockCategory;
}

export interface BlockApiResponse {
  statusCode: number;
  message: string;
  data: Block;
}

export interface BlockListApiResponse {
  statusCode: number;
  message: string;
  data: Block[];
}
