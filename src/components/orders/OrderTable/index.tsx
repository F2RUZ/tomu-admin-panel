// src/components/orders/OrderTable/index.tsx
"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Box, Typography, Input, Select, Option } from "@mui/joy";
import { RiSearchLine, RiExchangeLine } from "react-icons/ri";
import { ORDER_STATUS_CONFIG, PAYMENT_TYPE_CONFIG } from "@/types/order.types";
import OrderService from "@/services/orderService";
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
        <Box sx={{ ...s, width: 40, height: 14 }} />
      </td>
      <td style={{ padding: "14px 16px" }}>
        <Box sx={{ ...s, width: 80, height: 22, borderRadius: "6px" }} />
      </td>
      <td style={{ padding: "14px 16px" }}>
        <Box sx={{ ...s, width: 110, height: 14 }} />
      </td>
      <td style={{ padding: "14px 16px" }}>
        <Box sx={{ ...s, width: 100, height: 22, borderRadius: "6px" }} />
      </td>
      <td style={{ padding: "14px 16px" }}>
        <Box sx={{ ...s, width: 80, height: 14 }} />
      </td>
      <td style={{ padding: "14px 16px" }}>
        <Box sx={{ ...s, width: 120, height: 14 }} />
      </td>
    </tr>
  );
}

const STATUS_OPTIONS = [
  { value: "", label: "Barcha statuslar" },
  { value: "PENDING", label: "Kutilmoqda" },
  { value: "PAID", label: "To'langan" },
  { value: "CANCELLED", label: "Bekor qilingan" },
  { value: "EXPIRED", label: "Muddati o'tgan" },
];

const TYPE_OPTIONS = [
  { value: "", label: "Barcha to'lovlar" },
  { value: "livechat", label: "Live Chat" },
  { value: "tariff", label: "Tarif" },
  { value: "payme", label: "Payme" },
  { value: "click", label: "Click" },
  { value: "uzum", label: "Uzum" },
  { value: "cash", label: "Naqd" },
];

export default function OrderTable() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(7);

  const { data, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: OrderService.getAll,
    select: (res) => (Array.isArray(res.data) ? res.data : []),
  });

  const orders = data ?? [];

  const filtered = useMemo(() => {
    let arr = [...orders];
    if (statusFilter) arr = arr.filter((o) => o.status === statusFilter);
    if (typeFilter) arr = arr.filter((o) => o.type === typeFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      arr = arr.filter(
        (o) =>
          String(o.id).includes(q) ||
          String(o.userId).includes(q) ||
          String(o.courseId ?? "").includes(q),
      );
    }
    return arr;
  }, [orders, statusFilter, typeFilter, search]);

  const paginated = useMemo(
    () => filtered.slice((page - 1) * perPage, page * perPage),
    [filtered, page, perPage],
  );

  const formatPrice = (price: number) =>
    Number(price).toLocaleString("uz-UZ") + " so'm";

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("uz-UZ", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const totalPaid = orders
    .filter((o) => o.status === "PAID")
    .reduce((sum, o) => sum + Number(o.totalPrice), 0);

  const tdStyle: React.CSSProperties = { padding: "14px 16px" };
  const cols = [
    "#",
    "ID",
    "To'lov turi",
    "Narx",
    "Status",
    "Kurs/Tarif",
    "Sana",
  ];
  const widths = ["48px", "70px", "130px", "150px", "150px", "110px", "160px"];

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
      <PageHeader
        title="Buyurtmalar"
        subtitle={`Jami ${orders.length} ta · To'langan: ${formatPrice(totalPaid)}`}
      />

      {/* Mini stats */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "repeat(2,1fr)", md: "repeat(4,1fr)" },
          gap: 1.5,
          mb: 3,
        }}
      >
        {Object.entries(ORDER_STATUS_CONFIG).map(([key, cfg]) => {
          const count = orders.filter((o) => o.status === key).length;
          return (
            <Box
              key={key}
              sx={{
                p: 1.5,
                borderRadius: "8px",
                border: "1px solid",
                "[data-joy-color-scheme='light'] &": {
                  bgcolor: cfg.light.bg,
                  borderColor: "#e2e8f0",
                },
                "[data-joy-color-scheme='dark'] &": {
                  bgcolor: cfg.dark.bg,
                  borderColor: "#3a3a44",
                },
              }}
            >
              <Typography
                sx={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 800,
                  fontSize: "1.5rem",
                  letterSpacing: "-0.03em",
                  "[data-joy-color-scheme='light'] &": {
                    color: cfg.light.color,
                  },
                  "[data-joy-color-scheme='dark'] &": { color: cfg.dark.color },
                }}
              >
                {count}
              </Typography>
              <Typography
                sx={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.8125rem",
                  "[data-joy-color-scheme='light'] &": {
                    color: cfg.light.color,
                  },
                  "[data-joy-color-scheme='dark'] &": { color: cfg.dark.color },
                }}
              >
                {cfg.label}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* Filters */}
      <Box sx={{ display: "flex", gap: 1.5, mb: 2, flexWrap: "wrap" }}>
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="ID yoki User ID..."
          startDecorator={<RiSearchLine size={16} />}
          sx={{
            flex: 1,
            minWidth: 180,
            maxWidth: 260,
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
        <Select
          value={typeFilter}
          onChange={(_, v) => {
            setTypeFilter(v ?? "");
            setPage(1);
          }}
          sx={{ ...selectSx, width: 170 }}
        >
          {TYPE_OPTIONS.map((t) => (
            <Option
              key={t.value}
              value={t.value}
              sx={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.875rem",
              }}
            >
              {t.label}
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
                      title="Buyurtmalar topilmadi"
                      description="Boshqa filtr bilan qidiring"
                    />
                  </td>
                </tr>
              ) : (
                paginated.map((order, idx) => {
                  const statusCfg =
                    ORDER_STATUS_CONFIG[order.status] ??
                    ORDER_STATUS_CONFIG.PENDING;
                  const typeCfg = PAYMENT_TYPE_CONFIG[order.type] ?? {
                    label: order.type,
                    color: "#64748b",
                  };

                  return (
                    <tr
                      key={order.id}
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

                      {/* Order ID */}
                      <td style={tdStyle}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Box
                            sx={{
                              width: 28,
                              height: 28,
                              borderRadius: "8px",
                              flexShrink: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
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
                            <RiExchangeLine size={13} />
                          </Box>
                          <Typography
                            sx={{
                              fontFamily: "var(--font-montserrat)",
                              fontWeight: 700,
                              fontSize: "0.875rem",
                              color: "text.primary",
                            }}
                          >
                            #{order.id}
                          </Typography>
                        </Box>
                      </td>

                      {/* Payment type */}
                      <td style={tdStyle}>
                        <Box
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 0.5,
                            px: 1.25,
                            py: 0.375,
                            borderRadius: "6px",
                            border: "1px solid",
                            "[data-joy-color-scheme='light'] &": {
                              borderColor: "#e2e8f0",
                              bgcolor: "#f8fafc",
                            },
                            "[data-joy-color-scheme='dark'] &": {
                              borderColor: "#3a3a44",
                              bgcolor: "#26262d",
                            },
                          }}
                        >
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              bgcolor: typeCfg.color,
                              flexShrink: 0,
                            }}
                          />
                          <Typography
                            sx={{
                              fontFamily: "var(--font-montserrat)",
                              fontWeight: 600,
                              fontSize: "0.75rem",
                              color: typeCfg.color,
                            }}
                          >
                            {typeCfg.label}
                          </Typography>
                        </Box>
                      </td>

                      {/* Price */}
                      <td style={tdStyle}>
                        <Typography
                          sx={{
                            fontFamily: "var(--font-montserrat)",
                            fontWeight: 700,
                            fontSize: "0.9375rem",
                            letterSpacing: "-0.02em",
                            "[data-joy-color-scheme='light'] &": {
                              color:
                                order.status === "PAID"
                                  ? "#16a34a"
                                  : "text.primary",
                            },
                            "[data-joy-color-scheme='dark'] &": {
                              color:
                                order.status === "PAID"
                                  ? "#4ade80"
                                  : "text.primary",
                            },
                          }}
                        >
                          {formatPrice(order.totalPrice)}
                        </Typography>
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

                      {/* Kurs/Tarif/LiveChat */}
                      <td style={tdStyle}>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 0.25,
                          }}
                        >
                          {order.courseId && (
                            <Typography
                              sx={{
                                fontFamily: "var(--font-montserrat)",
                                fontSize: "0.75rem",
                                color: "text.tertiary",
                              }}
                            >
                              Kurs: #{order.courseId}
                            </Typography>
                          )}
                          {order.tariffId && (
                            <Typography
                              sx={{
                                fontFamily: "var(--font-montserrat)",
                                fontSize: "0.75rem",
                                color: "text.tertiary",
                              }}
                            >
                              Tarif: #{order.tariffId}
                            </Typography>
                          )}
                          {order.liveChatId && (
                            <Typography
                              sx={{
                                fontFamily: "var(--font-montserrat)",
                                fontSize: "0.75rem",
                                color: "text.tertiary",
                              }}
                            >
                              LiveChat: #{order.liveChatId}
                            </Typography>
                          )}
                          {!order.courseId &&
                            !order.tariffId &&
                            !order.liveChatId && (
                              <Typography
                                sx={{
                                  fontFamily: "var(--font-montserrat)",
                                  fontSize: "0.75rem",
                                  color: "text.tertiary",
                                }}
                              >
                                —
                              </Typography>
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
                          {formatDate(order.createdAt)}
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
          perPageOptions={[10, 20, 50, 100]}
        />
      )}
    </Box>
  );
}
