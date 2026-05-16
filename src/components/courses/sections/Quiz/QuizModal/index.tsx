"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  Box,
  Typography,
  Input,
  Button,
  FormControl,
  FormLabel,
  Textarea,
  CircularProgress,
  Divider,
  IconButton,
} from "@mui/joy";
import {
  RiAddLine,
  RiDeleteBinLine,
  RiSaveLine,
  RiCloseLine,
  RiQuestionLine,
  RiCheckLine,
} from "react-icons/ri";
import { Quiz, CreateQuizDto } from "@/types/quiz.types";
import QuizService from "@/services/quizService";
import { useSnackbarStore } from "@/store/snackbarStore";
import { gsap } from "@/lib/gsap";
import { stopLenis, startLenis } from "@/lib/lenis";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData?: Quiz | null;
  lessonId?: number | null;
}

interface QuestionForm {
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  order: number;
}

const emptyQuestion = (order: number): QuestionForm => ({
  questionText: "",
  options: ["", "", "", ""],
  correctOptionIndex: 0,
  order,
});

const OPTION_LABELS = ["A", "B", "C", "D"];

export default function QuizModal({
  open,
  onClose,
  onSuccess,
  editData,
  lessonId,
}: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<QuestionForm[]>([
    emptyQuestion(1),
  ]);
  const isEdit = !!editData;

  // ✅ Lenis scroll lock
  useEffect(() => {
    if (open) {
      document.documentElement.classList.add("lenis-stopped");
    } else {
      document.documentElement.classList.remove("lenis-stopped");
    }
    return () => {
      document.documentElement.classList.remove("lenis-stopped");
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (editData) {
      setTitle(editData.title ?? "");
      setDescription(editData.description ?? "");
      setQuestions(
        editData.questions?.length
          ? editData.questions.map((q, i) => ({
              questionText: q.questionText,
              options: [...q.options],
              correctOptionIndex: q.correctOptionIndex,
              order: q.order ?? i + 1,
            }))
          : [emptyQuestion(1)],
      );
    } else {
      setTitle("");
      setDescription("");
      setQuestions([emptyQuestion(1)]);
    }
    setTimeout(() => {
      if (dialogRef.current) {
        gsap.fromTo(
          dialogRef.current,
          { scale: 0.95, opacity: 0, y: 10 },
          { scale: 1, opacity: 1, y: 0, duration: 0.28, ease: "back.out(1.2)" },
        );
      }
    }, 10);
  }, [open, editData]);

  if (!open) return null;

  const modalContent = (
    // MODAL_CONTENT_START
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
    </div>
  );

  const addQuestion = () =>
    setQuestions((prev) => [...prev, emptyQuestion(prev.length + 1)]);

  const removeQuestion = (index: number) =>
    setQuestions((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((q, i) => ({ ...q, order: i + 1 })),
    );

  const updateQuestion = (
    index: number,
    field: keyof QuestionForm,
    value: any,
  ) =>
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, [field]: value } : q)),
    );

  const updateOption = (qIndex: number, oIndex: number, value: string) =>
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              options: q.options.map((o, j) => (j === oIndex ? value : o)),
            }
          : q,
      ),
    );

  const handleSubmit = async () => {
    if (!title.trim()) {
      useSnackbarStore.getState().error("Quiz nomi kiritilishi shart");
      return;
    }
    for (const q of questions) {
      if (!q.questionText.trim()) {
        useSnackbarStore
          .getState()
          .error("Barcha savol matnlari kiritilishi shart");
        return;
      }
      if (q.options.some((o) => !o.trim())) {
        useSnackbarStore
          .getState()
          .error("Barcha javob variantlari kiritilishi shart");
        return;
      }
    }
    setLoading(true);
    try {
      if (isEdit && editData) {
        const updateDto = {
          title,
          description: description || undefined,
          questions: questions.map((q) => ({
            questionText: q.questionText,
            options: q.options,
            correctOptionIndex: q.correctOptionIndex,
            order: q.order,
          })),
        };
        await QuizService.update(editData.id, updateDto);
        useSnackbarStore.getState().success("Quiz yangilandi!");
      } else {
        const createDto: CreateQuizDto = {
          title,
          description: description || undefined,
          lessonId: lessonId ?? undefined,
          questions: questions.map((q) => ({
            questionText: q.questionText,
            options: q.options,
            correctOptionIndex: q.correctOptionIndex,
            order: q.order,
          })),
        };
        await QuizService.create(createDto);
        useSnackbarStore.getState().success("Quiz yaratildi!");
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      useSnackbarStore
        .getState()
        .error(err?.response?.data?.message ?? "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const inputSx = {
    fontFamily: "var(--font-montserrat)",
    fontSize: "0.875rem",
    borderRadius: "8px",
    "[data-joy-color-scheme='light'] &": {
      bgcolor: "#f8fafc",
      borderColor: "#e2e8f0",
      "& input": { color: "#0f172a" },
    },
    "[data-joy-color-scheme='dark'] &": {
      bgcolor: "#26262d",
      borderColor: "#3a3a44",
      "& input": { color: "#fafafa" },
    },
  };

  const labelSx = {
    fontFamily: "var(--font-montserrat)",
    fontWeight: 600,
    fontSize: "0.8125rem",
    mb: 0.5,
    color: "text.primary",
  };

  return createPortal(
    <Box
      data-quiz-modal="open"
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 1300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      {/* Backdrop */}
      <Box
        onClick={loading ? undefined : onClose}
        sx={{
          position: "absolute",
          inset: 0,
          bgcolor: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(4px)",
        }}
      />

      {/* Dialog */}
      <Box
        ref={dialogRef}
        sx={{
          position: "relative",
          zIndex: 1,
          width: { xs: "95vw", sm: 640 },
          maxHeight: "88vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: "12px",
          border: "1px solid",
          overflow: "hidden",
          "[data-joy-color-scheme='light'] &": {
            bgcolor: "#ffffff",
            borderColor: "#e2e8f0",
            boxShadow: "0 24px 48px rgba(15,23,42,0.12)",
          },
          "[data-joy-color-scheme='dark'] &": {
            bgcolor: "#1c1c21",
            borderColor: "#3a3a44",
            boxShadow: "0 24px 48px rgba(0,0,0,0.5)",
          },
        }}
      >
        {/* ── Header ── */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 3,
            py: 2.5,
            flexShrink: 0,
            borderBottom: "1px solid",
            "[data-joy-color-scheme='light'] &": { borderColor: "#e2e8f0" },
            "[data-joy-color-scheme='dark'] &": { borderColor: "#3a3a44" },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                "[data-joy-color-scheme='light'] &": {
                  bgcolor: "#e0f2fe",
                  color: "#0284c7",
                },
                "[data-joy-color-scheme='dark'] &": {
                  bgcolor: "rgba(168,85,247,0.12)",
                  color: "#c084fc",
                },
              }}
            >
              <RiQuestionLine size={18} />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: "text.primary",
                }}
              >
                {isEdit ? "Quizni tahrirlash" : "Yangi Quiz"}
              </Typography>
              {lessonId && (
                <Typography
                  sx={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.75rem",
                    color: "text.tertiary",
                  }}
                >
                  Dars ID: {lessonId}
                </Typography>
              )}
            </Box>
          </Box>
          {!loading && (
            <Box
              onClick={onClose}
              sx={{
                width: 32,
                height: 32,
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.15s ease",
                "[data-joy-color-scheme='light'] &": {
                  color: "#64748b",
                  "&:hover": { bgcolor: "#f1f5f9" },
                },
                "[data-joy-color-scheme='dark'] &": {
                  color: "#71717d",
                  "&:hover": { bgcolor: "#26262d" },
                },
              }}
            >
              <RiCloseLine size={20} />
            </Box>
          )}
        </Box>

        {/* ── Scrollable body ── */}
        <Box
          data-lenis-prevent
          sx={{
            flex: 1,
            overflowY: "auto", // ✅ Faqat bu scroll qiladi
            p: 3,
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
            "&::-webkit-scrollbar": { width: 5 },
            "&::-webkit-scrollbar-track": { background: "transparent" },
            "[data-joy-color-scheme='light'] &::-webkit-scrollbar-thumb": {
              background: "#cbd5e1",
              borderRadius: "99px",
            },
            "[data-joy-color-scheme='dark'] &::-webkit-scrollbar-thumb": {
              background: "#3a3a44",
              borderRadius: "99px",
            },
          }}
        >
          {/* Quiz nomi */}
          <FormControl>
            <FormLabel sx={labelSx}>Quiz nomi</FormLabel>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masalan: 1-dars bo'yicha test"
              disabled={loading}
              sx={inputSx}
            />
          </FormControl>

          {/* Tavsif */}
          <FormControl>
            <FormLabel sx={labelSx}>Tavsif (ixtiyoriy)</FormLabel>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Quiz haqida qisqacha..."
              minRows={2}
              disabled={loading}
              sx={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.875rem",
                borderRadius: "8px",
                "[data-joy-color-scheme='light'] &": {
                  bgcolor: "#f8fafc",
                  borderColor: "#e2e8f0",
                  "& textarea": { color: "#0f172a" },
                },
                "[data-joy-color-scheme='dark'] &": {
                  bgcolor: "#26262d",
                  borderColor: "#3a3a44",
                  "& textarea": { color: "#fafafa" },
                },
              }}
            />
          </FormControl>

          <Divider
            sx={{
              "[data-joy-color-scheme='light'] &": { borderColor: "#e2e8f0" },
              "[data-joy-color-scheme='dark'] &": { borderColor: "#3a3a44" },
            }}
          />

          {/* Savollar header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                sx={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 700,
                  fontSize: "0.9375rem",
                  color: "text.primary",
                }}
              >
                Savollar
              </Typography>
              <Box
                sx={{
                  px: 1,
                  py: 0.25,
                  borderRadius: "6px",
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  "[data-joy-color-scheme='light'] &": {
                    bgcolor: "#e0f2fe",
                    color: "#0284c7",
                  },
                  "[data-joy-color-scheme='dark'] &": {
                    bgcolor: "rgba(168,85,247,0.12)",
                    color: "#c084fc",
                  },
                }}
              >
                {questions.length}
              </Box>
            </Box>
            <Button
              size="sm"
              startDecorator={<RiAddLine size={14} />}
              onClick={addQuestion}
              disabled={loading}
              sx={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 600,
                borderRadius: "8px",
                border: "none",
                "[data-joy-color-scheme='light'] &": {
                  bgcolor: "#e0f2fe",
                  color: "#0284c7",
                  "&:hover": { bgcolor: "#bae6fd" },
                },
                "[data-joy-color-scheme='dark'] &": {
                  bgcolor: "rgba(168,85,247,0.1)",
                  color: "#c084fc",
                  "&:hover": { bgcolor: "rgba(168,85,247,0.2)" },
                },
              }}
            >
              Savol qo'shish
            </Button>
          </Box>

          {/* Savollar */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {questions.map((q, qIdx) => (
              <Box
                key={qIdx}
                sx={{
                  p: 2,
                  borderRadius: "10px",
                  border: "1px solid",
                  "[data-joy-color-scheme='light'] &": {
                    bgcolor: "#f8fafc",
                    borderColor: "#e2e8f0",
                  },
                  "[data-joy-color-scheme='dark'] &": {
                    bgcolor: "#26262d",
                    borderColor: "#3a3a44",
                  },
                }}
              >
                {/* Savol header */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      px: 1,
                      py: 0.25,
                      borderRadius: "6px",
                      fontFamily: "var(--font-montserrat)",
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      "[data-joy-color-scheme='light'] &": {
                        bgcolor: "#e0f2fe",
                        color: "#0284c7",
                      },
                      "[data-joy-color-scheme='dark'] &": {
                        bgcolor: "rgba(168,85,247,0.12)",
                        color: "#c084fc",
                      },
                    }}
                  >
                    {qIdx + 1}-savol
                  </Box>
                  {questions.length > 1 && (
                    <IconButton
                      size="sm"
                      variant="soft"
                      onClick={() => removeQuestion(qIdx)}
                      disabled={loading}
                      sx={{
                        borderRadius: "6px",
                        "[data-joy-color-scheme='light'] &": {
                          bgcolor: "#fff1f2",
                          color: "#dc2626",
                        },
                        "[data-joy-color-scheme='dark'] &": {
                          bgcolor: "rgba(248,113,113,0.08)",
                          color: "#f87171",
                        },
                      }}
                    >
                      <RiDeleteBinLine size={13} />
                    </IconButton>
                  )}
                </Box>

                {/* Savol matni */}
                <FormControl sx={{ mb: 1.5 }}>
                  <FormLabel sx={{ ...labelSx, fontSize: "0.75rem" }}>
                    Savol matni
                  </FormLabel>
                  <Input
                    value={q.questionText}
                    onChange={(e) =>
                      updateQuestion(qIdx, "questionText", e.target.value)
                    }
                    placeholder="Savol kiriting..."
                    disabled={loading}
                    sx={inputSx}
                  />
                </FormControl>

                {/* Variantlar */}
                <FormLabel
                  sx={{
                    ...labelSx,
                    fontSize: "0.75rem",
                    display: "block",
                    mb: 1,
                  }}
                >
                  Javob variantlari — to'g'risini tanlang
                </FormLabel>
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}
                >
                  {q.options.map((opt, oIdx) => {
                    const isCorrect = q.correctOptionIndex === oIdx;
                    return (
                      <Box
                        key={oIdx}
                        onClick={() =>
                          updateQuestion(qIdx, "correctOptionIndex", oIdx)
                        }
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          p: 1,
                          borderRadius: "8px",
                          border: "1.5px solid",
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                          "[data-joy-color-scheme='light'] &": {
                            borderColor: isCorrect ? "#0284c7" : "#e2e8f0",
                            bgcolor: isCorrect ? "#f0f9ff" : "#ffffff",
                          },
                          "[data-joy-color-scheme='dark'] &": {
                            borderColor: isCorrect ? "#9333ea" : "#3a3a44",
                            bgcolor: isCorrect
                              ? "rgba(147,51,234,0.06)"
                              : "#1c1c21",
                          },
                        }}
                      >
                        {/* Radio */}
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            border: "2px solid",
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.15s ease",
                            "[data-joy-color-scheme='light'] &": {
                              borderColor: isCorrect ? "#0284c7" : "#94a3b8",
                              bgcolor: isCorrect ? "#0284c7" : "transparent",
                            },
                            "[data-joy-color-scheme='dark'] &": {
                              borderColor: isCorrect ? "#9333ea" : "#52525e",
                              bgcolor: isCorrect ? "#9333ea" : "transparent",
                            },
                          }}
                        >
                          {isCorrect && <RiCheckLine size={12} color="#fff" />}
                        </Box>

                        {/* A B C D */}
                        <Box
                          sx={{
                            width: 22,
                            height: 22,
                            borderRadius: "6px",
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontFamily: "var(--font-montserrat)",
                            fontWeight: 700,
                            fontSize: "0.75rem",
                            transition: "all 0.15s ease",
                            "[data-joy-color-scheme='light'] &": {
                              bgcolor: isCorrect ? "#0284c7" : "#e2e8f0",
                              color: isCorrect ? "#fff" : "#475569",
                            },
                            "[data-joy-color-scheme='dark'] &": {
                              bgcolor: isCorrect ? "#9333ea" : "#3a3a44",
                              color: isCorrect ? "#fff" : "#a1a1aa",
                            },
                          }}
                        >
                          {OPTION_LABELS[oIdx]}
                        </Box>

                        {/* Input */}
                        <Input
                          value={opt}
                          onChange={(e) =>
                            updateOption(qIdx, oIdx, e.target.value)
                          }
                          onClick={(e) => e.stopPropagation()}
                          placeholder={`${oIdx + 1}-variant`}
                          disabled={loading}
                          sx={{
                            flex: 1,
                            border: "none",
                            bgcolor: "transparent",
                            fontFamily: "var(--font-montserrat)",
                            fontSize: "0.875rem",
                            borderRadius: "6px",
                            "--Input-focusedHighlight": "transparent",
                            boxShadow: "none",
                            "& input": {
                              "[data-joy-color-scheme='light'] &": {
                                color: "#0f172a",
                              },
                              "[data-joy-color-scheme='dark'] &": {
                                color: "#fafafa",
                              },
                            },
                          }}
                        />

                        {/* To'g'ri badge */}
                        {isCorrect && (
                          <Box
                            sx={{
                              px: 1,
                              py: 0.25,
                              borderRadius: "5px",
                              flexShrink: 0,
                              fontFamily: "var(--font-montserrat)",
                              fontWeight: 700,
                              fontSize: "0.6875rem",
                              "[data-joy-color-scheme='light'] &": {
                                bgcolor: "#0284c7",
                                color: "#fff",
                              },
                              "[data-joy-color-scheme='dark'] &": {
                                bgcolor: "#9333ea",
                                color: "#fff",
                              },
                            }}
                          >
                            To'g'ri
                          </Box>
                        )}
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            ))}
          </Box>
          <Box sx={{ height: 4 }} />
        </Box>

        {/* ── Footer ── */}
        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            justifyContent: "flex-end",
            px: 3,
            py: 2,
            flexShrink: 0,
            borderTop: "1px solid",
            "[data-joy-color-scheme='light'] &": {
              borderColor: "#e2e8f0",
              bgcolor: "#f8fafc",
            },
            "[data-joy-color-scheme='dark'] &": {
              borderColor: "#3a3a44",
              bgcolor: "#18181b",
            },
          }}
        >
          <Button
            variant="plain"
            color="neutral"
            onClick={onClose}
            disabled={loading}
            startDecorator={<RiCloseLine size={16} />}
            sx={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 600,
              borderRadius: "8px",
            }}
          >
            Bekor qilish
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            startDecorator={
              loading ? (
                <CircularProgress
                  size="sm"
                  sx={{ "--CircularProgress-size": "16px" }}
                />
              ) : (
                <RiSaveLine size={16} />
              )
            }
            sx={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 700,
              borderRadius: "8px",
              border: "none",
              "[data-joy-color-scheme='light'] &": {
                bgcolor: "#0284c7",
                color: "#fff",
                "&:hover": { bgcolor: "#0369a1" },
              },
              "[data-joy-color-scheme='dark'] &": {
                bgcolor: "#9333ea",
                color: "#fff",
                "&:hover": { bgcolor: "#7e22ce" },
              },
            }}
          >
            {loading ? "Saqlanmoqda..." : isEdit ? "Yangilash" : "Yaratish"}
          </Button>
        </Box>
      </Box>
    </Box>,
    document.body
  );
}
