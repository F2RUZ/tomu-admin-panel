// src/components/courses/sections/Groups/GroupTable/index.tsx
"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Input,
  LinearProgress,
} from "@mui/joy";
import {
  RiEditLine,
  RiDeleteBinLine,
  RiGroupLine,
  RiMenLine,
  RiWomenLine,
  RiSearchLine,
  RiCalendarLine,
} from "react-icons/ri";
import { Group, GROUP_STATUS_CONFIG } from "@/types/group.types";
import GroupService from "@/services/groupService";
import { useSnackbarStore } from "@/store/snackbarStore";
import GroupModal from "@/components/courses/sections/Groups/GroupModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";
import Pagination from "@/components/ui/Pagination";

interface GroupTableProps {
  courseId: number;
}

const formatDate = (date: string | null | undefined): string => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("uz-UZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

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
          <Box sx={{ ...s, width: 100, height: 14 }} />
        </Box>
      </td>
      <td style={{ padding: "14px 16px" }}>
        <Box sx={{ ...s, width: 24, height: 24, borderRadius: "6px" }} />
      </td>
      <td style={{ padding: "14px 16px" }}>
        <Box sx={{ ...s, width: 120, height: 20, borderRadius: "6px" }} />
      </td>
      <td style={{ padding: "14px 16px" }}>
        <Box sx={{ ...s, width: 80, height: 22, borderRadius: "6px" }} />
      </td>
      <td style={{ padding: "14px 16px" }}>
        <Box sx={{ ...s, width: 80, height: 14 }} />
      </td>
      <td style={{ padding: "14px 16px" }}>
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Box sx={{ ...s, width: 30, height: 30, borderRadius: "8px" }} />
          <Box sx={{ ...s, width: 30, height: 30, borderRadius: "8px" }} />
        </Box>
      </td>
    </tr>
  );
}

export default function GroupTable({ courseId }: GroupTableProps) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<Group | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Group | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["groups", courseId],
    queryFn: () => GroupService.getAll(),
    select: (res) => {
      const arr = Array.isArray(res.data) ? res.data : [];
      return arr.filter((g) => g.courseId === courseId);
    },
  });

  const groups = data ?? [];

  const deleteMutation = useMutation({
    mutationFn: (id: number) => GroupService.delete(id),
    onSuccess: () => {
      useSnackbarStore.getState().success("Guruh o'chirildi");
      queryClient.invalidateQueries({ queryKey: ["groups", courseId] });
      setDeleteTarget(null);
    },
    onError: () => useSnackbarStore.getState().error("O'chirishda xatolik"),
  });

  const filtered = useMemo(() => {
    if (!search.trim()) return groups;
    const q = search.toLowerCase();
    return groups.filter((g) => g.name.toLowerCase().includes(q));
  }, [search, groups]);

  const paginated = useMemo(
    () => filtered.slice((page - 1) * perPage, page * perPage),
    [filtered, page, perPage],
  );

  const tdStyle: React.CSSProperties = { padding: "14px 16px" };
  const cols = [
    "#",
    "Guruh nomi",
    "Jins",
    "Talabalar",
    "Status",
    "Boshlanish",
    "Amallar",
  ];
  const widths = ["48px", "auto", "80px", "180px", "140px", "120px", "100px"];

  return (
    <Box>
      <PageHeader
        title="Guruhlar"
        subtitle={`Jami ${groups.length} ta guruh`}
        action={{
          label: "Yangi guruh",
          onClick: () => {
            setEditData(null);
            setModalOpen(true);
          },
        }}
      />

      {/* Search */}
      <Box sx={{ mb: 2 }}>
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Guruh qidirish..."
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
            style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}
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
                        search ? "Hech narsa topilmadi" : "Hali guruhlar yo'q"
                      }
                      description={
                        search
                          ? "Boshqa nom bilan qidiring"
                          : "Birinchi guruhni yarating"
                      }
                      action={
                        !search
                          ? {
                              label: "Guruh yaratish",
                              onClick: () => setModalOpen(true),
                            }
                          : undefined
                      }
                    />
                  </td>
                </tr>
              ) : (
                paginated.map((group, idx) => {
                  const statusCfg =
                    GROUP_STATUS_CONFIG[group.status] ??
                    GROUP_STATUS_CONFIG.filling;
                  const progress = Math.round(
                    (group.studentsCount / group.maxStudents) * 100,
                  );
                  const isMale = ["MALE", "male"].includes(group.gender);

                  return (
                    <tr
                      key={group.id}
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

                      {/* Name */}
                      <td style={tdStyle}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
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
                                bgcolor: "#dcfce7",
                                color: "#16a34a",
                              },
                              "[data-joy-color-scheme='dark'] &": {
                                bgcolor: "rgba(74,222,128,0.1)",
                                color: "#4ade80",
                              },
                            }}
                          >
                            <RiGroupLine size={17} />
                          </Box>
                          <Typography
                            sx={{
                              fontFamily: "var(--font-montserrat)",
                              fontSize: "0.875rem",
                              fontWeight: 700,
                              color: "text.primary",
                            }}
                          >
                            {group.name}
                          </Typography>
                        </Box>
                      </td>

                      {/* Gender */}
                      <td style={tdStyle}>
                        <Tooltip
                          title={isMale ? "Erkaklar" : "Ayollar"}
                          placement="top"
                          arrow
                        >
                          <Box
                            sx={{
                              width: 30,
                              height: 30,
                              borderRadius: "8px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              "[data-joy-color-scheme='light'] &": {
                                bgcolor: isMale ? "#e0f2fe" : "#fce7f3",
                                color: isMale ? "#0284c7" : "#db2777",
                              },
                              "[data-joy-color-scheme='dark'] &": {
                                bgcolor: isMale
                                  ? "rgba(2,132,199,0.1)"
                                  : "rgba(219,39,119,0.1)",
                                color: isMale ? "#38bdf8" : "#f472b6",
                              },
                            }}
                          >
                            {isMale ? (
                              <RiMenLine size={16} />
                            ) : (
                              <RiWomenLine size={16} />
                            )}
                          </Box>
                        </Tooltip>
                      </td>

                      {/* Students progress */}
                      <td style={tdStyle}>
                        <Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mb: 0.75,
                            }}
                          >
                            <Typography
                              sx={{
                                fontFamily: "var(--font-montserrat)",
                                fontSize: "0.8125rem",
                                fontWeight: 600,
                                color: "text.primary",
                              }}
                            >
                              {group.studentsCount} / {group.maxStudents}
                            </Typography>
                            <Typography
                              sx={{
                                fontFamily: "var(--font-montserrat)",
                                fontSize: "0.75rem",
                                color: "text.tertiary",
                              }}
                            >
                              {progress}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            determinate
                            value={Math.min(progress, 100)}
                            sx={{
                              borderRadius: "99px",
                              height: 6,
                              "[data-joy-color-scheme='light'] &": {
                                bgcolor: "#f1f5f9",
                                "& .MuiLinearProgress-bar": {
                                  bgcolor:
                                    progress >= 100
                                      ? "#16a34a"
                                      : progress >= 70
                                        ? "#d97706"
                                        : "#0284c7",
                                },
                              },
                              "[data-joy-color-scheme='dark'] &": {
                                bgcolor: "#26262d",
                                "& .MuiLinearProgress-bar": {
                                  bgcolor:
                                    progress >= 100
                                      ? "#4ade80"
                                      : progress >= 70
                                        ? "#fbbf24"
                                        : "#38bdf8",
                                },
                              },
                            }}
                          />
                        </Box>
                      </td>

                      {/* Status */}
                      <td style={tdStyle}>
                        <Box
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 0.5,
                            px: 1.25,
                            py: 0.375,
                            borderRadius: "6px",
                            "[data-joy-color-scheme='light'] &": {
                              bgcolor: statusCfg.light.bg,
                              color: statusCfg.light.color,
                            },
                            "[data-joy-color-scheme='dark'] &": {
                              bgcolor: statusCfg.dark.bg,
                              color: statusCfg.dark.color,
                            },
                          }}
                        >
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              bgcolor: "currentColor",
                              flexShrink: 0,
                            }}
                          />
                          <Typography
                            sx={{
                              fontFamily: "var(--font-montserrat)",
                              fontWeight: 600,
                              fontSize: "0.75rem",
                            }}
                          >
                            {statusCfg.label}
                          </Typography>
                        </Box>
                      </td>

                      {/* Start date */}
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
                            <RiCalendarLine size={14} />
                          </Box>
                          <Typography
                            sx={{
                              fontFamily: "var(--font-montserrat)",
                              fontSize: "0.8125rem",
                              color: "text.secondary",
                            }}
                          >
                            {formatDate(group.startDate)}
                          </Typography>
                        </Box>
                      </td>

                      {/* Actions */}
                      <td style={tdStyle}>
                        <Box sx={{ display: "flex", gap: 0.5 }}>
                          <Tooltip title="Tahrirlash" placement="top" arrow>
                            <IconButton
                              size="sm"
                              variant="soft"
                              onClick={() => {
                                setEditData(group);
                                setModalOpen(true);
                              }}
                              sx={{
                                borderRadius: "8px",
                                "[data-joy-color-scheme='light'] &": {
                                  bgcolor: "#dcfce7",
                                  color: "#16a34a",
                                  "&:hover": { bgcolor: "#bbf7d0" },
                                },
                                "[data-joy-color-scheme='dark'] &": {
                                  bgcolor: "rgba(74,222,128,0.1)",
                                  color: "#4ade80",
                                  "&:hover": {
                                    bgcolor: "rgba(74,222,128,0.2)",
                                  },
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
                              onClick={() => setDeleteTarget(group)}
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
                              <RiDeleteBinLine size={14} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </td>
                    </tr>
                  );
                })
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

      <GroupModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditData(null);
        }}
        onSuccess={() =>
          queryClient.invalidateQueries({ queryKey: ["groups", courseId] })
        }
        editData={editData}
        courseId={courseId}
      />

      <ConfirmModal
        open={!!deleteTarget}
        title="Guruhni o'chirish"
        message={`"${deleteTarget?.name}" guruhini o'chirasizmi? Bu amalni qaytarib bo'lmaydi.`}
        loading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        onClose={() => setDeleteTarget(null)}
      />
    </Box>
  );
}
