"use client";

import { useState, useMemo } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  IconButton,
  Tooltip,
  Button,
} from "@mui/joy";
import {
  RiArrowDownSLine,
  RiVideoLine,
  RiTimeLine,
  RiAddLine,
  RiEditLine,
  RiDeleteBinLine,
  RiQuestionLine,
  RiCheckLine,
} from "react-icons/ri";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import LessonService from "@/services/lessonService";
import QuizService from "@/services/quizService";
import { useSnackbarStore } from "@/store/snackbarStore";
import ConfirmModal from "@/components/ui/ConfirmModal";
import EmptyState from "@/components/ui/EmptyState";
import Pagination from "@/components/ui/Pagination";
import { Block } from "@/types/block.types";
import { Quiz } from "@/types/quiz.types";
import { Lesson } from "@/types/lesson.types";

const formatDuration = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}s ${m}d`;
  return `${m} daqiqa`;
};

interface Props {
  block: Block;
  defaultOpen?: boolean;
  getQuizByLesson: (lessonId: number) => Quiz | undefined;
  onAddQuiz: (lessonId: number) => void;
  onEditQuiz: (quiz: Quiz) => void;
  onDeleteSuccess: () => void;
}

export default function QuizBlockAccordion({
  block,
  defaultOpen = false,
  getQuizByLesson,
  onAddQuiz,
  onEditQuiz,
  onDeleteSuccess,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const [page, setPage] = useState(1);
  const perPage = 7; // ✅ Default 7

  const { data: lessons, isLoading } = useQuery({
    queryKey: ["lessons", block.id],
    queryFn: () => LessonService.getByBlock(block.id),
    select: (res) =>
      Array.isArray(res.data)
        ? [...res.data].sort((a, b) => a.order - b.order)
        : [],
  });

  // ✅ Pagination
  const paginated = useMemo(() => {
    if (!lessons) return [];
    return lessons.slice((page - 1) * perPage, page * perPage);
  }, [lessons, page]);

  const quizCount = lessons?.filter((l) => getQuizByLesson(l.id)).length ?? 0;

  return (
    <Box
      sx={{
        borderRadius: "12px",
        border: "1px solid",
        overflow: "hidden",
        "[data-joy-color-scheme='light'] &": {
          borderColor: "#bae6fd",
          bgcolor: "#ffffff",
        },
        "[data-joy-color-scheme='dark'] &": {
          borderColor: "#1e3a5f",
          bgcolor: "#0d1b2a",
        },
      }}
    >
      {/* ── Header ── */}
      <Box
        onClick={() => setOpen((v) => !v)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2.5,
          py: 1.75,
          cursor: "pointer",
          userSelect: "none",
          transition: "background 0.15s ease",
          "[data-joy-color-scheme='light'] &": { bgcolor: "#f0f9ff" },
          "[data-joy-color-scheme='dark'] &": { bgcolor: "#0f1929" },
          "&:hover": {
            "[data-joy-color-scheme='light'] &": { bgcolor: "#e0f2fe" },
            "[data-joy-color-scheme='dark'] &": { bgcolor: "#111e30" },
          },
        }}
      >
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 0 }}
        >
          {/* Arrow */}
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "all 0.25s ease",
              transform: open ? "rotate(0deg)" : "rotate(-90deg)",
              "[data-joy-color-scheme='light'] &": {
                bgcolor: "#bae6fd",
                color: "#0284c7",
              },
              "[data-joy-color-scheme='dark'] &": {
                bgcolor: "rgba(59,130,246,0.15)",
                color: "#60a5fa",
              },
            }}
          >
            <RiArrowDownSLine size={16} />
          </Box>

          {/* Icon */}
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              "[data-joy-color-scheme='light'] &": {
                background: "linear-gradient(135deg, #0284c7, #0369a1)",
                boxShadow: "0 2px 8px rgba(2,132,199,0.3)",
              },
              "[data-joy-color-scheme='dark'] &": {
                background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                boxShadow: "0 2px 8px rgba(59,130,246,0.3)",
              },
            }}
          >
            <RiVideoLine size={17} color="#fff" />
          </Box>

          {/* Title */}
          <Box sx={{ minWidth: 0 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Typography
                sx={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 700,
                  fontSize: "0.9375rem",
                  color: "text.primary",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {block.title}
              </Typography>
              <Box
                sx={{
                  px: 0.875,
                  py: 0.25,
                  borderRadius: "6px",
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 700,
                  fontSize: "0.6875rem",
                  flexShrink: 0,
                  "[data-joy-color-scheme='light'] &": {
                    bgcolor: "#bae6fd",
                    color: "#0284c7",
                  },
                  "[data-joy-color-scheme='dark'] &": {
                    bgcolor: "rgba(59,130,246,0.15)",
                    color: "#60a5fa",
                  },
                }}
              >
                #{block.order}
              </Box>
            </Box>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1.5, mt: 0.25 }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <RiVideoLine size={12} style={{ opacity: 0.5 }} />
                <Typography
                  sx={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.75rem",
                    color: "text.tertiary",
                  }}
                >
                  {lessons?.length ?? 0} ta dars
                </Typography>
              </Box>
              {block.duration > 0 && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <RiTimeLine size={12} style={{ opacity: 0.5 }} />
                  <Typography
                    sx={{
                      fontFamily: "var(--font-montserrat)",
                      fontSize: "0.75rem",
                      color: "text.tertiary",
                    }}
                  >
                    {formatDuration(Number(block.duration))}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        {/* Quiz count */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.75,
            px: 1.5,
            py: 0.625,
            borderRadius: "8px",
            flexShrink: 0,
            "[data-joy-color-scheme='light'] &": { bgcolor: "#e0f2fe" },
            "[data-joy-color-scheme='dark'] &": {
              bgcolor: "rgba(59,130,246,0.1)",
            },
          }}
        >
          <RiQuestionLine size={13} />
          <Typography
            sx={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 700,
              fontSize: "0.75rem",
              "[data-joy-color-scheme='light'] &": { color: "#0284c7" },
              "[data-joy-color-scheme='dark'] &": { color: "#60a5fa" },
            }}
          >
            {quizCount} ta quiz
          </Typography>
        </Box>
      </Box>

      {/* ── Content ── */}
      <Box
        sx={{
          overflow: "hidden",
          maxHeight: open ? "10000px" : "0px",
          transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <Box
          sx={{
            p: 2.5,
            pt: 2,
            borderTop: "1px solid",
            "[data-joy-color-scheme='light'] &": { borderColor: "#bae6fd" },
            "[data-joy-color-scheme='dark'] &": { borderColor: "#1e3a5f" },
          }}
        >
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress size="sm" />
            </Box>
          ) : !lessons?.length ? (
            <EmptyState title="Bu blokda darslar yo'q" />
          ) : (
            <>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {paginated.map((lesson) => {
                  const quiz = getQuizByLesson(lesson.id);
                  return (
                    <LessonQuizRow
                      key={lesson.id}
                      lesson={lesson}
                      quiz={quiz}
                      onAddQuiz={() => onAddQuiz(lesson.id)}
                      onEditQuiz={() => quiz && onEditQuiz(quiz)}
                      onDeleteSuccess={onDeleteSuccess}
                    />
                  );
                })}
              </Box>

              {/* ✅ Pagination — 7 ta default */}
              {lessons.length > perPage && (
                <Pagination
                  total={lessons.length}
                  page={page}
                  perPage={perPage}
                  onPageChange={setPage}
                  onPerPageChange={() => {}}
                  perPageOptions={[7]}
                />
              )}
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}

// ── Lesson + Quiz row ─────────────────────────────────────────────────────────
function LessonQuizRow({
  lesson,
  quiz,
  onAddQuiz,
  onEditQuiz,
  onDeleteSuccess,
}: {
  lesson: Lesson;
  quiz?: Quiz;
  onAddQuiz: () => void;
  onEditQuiz: () => void;
  onDeleteSuccess: () => void;
}) {
  const [deleteOpen, setDeleteOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => QuizService.delete(quiz!.id),
    onSuccess: () => {
      useSnackbarStore.getState().success("Quiz o'chirildi");
      onDeleteSuccess();
      setDeleteOpen(false);
    },
    onError: () => useSnackbarStore.getState().error("O'chirishda xatolik"),
  });

  const hasQuiz = !!quiz;

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          p: 1.25,
          borderRadius: "8px",
          border: "1px solid",
          transition: "all 0.15s ease",
          "[data-joy-color-scheme='light'] &": {
            bgcolor: hasQuiz ? "#f0fdf4" : "#f8fafc",
            borderColor: hasQuiz ? "#bbf7d0" : "#e2e8f0",
          },
          "[data-joy-color-scheme='dark'] &": {
            bgcolor: hasQuiz ? "rgba(74,222,128,0.04)" : "#0d1b2a",
            borderColor: hasQuiz ? "rgba(74,222,128,0.15)" : "#1e3a5f",
          },
        }}
      >
        {/* Lesson info */}
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}
        >
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: "6px",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-montserrat)",
              fontWeight: 700,
              fontSize: "0.75rem",
              "[data-joy-color-scheme='light'] &": {
                bgcolor: "#e0f2fe",
                color: "#0284c7",
              },
              "[data-joy-color-scheme='dark'] &": {
                bgcolor: "rgba(59,130,246,0.15)",
                color: "#60a5fa",
              },
            }}
          >
            {lesson.order}
          </Box>
          <Typography
            sx={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 600,
              fontSize: "0.875rem",
              color: "text.primary",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {lesson.title}
          </Typography>
        </Box>

        {/* Quiz status */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.75,
            flexShrink: 0,
          }}
        >
          {quiz ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.625,
                  px: 1.25,
                  py: 0.375,
                  borderRadius: "6px",
                  "[data-joy-color-scheme='light'] &": {
                    bgcolor: "#dcfce7",
                    color: "#16a34a",
                  },
                  "[data-joy-color-scheme='dark'] &": {
                    bgcolor: "rgba(74,222,128,0.1)",
                    color: "#4ade80",
                  },
                }}
              >
                <RiCheckLine size={12} />
                <Typography
                  sx={{
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 700,
                    fontSize: "0.6875rem",
                  }}
                >
                  {quiz.questions?.length ?? 0} savol
                </Typography>
              </Box>

              <Tooltip title="Tahrirlash" placement="top" arrow>
                <IconButton
                  size="sm"
                  variant="soft"
                  onClick={onEditQuiz}
                  sx={{
                    borderRadius: "7px",
                    minWidth: 30,
                    minHeight: 30,
                    "[data-joy-color-scheme='light'] &": {
                      bgcolor: "#e0f2fe",
                      color: "#0284c7",
                      "&:hover": { bgcolor: "#bae6fd" },
                    },
                    "[data-joy-color-scheme='dark'] &": {
                      bgcolor: "rgba(59,130,246,0.1)",
                      color: "#60a5fa",
                      "&:hover": { bgcolor: "rgba(59,130,246,0.2)" },
                    },
                  }}
                >
                  <RiEditLine size={13} />
                </IconButton>
              </Tooltip>

              <Tooltip title="O'chirish" placement="top" arrow>
                <IconButton
                  size="sm"
                  variant="soft"
                  onClick={() => setDeleteOpen(true)}
                  sx={{
                    borderRadius: "7px",
                    minWidth: 30,
                    minHeight: 30,
                    "[data-joy-color-scheme='light'] &": {
                      bgcolor: "#fff1f2",
                      color: "#dc2626",
                      "&:hover": { bgcolor: "#fecdd3" },
                    },
                    "[data-joy-color-scheme='dark'] &": {
                      bgcolor: "rgba(248,113,113,0.08)",
                      color: "#f87171",
                      "&:hover": { bgcolor: "rgba(248,113,113,0.15)" },
                    },
                  }}
                >
                  <RiDeleteBinLine size={13} />
                </IconButton>
              </Tooltip>
            </>
          ) : (
            <Button
              size="sm"
              startDecorator={<RiAddLine size={13} />}
              onClick={onAddQuiz}
              sx={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 700,
                fontSize: "0.8125rem",
                borderRadius: "8px",
                border: "none",
                "[data-joy-color-scheme='light'] &": {
                  background: "linear-gradient(135deg, #0284c7, #0369a1)",
                  color: "#fff",
                  "&:hover": {
                    background: "linear-gradient(135deg, #0369a1, #075985)",
                  },
                },
                "[data-joy-color-scheme='dark'] &": {
                  background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                  color: "#fff",
                  "&:hover": {
                    background: "linear-gradient(135deg, #2563eb, #1e40af)",
                  },
                },
              }}
            >
              Quiz qo'shish
            </Button>
          )}
        </Box>
      </Box>

      <ConfirmModal
        open={deleteOpen}
        title="Quizni o'chirish"
        message={`"${quiz?.title}" quizini o'chirasizmi?`}
        loading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate()}
        onClose={() => setDeleteOpen(false)}
      />
    </>
  );
}
