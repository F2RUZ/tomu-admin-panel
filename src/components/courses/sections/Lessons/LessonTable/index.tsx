// src/components/courses/sections/Lessons/LessonTable/index.tsx
"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Modal,
  ModalDialog,
  ModalClose,
  Input,
} from "@mui/joy";
import {
  RiEditLine,
  RiDeleteBinLine,
  RiPlayCircleLine,
  RiTimeLine,
  RiAddLine,
  RiSearchLine,
  RiLink,
} from "react-icons/ri";
import { Lesson } from "@/types/lesson.types";
import LessonService from "@/services/lessonService";
import { useSnackbarStore } from "@/store/snackbarStore";
import LessonModal from "@/components/courses/sections/Lessons/LessonModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import EmptyState from "@/components/ui/EmptyState";
import Pagination from "@/components/ui/Pagination";
import { Button } from "@mui/joy";

interface LessonTableProps {
  blockId: number;
  blockTitle: string;
}

const formatDuration = (s: number) =>
  `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
const formatSize = (b: number) =>
  b >= 1024 * 1024
    ? `${(b / (1024 * 1024)).toFixed(1)} MB`
    : `${(b / 1024).toFixed(0)} KB`;

// ─── Skeleton ────────────────────────────────────────────────────────────────
function SkeletonRow() {
  const s = {
    borderRadius: "6px",
    "@keyframes shimmer": {
      "0%": { opacity: 1 },
      "50%": { opacity: 0.35 },
      "100%": { opacity: 1 },
    },
    animation: "shimmer 1.4s ease-in-out infinite",
    "[data-joy-color-scheme='light'] &": { bgcolor: "#e2e8f0" },
    "[data-joy-color-scheme='dark'] &": { bgcolor: "#3a3a44" },
  };
  return (
    <tr>
      <td style={{ padding: "12px 16px" }}>
        <Box sx={{ ...s, width: 20, height: 14 }} />
      </td>
      <td style={{ padding: "12px 16px" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              ...s,
              width: 32,
              height: 32,
              borderRadius: "8px",
              flexShrink: 0,
            }}
          />
          <Box sx={{ ...s, width: 140, height: 14 }} />
        </Box>
      </td>
      <td style={{ padding: "12px 16px" }}>
        <Box sx={{ ...s, width: 24, height: 24, borderRadius: "6px" }} />
      </td>
      <td style={{ padding: "12px 16px" }}>
        <Box sx={{ ...s, width: 48, height: 14 }} />
      </td>
      <td style={{ padding: "12px 16px" }}>
        <Box sx={{ ...s, width: 56, height: 14 }} />
      </td>
      <td style={{ padding: "12px 16px" }}>
        <Box sx={{ ...s, width: 20, height: 20, borderRadius: "6px" }} />
      </td>
      <td style={{ padding: "12px 16px" }}>
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Box sx={{ ...s, width: 30, height: 30, borderRadius: "8px" }} />
          <Box sx={{ ...s, width: 30, height: 30, borderRadius: "8px" }} />
        </Box>
      </td>
    </tr>
  );
}

export default function LessonTable({ blockId, blockTitle }: LessonTableProps) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(7);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<Lesson | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Lesson | null>(null);
  const [videoTarget, setVideoTarget] = useState<Lesson | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["lessons", blockId],
    queryFn: () => LessonService.getByBlock(blockId),
    select: (res) => (Array.isArray(res.data) ? res.data : []),
  });

  const lessons = data ?? [];

  const deleteMutation = useMutation({
    mutationFn: (id: number) => LessonService.delete(id),
    onSuccess: () => {
      useSnackbarStore.getState().success("Dars o'chirildi");
      queryClient.invalidateQueries({ queryKey: ["lessons", blockId] });
      setDeleteTarget(null);
    },
    onError: () => useSnackbarStore.getState().error("O'chirishda xatolik"),
  });

  const filtered = useMemo(() => {
    if (!search.trim()) return lessons;
    const q = search.toLowerCase();
    return lessons.filter((l) => l.title.toLowerCase().includes(q));
  }, [search, lessons]);

  const paginated = useMemo(() => {
    return filtered.slice((page - 1) * perPage, page * perPage);
  }, [filtered, page, perPage]);

  const tdStyle: React.CSSProperties = { padding: "12px 16px" };
  const cols = [
    "#",
    "Dars nomi",
    "Tartib",
    "Davomiylik",
    "Hajm",
    "Grammar",
    "Amallar",
  ];
  const widths = ["48px", "auto", "76px", "110px", "90px", "80px", "100px"];

  const iconBtnSx = (color: "blue" | "red") => ({
    borderRadius: "8px",
    "[data-joy-color-scheme='light'] &": {
      bgcolor: color === "blue" ? "#e0f2fe" : "#fff1f2",
      color: color === "blue" ? "#0284c7" : "#dc2626",
      "&:hover": { bgcolor: color === "blue" ? "#bae6fd" : "#fecdd3" },
    },
    "[data-joy-color-scheme='dark'] &": {
      bgcolor:
        color === "blue" ? "rgba(168,85,247,0.1)" : "rgba(248,113,113,0.08)",
      color: color === "blue" ? "#c084fc" : "#f87171",
      "&:hover": {
        bgcolor:
          color === "blue" ? "rgba(168,85,247,0.2)" : "rgba(248,113,113,0.15)",
      },
    },
  });

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Dars qidirish..."
            startDecorator={<RiSearchLine size={14} />}
            size="sm"
            sx={{
              borderRadius: "8px",
              width: 220,
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.8125rem",
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
            }}
          />
          <Typography
            sx={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.8125rem",
              color: "text.tertiary",
            }}
          >
            {lessons.length} ta dars
          </Typography>
        </Box>
        <Button
          size="sm"
          startDecorator={<RiAddLine size={15} />}
          onClick={() => {
            setEditData(null);
            setModalOpen(true);
          }}
          sx={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 700,
            fontSize: "0.8125rem",
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
          Yangi dars
        </Button>
      </Box>

      {/* Table */}
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
        <Box
          sx={{
            overflowX: "auto",
            "&::-webkit-scrollbar": { height: 4 },
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
          <table
            style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}
          >
            <thead>
              <tr>
                {cols.map((col, i) => (
                  <th
                    key={col}
                    style={{
                      padding: "10px 16px",
                      textAlign: "left",
                      width: widths[i],
                    }}
                  >
                    <Box
                      sx={{
                        fontFamily: "var(--font-montserrat)",
                        fontWeight: 700,
                        fontSize: "0.6875rem",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        pb: 1.25,
                        borderBottom: "2px solid",
                        "[data-joy-color-scheme='light'] &": {
                          color: "#64748b",
                          borderColor: "#e2e8f0",
                        },
                        "[data-joy-color-scheme='dark'] &": {
                          color: "#71717d",
                          borderColor: "#3a3a44",
                        },
                      }}
                    >
                      {col}
                    </Box>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: perPage }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: "40px 16px" }}>
                    <EmptyState
                      title={
                        search ? "Hech narsa topilmadi" : "Hali darslar yo'q"
                      }
                      action={
                        !search
                          ? {
                              label: "Dars yaratish",
                              onClick: () => setModalOpen(true),
                            }
                          : undefined
                      }
                    />
                  </td>
                </tr>
              ) : (
                paginated.map((lesson, idx) => (
                  <tr
                    key={lesson.id}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        document.documentElement.getAttribute(
                          "data-joy-color-scheme",
                        ) === "dark"
                          ? "rgba(255,255,255,0.02)"
                          : "rgba(0,0,0,0.015)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        "transparent";
                    }}
                  >
                    {/* # */}
                    <td style={tdStyle}>
                      <Typography
                        sx={{
                          fontFamily: "var(--font-montserrat)",
                          fontSize: "0.8125rem",
                          fontWeight: 500,
                          "[data-joy-color-scheme='light'] &": {
                            color: "#94a3b8",
                          },
                          "[data-joy-color-scheme='dark'] &": {
                            color: "#52525e",
                          },
                        }}
                      >
                        {(page - 1) * perPage + idx + 1}
                      </Typography>
                    </td>

                    {/* Title + Play */}
                    <td style={tdStyle}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        <Tooltip title="Videoni ko'rish" placement="top" arrow>
                          <Box
                            onClick={() => setVideoTarget(lesson)}
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: "8px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                              cursor: "pointer",
                              transition: "all 0.2s ease",
                              "[data-joy-color-scheme='light'] &": {
                                bgcolor: "#e0f2fe",
                                color: "#0284c7",
                                "&:hover": {
                                  bgcolor: "#0284c7",
                                  color: "#fff",
                                  transform: "scale(1.08)",
                                },
                              },
                              "[data-joy-color-scheme='dark'] &": {
                                bgcolor: "rgba(168,85,247,0.12)",
                                color: "#c084fc",
                                "&:hover": {
                                  bgcolor: "#9333ea",
                                  color: "#fff",
                                  transform: "scale(1.08)",
                                },
                              },
                            }}
                          >
                            <RiPlayCircleLine size={15} />
                          </Box>
                        </Tooltip>
                        <Typography
                          sx={{
                            fontFamily: "var(--font-montserrat)",
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            color: "text.primary",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {lesson.title}
                        </Typography>
                      </Box>
                    </td>

                    {/* Order */}
                    <td style={tdStyle}>
                      <Box
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 26,
                          height: 26,
                          borderRadius: "6px",
                          fontFamily: "var(--font-montserrat)",
                          fontWeight: 700,
                          fontSize: "0.8125rem",
                          "[data-joy-color-scheme='light'] &": {
                            bgcolor: "#f1f5f9",
                            color: "#475569",
                          },
                          "[data-joy-color-scheme='dark'] &": {
                            bgcolor: "#26262d",
                            color: "#a1a1aa",
                          },
                        }}
                      >
                        {lesson.order}
                      </Box>
                    </td>

                    {/* Duration */}
                    <td style={tdStyle}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <Box
                          sx={{
                            "[data-joy-color-scheme='light'] &": {
                              color: "#94a3b8",
                            },
                            "[data-joy-color-scheme='dark'] &": {
                              color: "#52525e",
                            },
                          }}
                        >
                          <RiTimeLine size={13} />
                        </Box>
                        <Typography
                          sx={{
                            fontFamily: "var(--font-montserrat)",
                            fontSize: "0.875rem",
                            color: "text.secondary",
                          }}
                        >
                          {formatDuration(lesson.duration)}
                        </Typography>
                      </Box>
                    </td>

                    {/* Size */}
                    <td style={tdStyle}>
                      <Typography
                        sx={{
                          fontFamily: "var(--font-montserrat)",
                          fontSize: "0.875rem",
                          color: "text.tertiary",
                        }}
                      >
                        {formatSize(lesson.size)}
                      </Typography>
                    </td>

                    {/* Grammar */}
                    <td style={tdStyle}>
                      {lesson.grammarLink ? (
                        <Tooltip
                          title="Grammar video bor"
                          placement="top"
                          arrow
                        >
                          <Box
                            sx={{
                              width: 26,
                              height: 26,
                              borderRadius: "6px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
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
                            <RiLink size={13} />
                          </Box>
                        </Tooltip>
                      ) : (
                        <Box sx={{ width: 26, height: 26 }} />
                      )}
                    </td>

                    {/* Actions */}
                    <td style={tdStyle}>
                      <Box sx={{ display: "flex", gap: 0.5 }}>
                        <Tooltip title="Tahrirlash" placement="top" arrow>
                          <IconButton
                            size="sm"
                            variant="soft"
                            onClick={() => {
                              setEditData(lesson);
                              setModalOpen(true);
                            }}
                            sx={iconBtnSx("blue")}
                          >
                            <RiEditLine size={14} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="O'chirish" placement="top" arrow>
                          <IconButton
                            size="sm"
                            variant="soft"
                            onClick={() => setDeleteTarget(lesson)}
                            sx={iconBtnSx("red")}
                          >
                            <RiDeleteBinLine size={14} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Box>
      </Box>

      {/* Pagination */}
      {!isLoading && filtered.length > 0 && (
        <Pagination
          total={filtered.length}
          page={page}
          perPage={perPage}
          onPageChange={setPage}
          onPerPageChange={(pp) => {
            setPerPage(pp);
            setPage(1);
          }}
          perPageOptions={[7, 14, 21, 50]}
        />
      )}

      {/* Video Modal */}
      <Modal open={!!videoTarget} onClose={() => setVideoTarget(null)}>
        <ModalDialog
          sx={{
            width: { xs: "95vw", sm: 760 },
            borderRadius: "8px",
            border: "1px solid",
            p: 0,
            overflow: "hidden",
            bgcolor: "#0a0a0f",
            borderColor: "#27272a",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 2.5,
              py: 1.5,
              bgcolor: "rgba(255,255,255,0.04)",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "rgba(147,51,234,0.2)",
                  color: "#c084fc",
                }}
              >
                <RiPlayCircleLine size={14} />
              </Box>
              <Typography
                sx={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 600,
                  fontSize: "0.9375rem",
                  color: "#fafafa",
                }}
              >
                {videoTarget?.title}
              </Typography>
            </Box>
            <ModalClose
              sx={{
                position: "static",
                borderRadius: "8px",
                color: "#71717d",
                "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
              }}
            />
          </Box>
          <Box sx={{ aspectRatio: "16/9", bgcolor: "#000" }}>
            {videoTarget?.vimeoEmbedUrl ? (
              <iframe
                src={`${videoTarget.vimeoEmbedUrl}?autoplay=1&color=9333ea`}
                style={{ width: "100%", height: "100%", border: "none" }}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title={videoTarget.title}
              />
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1.5,
                }}
              >
                <RiPlayCircleLine size={48} color="#3a3a44" />
                <Typography
                  sx={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.875rem",
                    color: "#52525e",
                  }}
                >
                  Video mavjud emas
                </Typography>
              </Box>
            )}
          </Box>
          <Box
            sx={{
              px: 2.5,
              py: 1.25,
              display: "flex",
              gap: 2,
              bgcolor: "rgba(255,255,255,0.03)",
              borderTop: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <RiTimeLine size={13} color="#71717d" />
              <Typography
                sx={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.8125rem",
                  color: "#71717d",
                }}
              >
                {videoTarget ? formatDuration(videoTarget.duration) : ""}
              </Typography>
            </Box>
            <Typography
              sx={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.8125rem",
                color: "#52525e",
              }}
            >
              •
            </Typography>
            <Typography
              sx={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.8125rem",
                color: "#71717d",
              }}
            >
              {videoTarget ? formatSize(videoTarget.size) : ""}
            </Typography>
            <Typography
              sx={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.8125rem",
                color: "#52525e",
              }}
            >
              •
            </Typography>
            <Typography
              sx={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.8125rem",
                color: "#71717d",
              }}
            >
              Tartib #{videoTarget?.order}
            </Typography>
          </Box>
        </ModalDialog>
      </Modal>

      {/* Lesson Modal */}
      <LessonModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditData(null);
        }}
        onSuccess={() =>
          queryClient.invalidateQueries({ queryKey: ["lessons", blockId] })
        }
        editData={editData}
        blockId={blockId}
      />

      {/* Delete Confirm */}
      <ConfirmModal
        open={!!deleteTarget}
        title="Darsni o'chirish"
        message={`"${deleteTarget?.title}" darsini o'chirasizmi?`}
        loading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        onClose={() => setDeleteTarget(null)}
      />
    </Box>
  );
}
