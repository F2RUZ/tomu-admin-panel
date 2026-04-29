// src/types/feedback.types.ts

export interface FeedbackUser {
  id: number;
  firstName: string;
  lastName: string;
}

export interface FeedbackCourse {
  id: number;
  title: string;
}

export interface Feedback {
  id: number;
  comment: string;
  user?: FeedbackUser | null;
  course?: FeedbackCourse | null;
  createdAt: string;
  lastUpdatedAt: string;
}

export interface FeedbackApiResponse {
  statusCode: number;
  message: string;
  data: Feedback;
}

export interface FeedbackListApiResponse {
  statusCode: number;
  message: string;
  data: Feedback[];
}
