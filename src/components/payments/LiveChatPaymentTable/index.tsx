// src/components/payments/LiveChatPaymentTable/index.tsx
"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Box, Typography, Input } from "@mui/joy";
import {
  RiSearchLine,
  RiBookOpenLine,
  RiMoneyDollarCircleLine,
  RiMenLine,
  RiWomenLine,
  RiTimeLine,
  RiCalendarLine,
} from "react-icons/ri";
import LiveChatService from "@/services/liveChatService";
import PageHeader from "@/components/ui/PageHeader";
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
      <td style={{ padding: "14px 16px" }}>
        <Box sx={{ ...s, width: 20, height: 14 }} />
      </td>
      <td style={{ padding: "14px 16px" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{ ...s, width: 36, height: 36, borderRadius: "8px" }} />
          <Box>
            <Box sx={{ ...s, width: 120, height: 14, mb: 0.75 }} />
            <Box sx={{ ...s, width: 90, height: 12 }} />
          </Box>
        </Box>
      </td>
      <td style={{ padding: "14px 16px" }}>
        <Box sx={{ ...s, width: 130, height: 14 }} />
      </td>
      <td style={{ padding: "14px 16px" }}>
        <Box sx={{ ...s, width: 100, height: 14 }} />
      </td>
      <td style={{ padding: "14px 16px" }}>
        <Box sx={{ ...s, width: 60, height: 14 }} />
      </td>
      <td style={{ padding: "14px 16px" }}>
        <Box sx={{ ...s, width: 100, height: 14 }} />
      </td>
      <td style={{ padding: "14px 16px" }}>
        <Box sx={{ ...s, width: 24, height: 24, borderRadius: "6px" }} />
      </td>
      <td style={{ padding: "14px 16px" }}>
        <Box sx={{ ...s, width: 90, height: 14 }} />
      </td>
    </tr>
  );
}

export default function LiveChatPaymentTable() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(7);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["liveChats"],
    queryFn: LiveChatService.getAll,
    select: (res: any) => Array.isArray(res.data) ? res.data.filter((c: any) => c.status === "paid") : [],
  });

  // Faqat to'langan (paid) livechatlarni ko'rsatamiz
  const allChats = data ?? [];
  const payments = allChats.filter((c: any) => c.status === "paid");
  const total = payments.length;

  const filtered = useMemo(() => {
    if (!search.trim()) return payments;
    const q = search.toLowerCase();
    return payments.filter(
      (p) =>
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) ||
        p.selectedCourseName.toLowerCase().includes(q) ||
        p.phoneNumber.includes(q),
    );
  }, [search, payments]);

  const formatPrice = (amount: string | number) =>
    Number(amount).toLocaleString("uz-UZ") + " so'm";

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("uz-UZ", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const totalAmount = payments.reduce((sum: number, p: any) => sum + Number(p.price), 0);

  const tdStyle: React.CSSProperties = { padding: "14px 16px" };
  const cols = [
    "#",
    "Foydalanuvchi",
    "Kurs",
    "To'lov",
    "Davomiylik",
    "Seans",
    "Jins",
    "Sana",
  ];
  const widths = [
    "48px",
    "190px",
    "160px",
    "150px",
    "100px",
    "160px",
    "70px",
    "110px",
  ];

  return (
    <Box>
      <PageHeader
        title="Live Chat to'lovlari"
        subtitle={`Jami ${total} ta to'lov · ${formatPrice(totalAmount)}`}
      />

      {/* Search */}
      <Box sx={{ mb: 2 }}>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Ism, kurs yoki telefon..."
          startDecorator={<RiSearchLine size={16} />}
          sx={{
            maxWidth: 340,
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
            style={{ width: "100%", borderCollapse: "collapse", minWidth: 860 }}
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
                  <td colSpan={8} style={{ padding: "40px 16px" }}>
                    <EmptyState
                      title="To'lovlar topilmadi"
                      description="Boshqa kalit so'z bilan qidiring"
                    />
                  </td>
                </tr>
              ) : (
                filtered.map((payment, idx) => {
                  const isMale = payment.gender === "male";
                  return (
                    <tr
                      key={payment.id}
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
                            {payment.firstName?.[0] ?? "?"}
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
                              {payment.firstName} {payment.lastName}
                            </Typography>
                            <Typography
                              sx={{
                                fontFamily: "var(--font-montserrat)",
                                fontSize: "0.75rem",
                                color: "text.tertiary",
                              }}
                            >
                              {payment.phoneNumber}
                            </Typography>
                          </Box>
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
                                bgcolor: "#e0f2fe",
                                color: "#0284c7",
                              },
                              "[data-joy-color-scheme='dark'] &": {
                                bgcolor: "rgba(2,132,199,0.1)",
                                color: "#38bdf8",
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
                            {payment.selectedCourseName}
                          </Typography>
                        </Box>
                      </td>

                      {/* Amount */}
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
                                color: "#9333ea",
                              },
                              "[data-joy-color-scheme='dark'] &": {
                                color: "#c084fc",
                              },
                            }}
                          >
                            <RiMoneyDollarCircleLine size={16} />
                          </Box>
                          <Typography
                            sx={{
                              fontFamily: "var(--font-montserrat)",
                              fontWeight: 700,
                              fontSize: "0.9375rem",
                              letterSpacing: "-0.02em",
                              "[data-joy-color-scheme='light'] &": {
                                color: "#9333ea",
                              },
                              "[data-joy-color-scheme='dark'] &": {
                                color: "#c084fc",
                              },
                            }}
                          >
                            {formatPrice(payment.price)}
                          </Typography>
                        </Box>
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
                            {payment.duration} daq
                          </Typography>
                        </Box>
                      </td>

                      {/* Session */}
                      <td style={tdStyle}>
                        <Box>
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
                              {payment.selectedDay}
                            </Typography>
                          </Box>
                          <Typography
                            sx={{
                              fontFamily: "var(--font-montserrat)",
                              fontSize: "0.75rem",
                              color: "text.tertiary",
                              pl: 2.5,
                            }}
                          >
                            {payment.selectedTime}
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

                      {/* Date */}
                      <td style={tdStyle}>
                        <Typography
                          sx={{
                            fontFamily: "var(--font-montserrat)",
                            fontSize: "0.8125rem",
                            color: "text.tertiary",
                          }}
                        >
                          {formatDate(payment.createdAt)}
                        </Typography>
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
          perPageOptions={[10, 20, 50]}
        />
      )}
    </Box>
  );
}
