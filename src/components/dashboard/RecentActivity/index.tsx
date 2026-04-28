// src/components/dashboard/RecentActivity/index.tsx
"use client";

import { Box, Typography } from "@mui/joy";
import { useQuery } from "@tanstack/react-query";
import { RiArrowUpLine, RiArrowDownLine } from "react-icons/ri";
import AnalyticsService from "@/services/analyticsService";

const currentYear = new Date().getFullYear();

const MONTHS_UZ: Record<string, string> = {
  January: "Yanvar",
  February: "Fevral",
  March: "Mart",
  April: "Aprel",
  May: "May",
  June: "Iyun",
  July: "Iyul",
  August: "Avgust",
  September: "Sentabr",
  October: "Oktabr",
  November: "Noyabr",
  December: "Dekabr",
};

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
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        py: 1.5,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box sx={{ ...s, width: 36, height: 36, borderRadius: "8px" }} />
        <Box>
          <Box sx={{ ...s, width: 80, height: 14, mb: 0.5 }} />
          <Box sx={{ ...s, width: 60, height: 12 }} />
        </Box>
      </Box>
      <Box sx={{ ...s, width: 100, height: 16 }} />
    </Box>
  );
}

export default function RecentActivity() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["analytics", currentYear],
    queryFn: () => AnalyticsService.getByYear(currentYear),
  });

  // Oylarni hisoblash va sort
  const monthRows = analytics?.data
    ? Object.entries(analytics.data)
        .map(([month, values], i, arr) => {
          const prev = i > 0 ? arr[i - 1][1].totalProfit : 0;
          const change =
            prev > 0 ? ((values.totalProfit - prev) / prev) * 100 : 0;
          return { month, values, change };
        })
        .filter((r) => r.values.totalProfit > 0)
        .reverse()
        .slice(0, 6)
    : [];

  return (
    <Box
      sx={{
        borderRadius: "8px",
        border: "1px solid",
        p: 3,
        "[data-joy-color-scheme='light'] &": {
          bgcolor: "#ffffff",
          borderColor: "#e2e8f0",
        },
        "[data-joy-color-scheme='dark'] &": {
          bgcolor: "#1c1c21",
          borderColor: "#3a3a44",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2.5,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 800,
              fontSize: "1.125rem",
              letterSpacing: "-0.02em",
              color: "text.primary",
            }}
          >
            Oylik tahlil
          </Typography>
          <Typography
            sx={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.8125rem",
              color: "text.tertiary",
              mt: 0.25,
            }}
          >
            {currentYear} yil
          </Typography>
        </Box>
      </Box>

      {/* Rows */}
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
        ) : monthRows.length === 0 ? (
          <Typography
            sx={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.875rem",
              color: "text.tertiary",
              textAlign: "center",
              py: 4,
            }}
          >
            Ma'lumot mavjud emas
          </Typography>
        ) : (
          monthRows.map(({ month, values, change }, i) => (
            <Box
              key={month}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                py: 1.5,
                borderBottom: i < monthRows.length - 1 ? "1px solid" : "none",
                "[data-joy-color-scheme='light'] &": { borderColor: "#f1f5f9" },
                "[data-joy-color-scheme='dark'] &": { borderColor: "#26262d" },
              }}
            >
              {/* Left */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 700,
                    fontSize: "0.75rem",
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
                  {MONTHS_UZ[month]?.slice(0, 3)}
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontFamily: "var(--font-montserrat)",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      color: "text.primary",
                    }}
                  >
                    {MONTHS_UZ[month]}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Typography
                      sx={{
                        fontFamily: "var(--font-montserrat)",
                        fontSize: "0.75rem",
                        color: "text.tertiary",
                      }}
                    >
                      LC: {values.liveChatProfit.toLocaleString("uz-UZ")}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "var(--font-montserrat)",
                        fontSize: "0.75rem",
                        color: "text.tertiary",
                      }}
                    >
                      T: {values.tariffProfit.toLocaleString("uz-UZ")}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Right */}
              <Box sx={{ textAlign: "right" }}>
                <Typography
                  sx={{
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 700,
                    fontSize: "0.9375rem",
                    color: "text.primary",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {values.totalProfit.toLocaleString("uz-UZ")}
                </Typography>
                {change !== 0 && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      gap: 0.25,
                    }}
                  >
                    {change > 0 ? (
                      <RiArrowUpLine size={13} color="#22c55e" />
                    ) : (
                      <RiArrowDownLine size={13} color="#ef4444" />
                    )}
                    <Typography
                      sx={{
                        fontFamily: "var(--font-montserrat)",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: change > 0 ? "#22c55e" : "#ef4444",
                      }}
                    >
                      {Math.abs(change).toFixed(1)}%
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
}
