// src/components/courses/sections/Alphabet/AlphabetTable/index.tsx
"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Typography,
  Input,
  IconButton,
  Tooltip,
  Modal,
  ModalDialog,
  ModalClose,
} from "@mui/joy";
import {
  RiSearchLine,
  RiEditLine,
  RiDeleteBinLine,
  RiPlayCircleLine,
  RiTimeLine,
} from "react-icons/ri";
import { Alphabet } from "@/types/alphabet.types";
import AlphabetService from "@/services/alphabetService";
import { useSnackbarStore } from "@/store/snackbarStore";
import AlphabetModal from "@/components/courses/sections/Alphabet/AlphabetModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";
import Pagination from "@/components/ui/Pagination";

interface AlphabetTableProps {
  courseId: number;
}

const formatDuration = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const formatSize = (bytes: number): string => {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / 1024).toFixed(0)} KB`;
};

function SkeletonRow() {
  const shimmer = {
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
      <td style={{ padding: "14px 16px" }}>
        <Box sx={{ ...shimmer, width: 24, height: 16 }} />
      </td>
      <td style={{ padding: "14px 16px" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              ...shimmer,
              width: 36,
              height: 36,
              borderRadius: "8px",
              flexShrink: 0,
            }}
          />
          <Box sx={{ ...shimmer, width: 160, height: 16 }} />
        </Box>
      </td>
      <td style={{ padding: "14px 16px" }}>
        <Box sx={{ ...shimmer, width: 28, height: 28, borderRadius: "6px" }} />
      </td>
      <td style={{ padding: "14px 16px" }}>
        <Box sx={{ ...shimmer, width: 56, height: 16 }} />
      </td>
      <td style={{ padding: "14px 16px" }}>
        <Box sx={{ ...shimmer, width: 60, height: 16 }} />
      </td>
      <td style={{ padding: "14px 16px" }}>
        <Box sx={{ display: "flex", gap: 0.75 }}>
          <Box
            sx={{ ...shimmer, width: 32, height: 32, borderRadius: "8px" }}
          />
          <Box
            sx={{ ...shimmer, width: 32, height: 32, borderRadius: "8px" }}
          />
        </Box>
      </td>
    </tr>
  );
}

export default function AlphabetTable({ courseId }: AlphabetTableProps) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(8);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<Alphabet | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Alphabet | null>(null);
  const [videoTarget, setVideoTarget] = useState<Alphabet | null>(null);

  // ── useQuery ──────────────────────────────────────────────────────────────
  const { data, isLoading } = useQuery({
    queryKey: ["alphabets", courseId],
    queryFn: () => AlphabetService.getByCourse(courseId),
    select: (res) => (Array.isArray(res.data) ? res.data : []),
  });

  const alphabets = data ?? [];

  // ── useMutation — delete ──────────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: (id: number) => AlphabetService.delete(id),
    onSuccess: () => {
      useSnackbarStore.getState().success("Alphabet o'chirildi");
      queryClient.invalidateQueries({ queryKey: ["alphabets", courseId] });
      setDeleteTarget(null);
    },
    onError: () => {
      useSnackbarStore.getState().error("O'chirishda xatolik");
    },
  });

  // ── Filter + Pagination ───────────────────────────────────────────────────
  const filtered = useMemo(() => {
    if (!search.trim()) return alphabets;
    const q = search.toLowerCase();
    return alphabets.filter((a) => a.title.toLowerCase().includes(q));
  }, [search, alphabets]);

  const paginated = useMemo(() => {
    const start = (page - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, page, perPage]);

  const tdStyle: React.CSSProperties = { padding: "14px 16px" };
  const columns = ["#", "Dars nomi", "Tartib", "Davomiylik", "Hajm", "Amallar"];
  const widths = ["56px", "auto", "80px", "120px", "100px", "110px"];

  return (
    <Box>
      <PageHeader
        title="Alifbo darslari"
        subtitle={`Jami ${alphabets.length} ta dars`}
        action={{
          label: "Yangi dars",
          onClick: () => {
            setEditData(null);
            setModalOpen(true);
          },
        }}
      />

      <Box sx={{ mb: 2 }}>
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Dars qidirish..."
          startDecorator={<RiSearchLine size={16} />}
          sx={{
            maxWidth: 320,
            borderRadius: "8px",
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.875rem",
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
      </Box>

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
            "&::-webkit-scrollbar": { height: 5 },
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
            style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}
          >
            <thead>
              <tr>
                {columns.map((col, i) => (
                  <th
                    key={col}
                    style={{
                      padding: "12px 16px",
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
                        pb: 1.5,
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
                  <td colSpan={6} style={{ padding: "48px 16px" }}>
                    <EmptyState
                      title={
                        search
                          ? "Hech narsa topilmadi"
                          : "Hali alifbo darslari yo'q"
                      }
                      description={
                        search
                          ? "Boshqa kalit so'z bilan qidiring"
                          : "Birinchi alifbo darsini yarating"
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
                paginated.map((alphabet, idx) => (
                  <tr
                    key={alphabet.id}
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
                            onClick={() => setVideoTarget(alphabet)}
                            sx={{
                              width: 36,
                              height: 36,
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
                            <RiPlayCircleLine size={17} />
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
                          {alphabet.title}
                        </Typography>
                      </Box>
                    </td>
                    <td style={tdStyle}>
                      <Box
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 28,
                          height: 28,
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
                        {alphabet.order}
                      </Box>
                    </td>
                    <td style={tdStyle}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.75,
                        }}
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
                          <RiTimeLine size={14} />
                        </Box>
                        <Typography
                          sx={{
                            fontFamily: "var(--font-montserrat)",
                            fontSize: "0.875rem",
                            color: "text.secondary",
                          }}
                        >
                          {formatDuration(alphabet.duration)}
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
                        {formatSize(alphabet.size)}
                      </Typography>
                    </td>
                    <td style={tdStyle}>
                      <Box sx={{ display: "flex", gap: 0.75 }}>
                        <Tooltip title="Tahrirlash" placement="top" arrow>
                          <IconButton
                            size="sm"
                            variant="soft"
                            onClick={() => {
                              setEditData(alphabet);
                              setModalOpen(true);
                            }}
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
                            <RiEditLine size={15} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="O'chirish" placement="top" arrow>
                          <IconButton
                            size="sm"
                            variant="soft"
                            onClick={() => setDeleteTarget(alphabet)}
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
                                "&:hover": {
                                  bgcolor: "rgba(248,113,113,0.15)",
                                },
                              },
                            }}
                          >
                            <RiDeleteBinLine size={15} />
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
                  width: 30,
                  height: 30,
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "rgba(147,51,234,0.2)",
                  color: "#c084fc",
                }}
              >
                <RiPlayCircleLine size={15} />
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
                <RiPlayCircleLine size={52} color="#3a3a44" />
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
              alignItems: "center",
              gap: 2,
              bgcolor: "rgba(255,255,255,0.03)",
              borderTop: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <RiTimeLine size={14} color="#71717d" />
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

      <AlphabetModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditData(null);
        }}
        onSuccess={() =>
          queryClient.invalidateQueries({ queryKey: ["alphabets", courseId] })
        }
        editData={editData}
        courseId={courseId}
      />

      <ConfirmModal
        open={!!deleteTarget}
        title="Alphabetni o'chirish"
        message={`"${deleteTarget?.title}" darsini o'chirasizmi?`}
        loading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        onClose={() => setDeleteTarget(null)}
      />
    </Box>
  );
}
