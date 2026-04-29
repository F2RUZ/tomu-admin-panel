// src/components/courses/sections/Lessons/BlockAccordion/index.tsx
"use client";

import { useState, useRef } from "react";
import { Box, Typography, IconButton, Tooltip } from "@mui/joy";
import {
  RiArrowDownSLine,
  RiEditLine,
  RiDeleteBinLine,
  RiVideoLine,
  RiTimeLine,
} from "react-icons/ri";
import { Block } from "@/types/block.types";
import LessonTable from "@/components/courses/sections/Lessons/LessonTable";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import BlockService from "@/services/blockService";
import { useSnackbarStore } from "@/store/snackbarStore";

interface BlockAccordionProps {
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

export default function BlockAccordion({
  block,
  courseId,
  onEdit,
  defaultOpen = false,
}: BlockAccordionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => BlockService.delete(block.id),
    onSuccess: () => {
      useSnackbarStore.getState().success("Blok o'chirildi");
      queryClient.invalidateQueries({ queryKey: ["lessonBlocks", courseId] });
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
        transition: "box-shadow 0.2s ease",
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
      {/* ─── Accordion Header ─────────────────────────────── */}
      <Box
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
            "[data-joy-color-scheme='light'] &": { bgcolor: "#f8fafc" },
            "[data-joy-color-scheme='dark'] &": {
              bgcolor: "rgba(255,255,255,0.02)",
            },
          },
        }}
        onClick={() => setOpen((v) => !v)}
      >
        {/* Left — icon + title + meta */}
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 0 }}
        >
          {/* Collapse arrow */}
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
                bgcolor: "#f1f5f9",
                color: "#64748b",
              },
              "[data-joy-color-scheme='dark'] &": {
                bgcolor: "#26262d",
                color: "#a1a1aa",
              },
            }}
          >
            <RiArrowDownSLine size={16} />
          </Box>

          {/* Block icon */}
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
                bgcolor: "#e0f2fe",
                color: "#0284c7",
              },
              "[data-joy-color-scheme='dark'] &": {
                bgcolor: "rgba(168,85,247,0.12)",
                color: "#c084fc",
              },
            }}
          >
            <RiVideoLine size={17} />
          </Box>

          {/* Title + meta */}
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
              {/* Order badge */}
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
                    bgcolor: "#f1f5f9",
                    color: "#64748b",
                  },
                  "[data-joy-color-scheme='dark'] &": {
                    bgcolor: "#26262d",
                    color: "#a1a1aa",
                  },
                }}
              >
                #{block.order}
              </Box>
            </Box>

            {/* Meta */}
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
                  {block.countVideos} ta video
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

        {/* Right — actions */}
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

      {/* ─── Accordion Content ─────────────────────────────── */}
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
            "[data-joy-color-scheme='light'] &": { borderColor: "#f1f5f9" },
            "[data-joy-color-scheme='dark'] &": { borderColor: "#26262d" },
          }}
        >
          <Box sx={{ pt: 2.5 }}>
            <LessonTable blockId={block.id} blockTitle={block.title} />
          </Box>
        </Box>
      </Box>

      {/* Delete confirm */}
      <ConfirmModal
        open={deleteOpen}
        title="Blokni o'chirish"
        message={`"${block.title}" blokini o'chirasizmi? Barcha darslar ham o'chib ketadi!`}
        loading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate()}
        onClose={() => setDeleteOpen(false)}
      />
    </Box>
  );
}
