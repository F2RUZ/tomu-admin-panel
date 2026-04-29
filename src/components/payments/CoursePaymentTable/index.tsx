// src/components/payments/CoursePaymentTable/index.tsx
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
} from "react-icons/ri";
import PaymentService from "@/services/paymentService";
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
        <Box sx={{ ...s, width: 140, height: 14 }} />
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

export default function CoursePaymentTable() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(7);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["coursePayments", page, perPage],
    queryFn: () => PaymentService.getCoursePayments(perPage, page),
  });

  const payments = data?.data?.data ?? [];
  const total = data?.data?.count ?? 0;

  // Client-side search
  const filtered = useMemo(() => {
    if (!search.trim()) return payments;
    const q = search.toLowerCase();
    return payments.filter(
      (p) =>
        p.fullName.toLowerCase().includes(q) ||
        p.courseName.toLowerCase().includes(q) ||
        p.userPhoneNumber.includes(q),
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

  // Jami summa
  const totalAmount = payments.reduce(
    (sum, p) => sum + Number(p.paymentAmount),
    0,
  );

  const tdStyle: React.CSSProperties = { padding: "14px 16px" };
  const cols = [
    "#",
    "Foydalanuvchi",
    "Kurs nomi",
    "To'lov miqdori",
    "Jins",
    "Sana",
  ];
  const widths = ["48px", "200px", "200px", "160px", "70px", "120px"];

  return (
    <Box>
      <PageHeader
        title="Kurs to'lovlari"
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
            style={{ width: "100%", borderCollapse: "collapse", minWidth: 660 }}
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
                                bgcolor: "#f1f5f9",
                                color: "#64748b",
                              },
                              "[data-joy-color-scheme='dark'] &": {
                                bgcolor: "#26262d",
                                color: "#a1a1aa",
                              },
                            }}
                          >
                            {payment.fullName?.[0] ?? "?"}
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
                              {payment.fullName}
                            </Typography>
                            <Typography
                              sx={{
                                fontFamily: "var(--font-montserrat)",
                                fontSize: "0.75rem",
                                color: "text.tertiary",
                              }}
                            >
                              {payment.userPhoneNumber}
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
                            {payment.courseName}
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
                                color: "#16a34a",
                              },
                              "[data-joy-color-scheme='dark'] &": {
                                color: "#4ade80",
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
                                color: "#16a34a",
                              },
                              "[data-joy-color-scheme='dark'] &": {
                                color: "#4ade80",
                              },
                            }}
                          >
                            {formatPrice(payment.paymentAmount)}
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
