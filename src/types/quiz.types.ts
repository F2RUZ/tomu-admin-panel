// src/types/quiz.types.ts

// ─── Quiz Question ────────────────────────────────────────────────────────────
export interface QuizQuestion {
  id: number;
  questionText: string;
  order: number;
  options: string[];
  correctOptionIndex: number;
  quizId: number;
  createdAt: string;
  lastUpdatedAt: string;
}

export interface CreateQuizQuestionDto {
  questionText: string;
  order: number;
  options: string[]; // kamida 2 ta
  correctOptionIndex: number; // 0 dan boshlanadi
}

export interface UpdateQuizQuestionDto {
  id?: number;
  questionText?: string;
  order?: number;
  options?: string[];
  correctOptionIndex?: number;
}

// ─── Quiz ─────────────────────────────────────────────────────────────────────
export interface Quiz {
  id: number;
  title: string;
  description?: string | null;
  lessonId?: number | null;
  sectionId?: number | null;
  questions: QuizQuestion[];
  createdAt: string;
  lastUpdatedAt: string;
}

export interface CreateQuizDto {
  title: string;
  description?: string;
  lessonId?: number; // lessonId yoki sectionId dan biri bo'lishi shart
  sectionId?: number;
  questions: CreateQuizQuestionDto[];
}

export interface UpdateQuizDto {
  title?: string;
  description?: string;
  questions?: UpdateQuizQuestionDto[];
}

// ─── Quiz Attempt ─────────────────────────────────────────────────────────────
export interface QuizAnswer {
  questionId: number;
  selectedOptionIndex: number;
  isCorrect: boolean;
}

export interface QuizAttempt {
  id: number;
  userId: number;
  quizId: number;
  correctCount: number;
  totalCount: number;
  scorePercent: number;
  answers: QuizAnswer[];
  createdAt: string;
  lastUpdatedAt: string;
}

// ─── API Responses ────────────────────────────────────────────────────────────
export interface QuizApiResponse {
  statusCode: number;
  message: string;
  data: Quiz;
}

export interface QuizListApiResponse {
  statusCode: number;
  message: string;
  data: Quiz[];
}

export interface QuizAttemptApiResponse {
  statusCode: number;
  message: string;
  data: QuizAttempt;
}
