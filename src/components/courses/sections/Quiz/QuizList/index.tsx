"use client";

import { useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/joy";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import BlockService from "@/services/blockService";
import LessonService from "@/services/lessonService";
import QuizService from "@/services/quizService";
import EmptyState from "@/components/ui/EmptyState";
import QuizBlockAccordion from "@/components/courses/sections/Quiz/QuizBlockAccordion";
import QuizModal from "@/components/courses/sections/Quiz/QuizModal";
import { Quiz } from "@/types/quiz.types";

interface Props {
  courseId: number;
}

export default function QuizList({ courseId }: Props) {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<Quiz | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);

  const { data: blocks, isLoading: blocksLoading } = useQuery({
    queryKey: ["lessonBlocks", courseId],
    queryFn: () => BlockService.getLessonBlocks(courseId),
    select: (res) =>
      Array.isArray(res.data)
        ? [...res.data].sort((a, b) => a.order - b.order)
        : [],
  });

  const { data: allQuizzes, isLoading: quizzesLoading } = useQuery({
    queryKey: ["quizzes", courseId],
    queryFn: () => QuizService.getAll(),
    select: (res) => (Array.isArray(res.data) ? res.data : []),
  });

  const isLoading = blocksLoading || quizzesLoading;

  const getQuizByLesson = (lessonId: number): Quiz | undefined =>
    allQuizzes?.find((q) => q.lessonId === lessonId);

  const handleAddQuiz = (lessonId: number) => {
    setSelectedLessonId(lessonId);
    setEditData(null);
    setModalOpen(true);
  };

  const handleEditQuiz = (quiz: Quiz) => {
    setSelectedLessonId(quiz.lessonId ?? null);
    setEditData(quiz);
    setModalOpen(true);
  };

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["quizzes", courseId] });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress
          sx={{
            "[data-joy-color-scheme='light'] &": { color: "#0284c7" },
            "[data-joy-color-scheme='dark'] &": { color: "#9333ea" },
          }}
        />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 800,
            fontSize: "1.25rem",
            letterSpacing: "-0.02em",
            color: "text.primary",
          }}
        >
          Testlar (Quiz)
        </Typography>
        <Typography
          sx={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.875rem",
            color: "text.tertiary",
            mt: 0.25,
          }}
        >
          Har bir dars uchun test yarating
        </Typography>
      </Box>

      {!blocks?.length ? (
        <EmptyState
          title="Hali bloklar yo'q"
          description="Avval darslar bo'limida blok yarating"
        />
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {blocks.map((block, index) => (
            <QuizBlockAccordion
              key={block.id}
              block={block}
              defaultOpen={index === 0}
              getQuizByLesson={getQuizByLesson}
              onAddQuiz={handleAddQuiz}
              onEditQuiz={handleEditQuiz}
              onDeleteSuccess={handleSuccess}
            />
          ))}
        </Box>
      )}

      <QuizModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditData(null);
          setSelectedLessonId(null);
        }}
        onSuccess={handleSuccess}
        editData={editData}
        lessonId={selectedLessonId}
      />
    </Box>
  );
}
