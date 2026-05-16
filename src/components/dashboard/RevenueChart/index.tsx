"use client";

import { useState, useMemo } from "react";
import { Box, Typography } from "@mui/joy";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useColorScheme } from "@mui/joy/styles";
import {
  AnalyticsData,
  ChartDataPoint,
  PeriodType,
} from "@/types/analytics.types";

const MONTH_NAMES: Record<string, string> = {
  January: "Yan",
  February: "Fev",
  March: "Mar",
  April: "Apr",
  May: "May",
  June: "Iyun",
  July: "Iyul",
  August: "Avg",
  September: "Sen",
  October: "Okt",
  November: "Noy",
  December: "Dek",
};

const WEEK_DAYS = ["Dush", "Sesh", "Chor", "Pay", "Jum", "Shan", "Yak"];

// ✅ Fixed skeleton heights — Math.random() yo'q
const SKELETON_HEIGHTS = [45, 72, 38, 65, 55, 80, 42, 68, 35, 75, 50, 60];

interface RevenueChartProps {
  data: AnalyticsData | null;
  loading?: boolean;
  isDark?: boolean; // optional — ichida useColorScheme ishlatamiz
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <Box
      sx={{
        borderRadius: "8px",
        border: "1px solid rgba(255,255,255,0.08)",
        p: 1.5,
        minWidth: 180,
        bgcolor: "#1c1c21",
        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
      }}
    >
      <Typography
        sx={{
          fontFamily: "var(--font-montserrat)",
          fontWeight: 700,
          fontSize: "0.8125rem",
          color: "#fafafa",
          mb: 1,
        }}
      >
        {label}
      </Typography>
      {payload.map((entry: any) => (
        <Box
          key={entry.name}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
            mb: 0.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: entry.color,
              }}
            />
            <Typography
              sx={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.75rem",
                color: "#a1a1aa",
              }}
            >
              {entry.name}
            </Typography>
          </Box>
          <Typography
            sx={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 700,
              fontSize: "0.75rem",
              color: "#fafafa",
            }}
          >
            {Number(entry.value).toLocaleString("uz-UZ")} so'm
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

// ✅ Fixed heights — hydration safe
function ChartSkeleton() {
  return (
    <Box
      sx={{
        width: "100%",
        height: 300,
        display: "flex",
        alignItems: "flex-end",
        gap: 1,
        px: 2,
      }}
    >
      {SKELETON_HEIGHTS.map((height, i) => (
        <Box
          key={i}
          sx={{
            flex: 1,
            borderRadius: "4px 4px 0 0",
            height: `${height}%`,
            "@keyframes shimmer": {
              "0%": { opacity: 1 },
              "50%": { opacity: 0.35 },
              "100%": { opacity: 1 },
            },
            animation: `shimmer 1.4s ease-in-out ${i * 0.05}s infinite`,
            "[data-joy-color-scheme='light'] &": { bgcolor: "#e2e8f0" },
            "[data-joy-color-scheme='dark'] &": { bgcolor: "#3a3a44" },
          }}
        />
      ))}
    </Box>
  );
}

export default function RevenueChart({ data, loading }: RevenueChartProps) {
  // ✅ isDark prop o'rniga useColorScheme — SSR safe
  const { mode } = useColorScheme();
  const isDark = mode === "dark";

  const [period, setPeriod] = useState<PeriodType>("monthly");
  const currentYear = new Date().getFullYear();

  const monthlyData = useMemo<ChartDataPoint[]>(() => {
    if (!data?.data) return [];
    return Object.entries(data.data).map(([month, values]) => ({
      month,
      monthShort: MONTH_NAMES[month] ?? month.slice(0, 3),
      totalProfit: values.totalProfit,
      liveChatProfit: values.liveChatProfit,
      tariffProfit: values.tariffProfit,
    }));
  }, [data]);

  // ✅ Math.random() olib tashlandi — deterministik qiymatlar
  const weeklyData = useMemo(() => {
    if (!monthlyData.length) return [];
    const currentMonthIndex = new Date().getMonth();
    const currentMonth = monthlyData[currentMonthIndex];
    if (!currentMonth) return [];
    // Fixed multiplierlar — random yo'q
    const multipliers = [0.1, 0.2, 0.35, 0.5, 0.65, 0.82, 1.0];
    return WEEK_DAYS.map((day, i) => ({
      monthShort: day,
      totalProfit: Math.round((currentMonth.totalProfit / 4) * multipliers[i]),
      liveChatProfit: Math.round(
        (currentMonth.liveChatProfit / 4) * multipliers[i],
      ),
      tariffProfit: Math.round(
        (currentMonth.tariffProfit / 4) * multipliers[i],
      ),
    }));
  }, [monthlyData]);

  // ✅ Math.random() olib tashlandi
  const yearlyData = useMemo(() => {
    if (!data) return [];
    const total = data.totalProfit;
    const multipliers = [0.3, 0.45, 0.6, 0.78, 1.0];
    return Array.from({ length: 5 }, (_, i) => ({
      monthShort: String(currentYear - 4 + i),
      totalProfit: i === 4 ? total : Math.round(total * multipliers[i]),
      liveChatProfit:
        i === 4
          ? data.totalLiveChatAmount
          : Math.round(data.totalLiveChatAmount * multipliers[i]),
      tariffProfit:
        i === 4
          ? data.totalTariffAmount
          : Math.round(data.totalTariffAmount * multipliers[i]),
    }));
  }, [data, currentYear]);

  const chartData =
    period === "monthly"
      ? monthlyData
      : period === "weekly"
        ? weeklyData
        : yearlyData;

  const gridColor = isDark ? "#27272a" : "#f1f5f9";
  const textColor = isDark ? "#71717d" : "#94a3b8";
  const totalAmount = data?.totalProfit ?? 0;

  const periods: { key: PeriodType; label: string }[] = [
    { key: "weekly", label: "Haftalik" },
    { key: "monthly", label: "Oylik" },
    { key: "yearly", label: "Yillik" },
  ];

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
          alignItems: "flex-start",
          justifyContent: "space-between",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
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
              mb: 0.25,
            }}
          >
            Daromad tahlili
          </Typography>
          <Typography
            sx={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.875rem",
              color: "text.tertiary",
            }}
          >
            {currentYear} yil uchun umumiy:
            <Box
              component="span"
              sx={{
                fontWeight: 700,
                ml: 0.75,
                "[data-joy-color-scheme='light'] &": { color: "#0284c7" },
                "[data-joy-color-scheme='dark'] &": { color: "#c084fc" },
              }}
            >
              {totalAmount.toLocaleString("uz-UZ")} so'm
            </Box>
          </Typography>
        </Box>

        {/* Period toggle */}
        <Box
          sx={{
            display: "flex",
            gap: 0.75,
            p: 0.5,
            borderRadius: "8px",
            "[data-joy-color-scheme='light'] &": { bgcolor: "#f1f5f9" },
            "[data-joy-color-scheme='dark'] &": { bgcolor: "#26262d" },
          }}
        >
          {periods.map((p) => (
            <Box
              key={p.key}
              onClick={() => setPeriod(p.key)}
              sx={{
                px: 1.5,
                py: 0.625,
                borderRadius: "6px",
                cursor: "pointer",
                fontFamily: "var(--font-montserrat)",
                fontWeight: 600,
                fontSize: "0.8125rem",
                transition: "all 0.2s ease",
                ...(period === p.key
                  ? {
                      "[data-joy-color-scheme='light'] &": {
                        bgcolor: "#0284c7",
                        color: "#fff",
                      },
                      "[data-joy-color-scheme='dark'] &": {
                        bgcolor: "#9333ea",
                        color: "#fff",
                      },
                    }
                  : {
                      "[data-joy-color-scheme='light'] &": {
                        color: "#64748b",
                        "&:hover": { bgcolor: "#e2e8f0" },
                      },
                      "[data-joy-color-scheme='dark'] &": {
                        color: "#71717d",
                        "&:hover": { bgcolor: "#3a3a44" },
                      },
                    }),
              }}
            >
              {p.label}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Summary cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 1.5,
          mb: 3,
        }}
      >
        {[
          {
            label: "Jami daromad",
            value: data?.totalProfit ?? 0,
            color: isDark ? "#c084fc" : "#0284c7",
          },
          {
            label: "Live Chat",
            value: data?.totalLiveChatAmount ?? 0,
            color: "#4ade80",
          },
          {
            label: "Tariflar",
            value: data?.totalTariffAmount ?? 0,
            color: "#fbbf24",
          },
        ].map((item) => (
          <Box
            key={item.label}
            sx={{
              p: 1.5,
              borderRadius: "8px",
              "[data-joy-color-scheme='light'] &": { bgcolor: "#f8fafc" },
              "[data-joy-color-scheme='dark'] &": { bgcolor: "#26262d" },
            }}
          >
            <Typography
              sx={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.75rem",
                color: "text.tertiary",
                mb: 0.5,
              }}
            >
              {item.label}
            </Typography>
            <Typography
              sx={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 700,
                fontSize: "1rem",
                color: item.color,
                letterSpacing: "-0.02em",
              }}
            >
              {item.value.toLocaleString("uz-UZ")}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Chart */}
      {loading ? (
        <ChartSkeleton />
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={isDark ? "#9333ea" : "#0284c7"}
                  stopOpacity={0.25}
                />
                <stop
                  offset="95%"
                  stopColor={isDark ? "#9333ea" : "#0284c7"}
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="livechatGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="tariffGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke={gridColor}
              vertical={false}
            />
            <XAxis
              dataKey="monthShort"
              tick={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: 12,
                fill: textColor,
              }}
              axisLine={false}
              tickLine={false}
              dy={8}
            />
            <YAxis
              tick={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: 11,
                fill: textColor,
              }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) =>
                v >= 1_000_000
                  ? `${(v / 1_000_000).toFixed(1)}M`
                  : v >= 1000
                    ? `${(v / 1000).toFixed(0)}K`
                    : String(v)
              }
              width={52}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: isDark ? "#3a3a44" : "#e2e8f0",
                strokeWidth: 1,
              }}
            />
            <Legend
              wrapperStyle={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: 12,
                paddingTop: 16,
              }}
              formatter={(value) => (
                <span style={{ color: textColor, fontWeight: 600 }}>
                  {value === "totalProfit"
                    ? "Jami"
                    : value === "liveChatProfit"
                      ? "Live Chat"
                      : "Tariflar"}
                </span>
              )}
            />

            <Area
              type="monotone"
              dataKey="totalProfit"
              name="totalProfit"
              stroke={isDark ? "#9333ea" : "#0284c7"}
              strokeWidth={2.5}
              fill="url(#totalGradient)"
              dot={false}
              activeDot={{
                r: 5,
                fill: isDark ? "#9333ea" : "#0284c7",
                strokeWidth: 0,
              }}
            />
            <Area
              type="monotone"
              dataKey="liveChatProfit"
              name="liveChatProfit"
              stroke="#22c55e"
              strokeWidth={2}
              fill="url(#livechatGradient)"
              dot={false}
              activeDot={{ r: 4, fill: "#22c55e", strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="tariffProfit"
              name="tariffProfit"
              stroke="#f59e0b"
              strokeWidth={2}
              fill="url(#tariffGradient)"
              dot={false}
              activeDot={{ r: 4, fill: "#f59e0b", strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
}
