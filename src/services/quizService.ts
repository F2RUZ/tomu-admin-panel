// src/services/quizService.ts
import api from "./api";
import {
  QuizApiResponse,
  QuizListApiResponse,
  CreateQuizDto,
  UpdateQuizDto,
} from "@/types/quiz.types";

const QuizService = {
  // GET /quiz — barcha testlar (Admin)
  getAll: async (): Promise<QuizListApiResponse> => {
    const res = await api.get<QuizListApiResponse>("/quiz");
    return res.data;
  },

  // GET /quiz/admin/:id — to'g'ri javoblar bilan (Admin)
  getById: async (id: number): Promise<QuizApiResponse> => {
    const res = await api.get<QuizApiResponse>(`/quiz/admin/${id}`);
    return res.data;
  },

  // POST /quiz — yangi test yaratish
  create: async (dto: CreateQuizDto): Promise<QuizApiResponse> => {
    const res = await api.post<QuizApiResponse>("/quiz", dto);
    return res.data;
  },

  // PATCH /quiz/:id — testni yangilash
  update: async (id: number, dto: UpdateQuizDto): Promise<QuizApiResponse> => {
    const res = await api.patch<QuizApiResponse>(`/quiz/${id}`, dto);
    return res.data;
  },

  // GET /quiz/grouped — teacher uchun
  getGrouped: async (): Promise<any> => {
    const res = await api.get("/quiz/grouped");
    return res.data;
  },
  // DELETE /quiz/:id — testni o'chirish
  delete: async (id: number): Promise<QuizApiResponse> => {
    const res = await api.delete<QuizApiResponse>(`/quiz/${id}`);
    return res.data;
  },
};

export default QuizService;
