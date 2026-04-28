// src/app/(dashboard)/dashboard/page.tsx
"use client";

import { Box, Typography } from "@mui/joy";
import { useQuery } from "@tanstack/react-query";
import StatGrid from "@/components/dashboard/StatGrid";
import RevenueChart from "@/components/dashboard/RevenueChart";
import RecentActivity from "@/components/dashboard/RecentActivity";
import AnalyticsService from "@/services/analyticsService";
import { useThemeStore } from "@/store/themeStore";

const currentYear = new Date().getFullYear();

export default function DashboardPage() {
  const { mode } = useThemeStore();
  const isDark = mode === "dark";

  const { data: analytics, isLoading } = useQuery({
    queryKey: ["analytics", currentYear],
    queryFn: () => AnalyticsService.getByYear(currentYear),
  });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Page title */}
      <Box>
        <Typography
          sx={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 800,
            fontSize: "1.375rem",
            letterSpacing: "-0.03em",
            color: "text.primary",
          }}
        >
          Dashboard
        </Typography>
        <Typography
          sx={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.875rem",
            color: "text.tertiary",
            mt: 0.25,
          }}
        >
          {currentYear} yil — TOMU Admin Panel
        </Typography>
      </Box>

      {/* Stat cards */}
      <StatGrid />

      {/* Chart + Activity */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1fr 360px" },
          gap: 3,
        }}
      >
        <RevenueChart
          data={analytics ?? null}
          loading={isLoading}
          isDark={isDark}
        />
        <RecentActivity />
      </Box>
    </Box>
  );
}
