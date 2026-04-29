// src/components/courses/sections/Homework/HomeworkTable/index.tsx
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
} from "react-icons/ri";
import { Homework } from "@/types/homework.types";
import HomeworkService from "@/services/homeworkService";
import { useSnackbarStore } from "@/store/snackbarStore";
import HomeworkModal from "@/components/courses/sections/Homework/HomeworkModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import EmptyState from "@/components/ui/EmptyState";
import Pagination from "@/components/ui/Pagination";
import { Button } from "@mui/joy";

interface HomeworkTableProps {
  blockId: number;
  blockTitle: string;
}

const formatDuration = (s: number) =>
  `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
const formatSize = (b: number) =>
  b >= 1024 * 1024
    ? `${(b / (1024 * 1024)).toFixed(1)} MB`
    : `${(b / 1024).toFixed(0)} KB`;

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
          <Box sx={{ ...s, width: 200, height: 14 }} />
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
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Box sx={{ ...s, width: 30, height: 30, borderRadius: "8px" }} />
          <Box sx={{ ...s, width: 30, height: 30, borderRadius: "8px" }} />
        </Box>
      </td>
    </tr>
  );
}

export default function HomeworkTable({
  blockId,
  blockTitle,
}: HomeworkTableProps) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(7);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<Homework | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Homework | null>(null);
  const [videoTarget, setVideoTarget] = useState<Homework | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["homeworks", blockId],
    queryFn: () => HomeworkService.getByBlock(blockId),
    select: (res) => {
      const arr = Array.isArray(res.data) ? res.data : [];
      return [...arr].sort((a, b) => a.order - b.order);
    },
  });

  const homeworks = data ?? [];

  const deleteMutation = useMutation({
    mutationFn: (id: number) => HomeworkService.delete(id),
    onSuccess: () => {
      useSnackbarStore.getState().success("Uy vazifasi o'chirildi");
      queryClient.invalidateQueries({ queryKey: ["homeworks", blockId] });
      setDeleteTarget(null);
    },
    onError: () => useSnackbarStore.getState().error("O'chirishda xatolik"),
  });

  const filtered = useMemo(() => {
    if (!search.trim()) return homeworks;
    const q = search.toLowerCase();
    return homeworks.filter((h) => (h.title ?? "").toLowerCase().includes(q));
  }, [search, homeworks]);

  const paginated = useMemo(
    () => filtered.slice((page - 1) * perPage, page * perPage),
    [filtered, page, perPage],
  );

  const tdStyle: React.CSSProperties = { padding: "12px 16px" };
  const cols = [
    "#",
    "Vazifa tavsifi",
    "Tartib",
    "Davomiylik",
    "Hajm",
    "Amallar",
  ];
  const widths = ["48px", "auto", "80px", "120px", "100px", "100px"];

  const iconBtnSx = (color: "orange" | "red") => ({
    borderRadius: "8px",
    "[data-joy-color-scheme='light'] &": {
      bgcolor: color === "orange" ? "#fef3c7" : "#fff1f2",
      color: color === "orange" ? "#d97706" : "#dc2626",
      "&:hover": { bgcolor: color === "orange" ? "#fde68a" : "#fecdd3" },
    },
    "[data-joy-color-scheme='dark'] &": {
      bgcolor:
        color === "orange" ? "rgba(251,191,36,0.08)" : "rgba(248,113,113,0.08)",
      color: color === "orange" ? "#fbbf24" : "#f87171",
      "&:hover": {
        bgcolor:
          color === "orange"
            ? "rgba(251,191,36,0.15)"
            : "rgba(248,113,113,0.15)",
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
            placeholder="Vazifa qidirish..."
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
            {homeworks.length} ta vazifa
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
              bgcolor: "#d97706",
              color: "#fff",
              "&:hover": { bgcolor: "#b45309" },
            },
            "[data-joy-color-scheme='dark'] &": {
              bgcolor: "#f59e0b",
              color: "#000",
              "&:hover": { bgcolor: "#d97706" },
            },
          }}
        >
          Yangi vazifa
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
            "&::-webkit-scrollbar": { height: 6 },
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
            style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}
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
                  <td colSpan={6} style={{ padding: "40px 16px" }}>
                    <EmptyState
                      title={
                        search
                          ? "Hech narsa topilmadi"
                          : "Hali uy vazifalari yo'q"
                      }
                      description={
                        search
                          ? "Boshqa kalit so'z bilan qidiring"
                          : "Birinchi uy vazifasini yarating"
                      }
                      action={
                        !search
                          ? {
                              label: "Vazifa yaratish",
                              onClick: () => setModalOpen(true),
                            }
                          : undefined
                      }
                    />
                  </td>
                </tr>
              ) : (
                paginated.map((hw, idx) => (
                  <tr
                    key={hw.id}
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

                    <td style={tdStyle}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        <Tooltip title="Videoni ko'rish" placement="top" arrow>
                          <Box
                            onClick={() => setVideoTarget(hw)}
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
                                bgcolor: "#fef3c7",
                                color: "#d97706",
                                "&:hover": {
                                  bgcolor: "#d97706",
                                  color: "#fff",
                                  transform: "scale(1.08)",
                                },
                              },
                              "[data-joy-color-scheme='dark'] &": {
                                bgcolor: "rgba(251,191,36,0.1)",
                                color: "#fbbf24",
                                "&:hover": {
                                  bgcolor: "#f59e0b",
                                  color: "#000",
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
                            maxWidth: 400,
                          }}
                        >
                          {hw.title || `Vazifa #${hw.order}`}
                        </Typography>
                      </Box>
                    </td>

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
                            bgcolor: "#fef3c7",
                            color: "#d97706",
                          },
                          "[data-joy-color-scheme='dark'] &": {
                            bgcolor: "rgba(251,191,36,0.1)",
                            color: "#fbbf24",
                          },
                        }}
                      >
                        {hw.order}
                      </Box>
                    </td>

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
                          {formatDuration(hw.duration)}
                        </Typography>
                      </Box>
                    </td>

                    <td style={tdStyle}>
                      <Typography
                        sx={{
                          fontFamily: "var(--font-montserrat)",
                          fontSize: "0.875rem",
                          color: "text.tertiary",
                        }}
                      >
                        {formatSize(hw.size)}
                      </Typography>
                    </td>

                    <td style={tdStyle}>
                      <Box sx={{ display: "flex", gap: 0.5 }}>
                        <Tooltip title="Tahrirlash" placement="top" arrow>
                          <IconButton
                            size="sm"
                            variant="soft"
                            onClick={() => {
                              setEditData(hw);
                              setModalOpen(true);
                            }}
                            sx={iconBtnSx("orange")}
                          >
                            <RiEditLine size={14} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="O'chirish" placement="top" arrow>
                          <IconButton
                            size="sm"
                            variant="soft"
                            onClick={() => setDeleteTarget(hw)}
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
                  bgcolor: "rgba(245,158,11,0.2)",
                  color: "#fbbf24",
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
                {videoTarget?.title || `Vazifa #${videoTarget?.order}`}
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
                src={`${videoTarget.vimeoEmbedUrl}?autoplay=1&color=f59e0b`}
                style={{ width: "100%", height: "100%", border: "none" }}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title={videoTarget.title ?? ""}
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

      <HomeworkModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditData(null);
        }}
        onSuccess={() =>
          queryClient.invalidateQueries({ queryKey: ["homeworks", blockId] })
        }
        editData={editData}
        blockId={blockId}
      />

      <ConfirmModal
        open={!!deleteTarget}
        title="Uy vazifasini o'chirish"
        message={`"${deleteTarget?.title || `Vazifa #${deleteTarget?.order}`}" ni o'chirasizmi?`}
        loading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        onClose={() => setDeleteTarget(null)}
      />
    </Box>
  );
}
