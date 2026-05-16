// src/components/livechat/LiveChatTable/index.tsx
"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Box, Typography, Input, IconButton, Tooltip } from "@mui/joy";
import {
  RiSearchLine,
  RiTimeLine,
  RiCalendarLine,
  RiMenLine,
  RiWomenLine,
  RiCheckLine,
  RiCloseLine,
} from "react-icons/ri";
import LiveChatService from "@/services/liveChatService";
import { useSnackbarStore } from "@/store/snackbarStore";
import api from "@/services/api";
import EmptyState from "@/components/ui/EmptyState";
import Pagination from "@/components/ui/Pagination";
import PageHeader from "@/components/ui/PageHeader";

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
      {[20, 180, 140, 120, 180, 70, 100].map((w, i) => (
        <td key={i} style={{ padding: "14px 16px" }}>
          <Box sx={{ ...s, width: w, height: 14 }} />
        </td>
      ))}
    </tr>
  );
}

const STATUS_OPTIONS = [
  { value: "", label: "Barcha statuslar" },
  { value: "pending", label: "Kutilmoqda" },
  { value: "paid", label: "To'langan" },
  { value: "cancelled", label: "Bekor" },
  { value: "completed", label: "Tugallangan" },
];

const STATUS_CONFIG: Record<
  string,
  {
    label: string;
    light: { bg: string; color: string };
    dark: { bg: string; color: string };
  }
> = {
  pending: {
    label: "Kutilmoqda",
    light: { bg: "#fef3c7", color: "#d97706" },
    dark: { bg: "rgba(251,191,36,0.1)", color: "#fbbf24" },
  },
  paid: {
    label: "To'langan",
    light: { bg: "#dcfce7", color: "#16a34a" },
    dark: { bg: "rgba(74,222,128,0.1)", color: "#4ade80" },
  },
  cancelled: {
    label: "Bekor",
    light: { bg: "#fff1f2", color: "#dc2626" },
    dark: { bg: "rgba(248,113,113,0.1)", color: "#f87171" },
  },
  completed: {
    label: "Tugallangan",
    light: { bg: "#e0f2fe", color: "#0284c7" },
    dark: { bg: "rgba(2,132,199,0.1)", color: "#38bdf8" },
  },
};

const nativeSx = {
  height: 42,
  px: 1.5,
  pr: 4,
  borderRadius: "8px",
  border: "1px solid",
  fontFamily: "var(--font-montserrat)",
  fontSize: "0.875rem",
  fontWeight: 500,
  appearance: "none" as const,
  cursor: "pointer",
  outline: "none",
  "[data-joy-color-scheme='light'] &": {
    bgcolor: "#f8fafc",
    borderColor: "#e2e8f0",
    color: "#0f172a",
  },
  "[data-joy-color-scheme='dark'] &": {
    bgcolor: "#26262d",
    borderColor: "#3a3a44",
    color: "#fafafa",
  },
};

export default function LiveChatTable() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const { data, isLoading } = useQuery({
    queryKey: ["liveChatsForms"],
    queryFn: LiveChatService.getAll,
    staleTime: 0,
    select: (res: any) => (Array.isArray(res.data) ? res.data : []),
  });

  const queryClient = useQueryClient();
  const chats = data ?? [];

  const acceptMutation = useMutation({
    mutationFn: ({ id, isAccepted }: { id: number; isAccepted: boolean }) =>
      api.patch(`/live-chat/update/${id}`, { isAccepted }),
    onSuccess: () => {
      useSnackbarStore.getState().success("Yangilandi!");
      queryClient.invalidateQueries({ queryKey: ["liveChatsForms"] });
    },
    onError: () => useSnackbarStore.getState().error("Backend hali qo\'llab-quvvatlamaydi"),
  });

  const filtered = useMemo(() => {
    let arr = [...chats];
    if (statusFilter) arr = arr.filter((c: any) => c.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      arr = arr.filter(
        (c: any) =>
          `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
          (c.phoneNumber ?? "").includes(q) ||
          (c.selectedCourseName ?? "").toLowerCase().includes(q),
      );
    }
    return arr;
  }, [chats, statusFilter, search]);

  const paginated = useMemo(
    () => filtered.slice((page - 1) * perPage, page * perPage),
    [filtered, page, perPage],
  );

  const tdStyle: React.CSSProperties = { padding: "12px 16px" };
  const cols = [
    "#",
    "Foydalanuvchi",
    "Kurs",
    "Narx",
    "Seans",
    "Jins",
    "Status",
  ];
  const widths = ["48px", "200px", "160px", "120px", "180px", "70px", "120px"];

  return (
    <Box>
      <PageHeader
        title="Jonli chat so'rovlari"
        subtitle={`Jami ${chats.length} ta so'rov`}
      />

      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          mb: 2,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Ism, telefon yoki kurs..."
          startDecorator={<RiSearchLine size={16} />}
          sx={{
            flex: 1,
            minWidth: 200,
            maxWidth: 300,
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
        <Box sx={{ position: "relative" }}>
          <Box
            component="select"
            value={statusFilter}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            sx={{ ...nativeSx, minWidth: 170 }}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </Box>
          <Box
            sx={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              fontSize: "0.6rem",
              "[data-joy-color-scheme='light'] &": { color: "#64748b" },
              "[data-joy-color-scheme='dark'] &": { color: "#a1a1aa" },
            }}
          >
            ▼
          </Box>
        </Box>
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
        <Box sx={{ overflowX: "auto" }}>
          <table
            style={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}
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
                      title="So'rovlar topilmadi"
                      description="Hozircha jonli chat so'rovlari yo'q"
                    />
                  </td>
                </tr>
              ) : (
                paginated.map((chat: any, idx: number) => {
                  const isMale = chat.gender === "male";
                  const statusCfg =
                    STATUS_CONFIG[chat.status] ?? STATUS_CONFIG.pending;
                  return (
                    <tr
                      key={chat.id}
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
                              fontFamily: "var(--font-montserrat)",
                              fontWeight: 700,
                              fontSize: "0.875rem",
                              "[data-joy-color-scheme='light'] &": {
                                bgcolor: "#f3e8ff",
                                color: "#9333ea",
                              },
                              "[data-joy-color-scheme='dark'] &": {
                                bgcolor: "rgba(147,51,234,0.12)",
                                color: "#c084fc",
                              },
                            }}
                          >
                            {chat.firstName?.[0] ?? "?"}
                          </Box>
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
                              {chat.firstName} {chat.lastName}
                            </Typography>
                            <Typography
                              sx={{
                                fontFamily: "var(--font-montserrat)",
                                fontSize: "0.75rem",
                                color: "text.tertiary",
                              }}
                            >
                              {chat.phoneNumber}
                            </Typography>
                          </Box>
                        </Box>
                      </td>
                      <td style={tdStyle}>
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
                          {chat.selectedCourseName}
                        </Typography>
                      </td>
                      <td style={tdStyle}>
                        <Typography
                          sx={{
                            fontFamily: "var(--font-montserrat)",
                            fontWeight: 700,
                            fontSize: "0.9375rem",
                            "[data-joy-color-scheme='light'] &": {
                              color: "#9333ea",
                            },
                            "[data-joy-color-scheme='dark'] &": {
                              color: "#c084fc",
                            },
                          }}
                        >
                          {Number(chat.price).toLocaleString("uz-UZ")} so'm
                        </Typography>
                      </td>
                      <td style={tdStyle}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.75,
                          }}
                        >
                          <RiCalendarLine size={13} style={{ opacity: 0.5 }} />
                          <Typography
                            sx={{
                              fontFamily: "var(--font-montserrat)",
                              fontSize: "0.8125rem",
                              color: "text.secondary",
                            }}
                          >
                            {chat.selectedDay} {chat.selectedTime}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.75,
                            mt: 0.25,
                          }}
                        >
                          <RiTimeLine size={13} style={{ opacity: 0.5 }} />
                          <Typography
                            sx={{
                              fontFamily: "var(--font-montserrat)",
                              fontSize: "0.75rem",
                              color: "text.tertiary",
                            }}
                          >
                            {chat.duration} daqiqa
                          </Typography>
                        </Box>
                      </td>
                      <td style={tdStyle}>
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
                      </td>
                      <td style={tdStyle}>
                        <Box
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 0.5,
                            px: 1,
                            py: 0.25,
                            borderRadius: "6px",
                            "[data-joy-color-scheme='light'] &": {
                              bgcolor: statusCfg.light.bg,
                            },
                            "[data-joy-color-scheme='dark'] &": {
                              bgcolor: statusCfg.dark.bg,
                            },
                          }}
                        >
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              "[data-joy-color-scheme='light'] &": {
                                bgcolor: statusCfg.light.color,
                              },
                              "[data-joy-color-scheme='dark'] &": {
                                bgcolor: statusCfg.dark.color,
                              },
                            }}
                          />
                          <Typography
                            sx={{
                              fontFamily: "var(--font-montserrat)",
                              fontWeight: 600,
                              fontSize: "0.6875rem",
                              "[data-joy-color-scheme='light'] &": {
                                color: statusCfg.light.color,
                              },
                              "[data-joy-color-scheme='dark'] &": {
                                color: statusCfg.dark.color,
                              },
                            }}
                          >
                            {statusCfg.label}
                          </Typography>
                        </Box>
                        <Tooltip title={chat.isAccepted ? "Rad etish" : "Qabul qilish"} placement="top" arrow>
                          <IconButton
                            size="sm" variant="soft"
                            onClick={() => acceptMutation.mutate({ id: chat.id, isAccepted: !chat.isAccepted })}
                            sx={{
                              borderRadius: "6px", minWidth: 28, minHeight: 28, mt: 0.5,
                              "[data-joy-color-scheme='light'] &": {
                                bgcolor: chat.isAccepted ? "#dcfce7" : "#fff1f2",
                                color: chat.isAccepted ? "#16a34a" : "#dc2626",
                              },
                              "[data-joy-color-scheme='dark'] &": {
                                bgcolor: chat.isAccepted ? "rgba(74,222,128,0.1)" : "rgba(248,113,113,0.08)",
                                color: chat.isAccepted ? "#4ade80" : "#f87171",
                              },
                            }}
                          >
                            {chat.isAccepted ? <RiCheckLine size={13} /> : <RiCloseLine size={13} />}
                          </IconButton>
                        </Tooltip>
                      </td>
                    </tr>
                  );
                })
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
          onPerPageChange={() => {}}
          perPageOptions={[10]}
        />
      )}
    </Box>
  );
}
