// src/components/livechat/LiveChatTable/index.tsx
"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Box, Typography, Input, Select, Option } from "@mui/joy";
import {
  RiSearchLine,
  RiTimeLine,
  RiCalendarLine,
  RiMenLine,
  RiWomenLine,
  RiCheckLine,
  RiCloseLine,
} from "react-icons/ri";
import { LIVECHAT_STATUS_CONFIG } from "@/types/livechat.types";
import LiveChatService from "@/services/liveChatService";
import EmptyState from "@/components/ui/EmptyState";
import Pagination from "@/components/ui/Pagination";

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
      {[20, 150, 130, 100, 60, 110, 90, 80, 90].map((w, i) => (
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

export default function LiveChatTable() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(7);

  const { data, isLoading } = useQuery({
    queryKey: ["liveChats"],
    queryFn: LiveChatService.getAll,
    select: (res) => (Array.isArray(res.data) ? res.data : []),
  });

  const chats = data ?? [];

  const filtered = useMemo(() => {
    let arr = [...chats];
    if (statusFilter) arr = arr.filter((c) => c.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      arr = arr.filter(
        (c) =>
          `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
          c.phoneNumber.includes(q) ||
          c.selectedCourseName.toLowerCase().includes(q),
      );
    }
    return arr;
  }, [chats, statusFilter, search]);

  const paginated = useMemo(
    () => filtered.slice((page - 1) * perPage, page * perPage),
    [filtered, page, perPage],
  );

  const formatPrice = (price: string | number) =>
    Number(price).toLocaleString("uz-UZ") + " so'm";

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
    "Kurs",
    "Narx",
    "Davomiylik",
    "Seans",
    "Jins",
    "Qabul",
    "Status",
  ];
  const widths = [
    "48px",
    "180px",
    "150px",
    "130px",
    "100px",
    "150px",
    "70px",
    "80px",
    "130px",
  ];

  const selectSx = {
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
  };

  return (
    <Box>
      {/* Filters */}
      <Box sx={{ display: "flex", gap: 1.5, mb: 2, flexWrap: "wrap" }}>
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
          value={statusFilter}
          onChange={(_, v) => {
            setStatusFilter(v ?? "");
            setPage(1);
          }}
          sx={{ ...selectSx, width: 180 }}
        >
          {STATUS_OPTIONS.map((s) => (
            <Option
              key={s.value}
              value={s.value}
              sx={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.875rem",
              }}
            >
              {s.label}
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
            style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}
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
                  <td colSpan={9} style={{ padding: "40px 16px" }}>
                    <EmptyState
                      title="Live chat seanslar topilmadi"
                      description="Boshqa filtr bilan qidiring"
                    />
                  </td>
                </tr>
              ) : (
                paginated.map((chat, idx) => {
                  const statusCfg =
                    LIVECHAT_STATUS_CONFIG[chat.status] ??
                    LIVECHAT_STATUS_CONFIG.pending;
                  const isMale = chat.gender === "male";
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
                            {chat.firstName?.[0]}
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

                      {/* Course */}
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

                      {/* Price */}
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
                          {formatPrice(chat.price)}
                        </Typography>
                      </td>

                      {/* Duration */}
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
                            {chat.duration} daq
                          </Typography>
                        </Box>
                      </td>

                      {/* Session */}
                      <td style={tdStyle}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.75,
                            mb: 0.25,
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
                            <RiCalendarLine size={13} />
                          </Box>
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
                      </td>

                      {/* Gender */}
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

                      {/* isAccepted */}
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
                              bgcolor: chat.isAccepted ? "#dcfce7" : "#fff1f2",
                              color: chat.isAccepted ? "#16a34a" : "#dc2626",
                            },
                            "[data-joy-color-scheme='dark'] &": {
                              bgcolor: chat.isAccepted
                                ? "rgba(74,222,128,0.1)"
                                : "rgba(248,113,113,0.08)",
                              color: chat.isAccepted ? "#4ade80" : "#f87171",
                            },
                          }}
                        >
                          {chat.isAccepted ? (
                            <RiCheckLine size={14} />
                          ) : (
                            <RiCloseLine size={14} />
                          )}
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
                              flexShrink: 0,
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
                              fontSize: "0.75rem",
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
    </Box>
  );
}
