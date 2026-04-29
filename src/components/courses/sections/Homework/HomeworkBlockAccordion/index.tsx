// src/components/courses/sections/Homework/HomeworkBlockAccordion/index.tsx
"use client";

import { useState } from "react";
import { Box, Typography, IconButton, Tooltip } from "@mui/joy";
import {
  RiArrowDownSLine,
  RiEditLine,
  RiDeleteBinLine,
  RiHomeLine,
  RiTimeLine,
  RiVideoLine,
} from "react-icons/ri";
import { Block } from "@/types/block.types";
import HomeworkTable from "@/components/courses/sections/Homework/HomeworkTable";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import BlockService from "@/services/blockService";
import { useSnackbarStore } from "@/store/snackbarStore";

interface HomeworkBlockAccordionProps {
  block: Block;
  courseId: number;
  onEdit: (block: Block) => void;
  defaultOpen?: boolean;
}

const formatDuration = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}s ${m}d`;
  return `${m} daqiqa`;
};

export default function HomeworkBlockAccordion({
  block,
  courseId,
  onEdit,
  defaultOpen = false,
}: HomeworkBlockAccordionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => BlockService.delete(block.id),
    onSuccess: () => {
      useSnackbarStore.getState().success("Blok o'chirildi");
      queryClient.invalidateQueries({ queryKey: ["homeworkBlocks", courseId] });
      setDeleteOpen(false);
    },
    onError: () => useSnackbarStore.getState().error("O'chirishda xatolik"),
  });

  return (
    <Box
      sx={{
        borderRadius: "8px",
        border: "1px solid",
        overflow: "hidden",
        "[data-joy-color-scheme='light'] &": {
          borderColor: "#e2e8f0",
          bgcolor: "#ffffff",
        },
        "[data-joy-color-scheme='dark'] &": {
          borderColor: "#3a3a44",
          bgcolor: "#1c1c21",
        },
      }}
    >
      {/* Header */}
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
          "&:hover": {
            "[data-joy-color-scheme='light'] &": { bgcolor: "#fffbeb" },
            "[data-joy-color-scheme='dark'] &": {
              bgcolor: "rgba(251,191,36,0.03)",
            },
          },
        }}
      >
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 0 }}
        >
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
                bgcolor: "#fef3c7",
                color: "#d97706",
              },
              "[data-joy-color-scheme='dark'] &": {
                bgcolor: "rgba(251,191,36,0.1)",
                color: "#fbbf24",
              },
            }}
          >
            <RiArrowDownSLine size={16} />
          </Box>

          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "8px",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "[data-joy-color-scheme='light'] &": {
                bgcolor: "#fef3c7",
                color: "#d97706",
              },
              "[data-joy-color-scheme='dark'] &": {
                bgcolor: "rgba(251,191,36,0.1)",
                color: "#fbbf24",
              },
            }}
          >
            <RiHomeLine size={17} />
          </Box>

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
                    bgcolor: "#fef3c7",
                    color: "#d97706",
                  },
                  "[data-joy-color-scheme='dark'] &": {
                    bgcolor: "rgba(251,191,36,0.1)",
                    color: "#fbbf24",
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
                  {block.countVideos} ta vazifa
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

        <Box
          sx={{ display: "flex", gap: 0.75, flexShrink: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Tooltip title="Blokni tahrirlash" placement="top" arrow>
            <IconButton
              size="sm"
              variant="soft"
              onClick={() => onEdit(block)}
              sx={{
                borderRadius: "8px",
                "[data-joy-color-scheme='light'] &": {
                  bgcolor: "#fef3c7",
                  color: "#d97706",
                  "&:hover": { bgcolor: "#fde68a" },
                },
                "[data-joy-color-scheme='dark'] &": {
                  bgcolor: "rgba(251,191,36,0.08)",
                  color: "#fbbf24",
                  "&:hover": { bgcolor: "rgba(251,191,36,0.15)" },
                },
              }}
            >
              <RiEditLine size={14} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Blokni o'chirish" placement="top" arrow>
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
      </Box>

      {/* Content */}
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
            pt: 0,
            borderTop: open ? "1px solid" : "none",
            "[data-joy-color-scheme='light'] &": { borderColor: "#fef3c7" },
            "[data-joy-color-scheme='dark'] &": {
              borderColor: "rgba(251,191,36,0.1)",
            },
          }}
        >
          <Box sx={{ pt: 2.5 }}>
            <HomeworkTable blockId={block.id} blockTitle={block.title} />
          </Box>
        </Box>
      </Box>

      <ConfirmModal
        open={deleteOpen}
        title="Blokni o'chirish"
        message={`"${block.title}" blokini o'chirasizmi? Barcha uy vazifalari ham o'chib ketadi!`}
        loading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate()}
        onClose={() => setDeleteOpen(false)}
      />
    </Box>
  );
}
