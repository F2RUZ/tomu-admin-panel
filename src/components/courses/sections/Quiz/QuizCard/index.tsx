"use client";

import { Box, IconButton, Tooltip } from "@mui/joy";
import { RiEditLine, RiDeleteBinLine } from "react-icons/ri";
import { useMutation } from "@tanstack/react-query";
import QuizService from "@/services/quizService";
import { useSnackbarStore } from "@/store/snackbarStore";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useState } from "react";
import { Quiz } from "@/types/quiz.types";

interface Props {
  quiz: Quiz;
  onEdit: () => void;
  onDeleteSuccess: () => void;
}

export default function QuizCard({ quiz, onEdit, onDeleteSuccess }: Props) {
  const [deleteOpen, setDeleteOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => QuizService.delete(quiz.id),
    onSuccess: () => {
      useSnackbarStore.getState().success("Quiz o'chirildi");
      onDeleteSuccess();
      setDeleteOpen(false);
    },
    onError: () => useSnackbarStore.getState().error("O'chirishda xatolik"),
  });

  return (
    <>
      <Box sx={{ display: "flex", gap: 0.5 }}>
        <Tooltip title="Tahrirlash" placement="top" arrow>
          <IconButton
            size="sm"
            variant="soft"
            onClick={onEdit}
            sx={{
              borderRadius: "8px",
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
            <RiEditLine size={14} />
          </IconButton>
        </Tooltip>
        <Tooltip title="O'chirish" placement="top" arrow>
          <IconButton
            size="sm"
            variant="soft"
            onClick={() => setDeleteOpen(true)}
            sx={{
              borderRadius: "8px",
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
            <RiDeleteBinLine size={14} />
          </IconButton>
        </Tooltip>
      </Box>

      <ConfirmModal
        open={deleteOpen}
        title="Quizni o'chirish"
        message={`"${quiz.title}" quizini o'chirasizmi?`}
        loading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate()}
        onClose={() => setDeleteOpen(false)}
      />
    </>
  );
}
