// src/components/feedbacks/FeedbackTable/index.tsx
"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Box, Typography, IconButton, Tooltip, Input } from "@mui/joy";
import {
  RiSearchLine,
  RiDeleteBinLine,
  RiUserLine,
  RiBookOpenLine,
  RiChat1Line,
} from "react-icons/ri";
import FeedbackService from "@/services/feedbackService";
import { useSnackbarStore } from "@/store/snackbarStore";
import { Feedback } from "@/types/feedback.types";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Pagination from "@/components/ui/Pagination";

// ─── Skeleton ─────────────────────────────────────────────────────────────────
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
      <td style={{ padding: "14px 16px" }}>
        <Box sx={{ ...s, width: 20, height: 14 }} />
      </td>
      <td style={{ padding: "14px 16px" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{ ...s, width: 36, height: 36, borderRadius: "8px" }} />
          <Box>
            <Box sx={{ ...s, width: 100, height: 14, mb: 0.75 }} />
            <Box sx={{ ...s, width: 80, height: 12 }} />
          </Box>
        </Box>
      </td>
      <td style={{ padding: "14px 16px" }}>
        <Box sx={{ ...s, width: 120, height: 14 }} />
      </td>
      <td style={{ padding: "14px 16px" }}>
        <Box sx={{ ...s, width: 250, height: 14 }} />
      </td>
      <td style={{ padding: "14px 16px" }}>
        <Box sx={{ ...s, width: 90, height: 14 }} />
      </td>
      <td style={{ padding: "14px 16px" }}>
        <Box sx={{ ...s, width: 30, height: 30, borderRadius: "8px" }} />
      </td>
    </tr>
  );
}

export default function FeedbackTable() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [deleteTarget, setDeleteTarget] = useState<Feedback | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["feedbacks"],
    queryFn: FeedbackService.getAll,
    select: (res) => (Array.isArray(res.data) ? res.data : []),
  });

  const feedbacks = data ?? [];

  const deleteMutation = useMutation({
    mutationFn: (id: number) => FeedbackService.delete(id),
    onSuccess: () => {
      useSnackbarStore.getState().success("Fikr o'chirildi");
      queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
      setDeleteTarget(null);
    },
    onError: () => useSnackbarStore.getState().error("O'chirishda xatolik"),
  });

  const filtered = useMemo(() => {
    if (!search.trim()) return feedbacks;
    const q = search.toLowerCase();
    return feedbacks.filter(
      (f) =>
        f.comment.toLowerCase().includes(q) ||
        `${f.user?.firstName ?? ""} ${f.user?.lastName ?? ""}`
          .toLowerCase()
          .includes(q) ||
        (f.course?.title ?? "").toLowerCase().includes(q),
    );
  }, [search, feedbacks]);

  const paginated = useMemo(
    () => filtered.slice((page - 1) * perPage, page * perPage),
    [filtered, page, perPage],
  );

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("uz-UZ", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const tdStyle: React.CSSProperties = { padding: "14px 16px" };
  const cols = ["#", "Foydalanuvchi", "Kurs", "Fikr", "Sana", "Amallar"];
  const widths = ["48px", "180px", "160px", "auto", "110px", "80px"];

  return (
    <Box>
      <PageHeader
        title="Fikrlar"
        subtitle={`Jami ${feedbacks.length} ta fikr`}
      />

      {/* Search */}
      <Box sx={{ mb: 2 }}>
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Fikr, ism yoki kurs bo'yicha..."
          startDecorator={<RiSearchLine size={16} />}
          sx={{
            maxWidth: 360,
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
            style={{ width: "100%", borderCollapse: "collapse", minWidth: 680 }}
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
                        search ? "Hech narsa topilmadi" : "Hali fikrlar yo'q"
                      }
                      description={
                        search
                          ? "Boshqa kalit so'z bilan qidiring"
                          : "Foydalanuvchilar fikr qoldirmagan"
                      }
                    />
                  </td>
                </tr>
              ) : (
                paginated.map((feedback, idx) => (
                  <tr
                    key={feedback.id}
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

                    {/* User */}
                    <td style={tdStyle}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
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
                              bgcolor: "#e0f2fe",
                              color: "#0284c7",
                            },
                            "[data-joy-color-scheme='dark'] &": {
                              bgcolor: "rgba(2,132,199,0.1)",
                              color: "#38bdf8",
                            },
                          }}
                        >
                          <RiUserLine size={17} />
                        </Box>
                        <Typography
                          sx={{
                            fontFamily: "var(--font-montserrat)",
                            fontWeight: 600,
                            fontSize: "0.875rem",
                            color: "text.primary",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {feedback.user
                            ? `${feedback.user.firstName} ${feedback.user.lastName}`
                            : "Noma'lum"}
                        </Typography>
                      </Box>
                    </td>

                    {/* Course */}
                    <td style={tdStyle}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
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
                            "[data-joy-color-scheme='light'] &": {
                              bgcolor: "#f3e8ff",
                              color: "#9333ea",
                            },
                            "[data-joy-color-scheme='dark'] &": {
                              bgcolor: "rgba(147,51,234,0.1)",
                              color: "#c084fc",
                            },
                          }}
                        >
                          <RiBookOpenLine size={13} />
                        </Box>
                        <Typography
                          sx={{
                            fontFamily: "var(--font-montserrat)",
                            fontSize: "0.875rem",
                            color: "text.secondary",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {feedback.course?.title ?? "—"}
                        </Typography>
                      </Box>
                    </td>

                    {/* Comment */}
                    <td style={tdStyle}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 1,
                        }}
                      >
                        <Box
                          sx={{
                            mt: 0.25,
                            flexShrink: 0,
                            "[data-joy-color-scheme='light'] &": {
                              color: "#94a3b8",
                            },
                            "[data-joy-color-scheme='dark'] &": {
                              color: "#52525e",
                            },
                          }}
                        >
                          <RiChat1Line size={14} />
                        </Box>
                        <Typography
                          sx={{
                            fontFamily: "var(--font-montserrat)",
                            fontSize: "0.875rem",
                            color: "text.primary",
                            lineHeight: 1.5,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {feedback.comment}
                        </Typography>
                      </Box>
                    </td>

                    {/* Date */}
                    <td style={tdStyle}>
                      <Typography
                        sx={{
                          fontFamily: "var(--font-montserrat)",
                          fontSize: "0.8125rem",
                          color: "text.tertiary",
                        }}
                      >
                        {formatDate(feedback.createdAt)}
                      </Typography>
                    </td>

                    {/* Actions */}
                    <td style={tdStyle}>
                      <Tooltip title="O'chirish" placement="top" arrow>
                        <IconButton
                          size="sm"
                          variant="soft"
                          onClick={() => setDeleteTarget(feedback)}
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
          perPageOptions={[10, 20, 50]}
        />
      )}

      {/* Delete Confirm */}
      <ConfirmModal
        open={!!deleteTarget}
        title="Fikrni o'chirish"
        message={`"${deleteTarget?.comment?.slice(0, 50)}..." fikrni o'chirasizmi?`}
        loading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        onClose={() => setDeleteTarget(null)}
      />
    </Box>
  );
}
