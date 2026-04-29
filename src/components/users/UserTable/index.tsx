// src/components/users/UserTable/index.tsx
"use client";

import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Input,
  Select,
  Option,
} from "@mui/joy";
import {
  RiSearchLine,
  RiDeleteBinLine,
  RiEyeLine,
  RiUserLine,
  RiMenLine,
  RiWomenLine,
} from "react-icons/ri";
import { User, ROLE_CONFIG, UserRole } from "@/types/user.types";
import UserService from "@/services/userService";
import { useSnackbarStore } from "@/store/snackbarStore";
import ConfirmModal from "@/components/ui/ConfirmModal";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";
import Pagination from "@/components/ui/Pagination";
import UserDetailModal from "@/components/users/UserDetailModal";

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
            <Box sx={{ ...s, width: 120, height: 14, mb: 0.75 }} />
            <Box sx={{ ...s, width: 80, height: 12 }} />
          </Box>
        </Box>
      </td>
      <td style={{ padding: "14px 16px" }}>
        <Box sx={{ ...s, width: 110, height: 14 }} />
      </td>
      <td style={{ padding: "14px 16px" }}>
        <Box sx={{ ...s, width: 70, height: 22, borderRadius: "6px" }} />
      </td>
      <td style={{ padding: "14px 16px" }}>
        <Box sx={{ ...s, width: 24, height: 24, borderRadius: "6px" }} />
      </td>
      <td style={{ padding: "14px 16px" }}>
        <Box sx={{ ...s, width: 90, height: 14 }} />
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

const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ?? "";

const ROLES: { value: string; label: string }[] = [
  { value: "", label: "Barcha rollar" },
  { value: "student", label: "Talabalar" },
  { value: "teacher", label: "O'qituvchilar" },
  { value: "admin", label: "Adminlar" },
  { value: "director", label: "Direktorlar" },
];

export default function UserTable() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(7);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [viewTarget, setViewTarget] = useState<User | null>(null);

  // Server-side pagination
  const { data, isLoading } = useQuery({
    queryKey: ["users", page, perPage, search, role],
    queryFn: () => UserService.getAll({ page, limit: perPage, search, role }),
  });

  const users = data?.data?.users ?? [];
  const total = data?.data?.count ?? 0;
  const totalPages = data?.data?.total_page ?? 1;

  const deleteMutation = useMutation({
    mutationFn: (id: number) => UserService.delete(id),
    onSuccess: () => {
      useSnackbarStore.getState().success("Foydalanuvchi o'chirildi");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setDeleteTarget(null);
    },
    onError: () => useSnackbarStore.getState().error("O'chirishda xatolik"),
  });

  // Search debounce
  const handleSearch = useCallback((val: string) => {
    setSearchInput(val);
    const timer = setTimeout(() => {
      setSearch(val);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("uz-UZ", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const tdStyle: React.CSSProperties = { padding: "14px 16px" };
  const cols = [
    "#",
    "Foydalanuvchi",
    "Telefon",
    "Rol",
    "Jins",
    "Sana",
    "Amallar",
  ];
  const widths = ["48px", "auto", "140px", "120px", "70px", "110px", "90px"];

  return (
    <Box>
      <PageHeader
        title="Foydalanuvchilar"
        subtitle={`Jami ${total} ta foydalanuvchi`}
      />

      {/* Filters */}
      <Box sx={{ display: "flex", gap: 1.5, mb: 2, flexWrap: "wrap" }}>
        <Input
          value={searchInput}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Ism yoki telefon..."
          startDecorator={<RiSearchLine size={16} />}
          sx={{
            flex: 1,
            minWidth: 200,
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
        <Select
          value={role}
          onChange={(_, v) => {
            setRole(v ?? "");
            setPage(1);
          }}
          sx={{
            width: 180,
            borderRadius: "8px",
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.875rem",
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
          {ROLES.map((r) => (
            <Option
              key={r.value}
              value={r.value}
              sx={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.875rem",
              }}
            >
              {r.label}
            </Option>
          ))}
        </Select>
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
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: "40px 16px" }}>
                    <EmptyState
                      title="Foydalanuvchilar topilmadi"
                      description="Boshqa kalit so'z bilan qidiring"
                    />
                  </td>
                </tr>
              ) : (
                users.map((user, idx) => {
                  const roleConfig =
                    ROLE_CONFIG[user.role] ?? ROLE_CONFIG.student;
                  const isMale = user.gender === "male";
                  const avatarUrl = user.avatar
                    ? user.avatar.startsWith("http")
                      ? user.avatar
                      : `${BASE_URL}/${user.avatar}`
                    : null;

                  return (
                    <tr
                      key={user.id}
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
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          {/* Avatar */}
                          <Box
                            sx={{
                              width: 36,
                              height: 36,
                              borderRadius: "8px",
                              flexShrink: 0,
                              overflow: "hidden",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              "[data-joy-color-scheme='light'] &": {
                                bgcolor: "#f1f5f9",
                              },
                              "[data-joy-color-scheme='dark'] &": {
                                bgcolor: "#26262d",
                              },
                            }}
                          >
                            {avatarUrl ? (
                              <Box
                                component="img"
                                src={avatarUrl}
                                alt={user.firstName}
                                onError={(
                                  e: React.SyntheticEvent<HTMLImageElement>,
                                ) => {
                                  e.currentTarget.style.display = "none";
                                }}
                                sx={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              <Typography
                                sx={{
                                  fontFamily: "var(--font-montserrat)",
                                  fontWeight: 700,
                                  fontSize: "0.875rem",
                                  "[data-joy-color-scheme='light'] &": {
                                    color: "#64748b",
                                  },
                                  "[data-joy-color-scheme='dark'] &": {
                                    color: "#71717d",
                                  },
                                }}
                              >
                                {user.firstName?.[0]}
                                {user.lastName?.[0]}
                              </Typography>
                            )}
                          </Box>

                          {/* Name */}
                          <Box sx={{ minWidth: 0 }}>
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
                              {user.firstName} {user.lastName}
                            </Typography>
                            {user.email && (
                              <Typography
                                sx={{
                                  fontFamily: "var(--font-montserrat)",
                                  fontSize: "0.75rem",
                                  color: "text.tertiary",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {user.email}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </td>

                      {/* Phone */}
                      <td style={tdStyle}>
                        <Typography
                          sx={{
                            fontFamily: "var(--font-montserrat)",
                            fontSize: "0.875rem",
                            color: "text.secondary",
                            fontFeatureSettings: '"tnum"',
                          }}
                        >
                          {user.phoneNumber || "—"}
                        </Typography>
                      </td>

                      {/* Role */}
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
                              bgcolor: roleConfig.light.bg,
                              color: roleConfig.light.color,
                            },
                            "[data-joy-color-scheme='dark'] &": {
                              bgcolor: roleConfig.dark.bg,
                              color: roleConfig.dark.color,
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
                            {roleConfig.label}
                          </Typography>
                        </Box>
                      </td>

                      {/* Gender */}
                      <td style={tdStyle}>
                        {user.gender ? (
                          <Tooltip
                            title={isMale ? "Erkak" : "Ayol"}
                            placement="top"
                            arrow
                          >
                            <Box
                              sx={{
                                width: 28,
                                height: 28,
                                borderRadius: "6px",
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
                                <RiMenLine size={14} />
                              ) : (
                                <RiWomenLine size={14} />
                              )}
                            </Box>
                          </Tooltip>
                        ) : (
                          <Typography
                            sx={{
                              fontFamily: "var(--font-montserrat)",
                              fontSize: "0.875rem",
                              color: "text.tertiary",
                            }}
                          >
                            —
                          </Typography>
                        )}
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
                          {formatDate(user.createdAt)}
                        </Typography>
                      </td>

                      {/* Actions */}
                      <td style={tdStyle}>
                        <Box sx={{ display: "flex", gap: 0.5 }}>
                          <Tooltip title="Ko'rish" placement="top" arrow>
                            <IconButton
                              size="sm"
                              variant="soft"
                              onClick={() => setViewTarget(user)}
                              sx={{
                                borderRadius: "8px",
                                "[data-joy-color-scheme='light'] &": {
                                  bgcolor: "#e0f2fe",
                                  color: "#0284c7",
                                  "&:hover": { bgcolor: "#bae6fd" },
                                },
                                "[data-joy-color-scheme='dark'] &": {
                                  bgcolor: "rgba(2,132,199,0.1)",
                                  color: "#38bdf8",
                                  "&:hover": { bgcolor: "rgba(2,132,199,0.2)" },
                                },
                              }}
                            >
                              <RiEyeLine size={14} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="O'chirish" placement="top" arrow>
                            <IconButton
                              size="sm"
                              variant="soft"
                              onClick={() => setDeleteTarget(user)}
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
      {!isLoading && total > 0 && (
        <Pagination
          total={total}
          page={page}
          perPage={perPage}
          onPageChange={setPage}
          onPerPageChange={(pp) => {
            setPerPage(pp);
            setPage(1);
          }}
          perPageOptions={[10, 20, 50, 100]}
        />
      )}

      {/* Detail Modal */}
      <UserDetailModal
        open={!!viewTarget}
        onClose={() => setViewTarget(null)}
        user={viewTarget}
      />

      {/* Delete Confirm */}
      <ConfirmModal
        open={!!deleteTarget}
        title="Foydalanuvchini o'chirish"
        message={`"${deleteTarget?.firstName} ${deleteTarget?.lastName}" ni o'chirasizmi?`}
        loading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        onClose={() => setDeleteTarget(null)}
      />
    </Box>
  );
}
