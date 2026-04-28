// src/components/dashboard/StatGrid/index.tsx
"use client";

import { Box } from "@mui/joy";
import { useQuery } from "@tanstack/react-query";
import {
  RiUserLine,
  RiBookOpenLine,
  RiExchangeLine,
  RiMoneyDollarCircleLine,
} from "react-icons/ri";
import StatCard from "@/components/dashboard/StatCard";
import AnalyticsService from "@/services/analyticsService";

const currentYear = new Date().getFullYear();

function StatSkeleton() {
  const shimmer = {
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
        borderRadius: "8px",
        border: "1px solid",
        p: 2.5,
        "[data-joy-color-scheme='light'] &": {
          bgcolor: "#fff",
          borderColor: "#e2e8f0",
        },
        "[data-joy-color-scheme='dark'] &": {
          bgcolor: "#1c1c21",
          borderColor: "#3a3a44",
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Box sx={{ ...shimmer, width: 44, height: 44, borderRadius: "8px" }} />
        <Box sx={{ ...shimmer, width: 60, height: 24, borderRadius: "6px" }} />
      </Box>
      <Box sx={{ ...shimmer, width: 120, height: 28, mb: 1 }} />
      <Box sx={{ ...shimmer, width: 80, height: 16 }} />
    </Box>
  );
}

export default function StatGrid() {
  const { data: analytics, isLoading: loadingAnalytics } = useQuery({
    queryKey: ["analytics", currentYear],
    queryFn: () => AnalyticsService.getByYear(currentYear),
  });

  const { data: userCount, isLoading: loadingUsers } = useQuery({
    queryKey: ["userCount"],
    queryFn: AnalyticsService.getUserCount,
  });

  const { data: courseCount, isLoading: loadingCourses } = useQuery({
    queryKey: ["courseCount"],
    queryFn: AnalyticsService.getCourseCount,
  });

  const { data: orderCount, isLoading: loadingOrders } = useQuery({
    queryKey: ["orderCount"],
    queryFn: AnalyticsService.getOrderCount,
  });

  const isLoading =
    loadingAnalytics || loadingUsers || loadingCourses || loadingOrders;

  const stats = [
    {
      title: "Foydalanuvchilar",
      value: userCount ?? 0,
      icon: <RiUserLine size={22} />,
      color: "blue" as const,
      change: 12,
    },
    {
      title: "Kurslar",
      value: courseCount ?? 0,
      icon: <RiBookOpenLine size={22} />,
      color: "purple" as const,
    },
    {
      title: "Buyurtmalar",
      value: orderCount ?? 0,
      icon: <RiExchangeLine size={22} />,
      color: "green" as const,
      change: 8,
    },
    {
      title: "Jami daromad",
      value: analytics?.totalProfit ?? 0,
      suffix: " so'm",
      icon: <RiMoneyDollarCircleLine size={22} />,
      color: "orange" as const,
      change: 24,
    },
  ];

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 2,
        }}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <StatSkeleton key={i} />
        ))}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          lg: "repeat(4, 1fr)",
        },
        gap: 2,
      }}
    >
      {stats.map((stat, i) => (
        <StatCard key={stat.title} {...stat} index={i} />
      ))}
    </Box>
  );
}
