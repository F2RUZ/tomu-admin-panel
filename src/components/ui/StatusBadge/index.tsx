// src/components/ui/StatusBadge/index.tsx
"use client";

import { Box, Typography } from "@mui/joy";

type StatusType =
  | "active"
  | "inactive"
  | "pending"
  | "paid"
  | "cancelled"
  | "expired"
  | "filling"
  | "completed"
  | "scheduled"
  | "success"
  | "error"
  | "warning";

interface StatusBadgeProps {
  status: StatusType | string;
  label?: string;
  size?: "sm" | "md";
}

const STATUS_CONFIG: Record<
  string,
  {
    label: string;
    light: { bg: string; color: string };
    dark: { bg: string; color: string };
  }
> = {
  active: {
    label: "Faol",
    light: { bg: "#dcfce7", color: "#15803d" },
    dark: { bg: "rgba(74,222,128,0.1)", color: "#4ade80" },
  },
  inactive: {
    label: "Nofaol",
    light: { bg: "#f1f5f9", color: "#64748b" },
    dark: { bg: "rgba(113,113,125,0.1)", color: "#71717d" },
  },
  pending: {
    label: "Kutilmoqda",
    light: { bg: "#fef3c7", color: "#b45309" },
    dark: { bg: "rgba(251,191,36,0.1)", color: "#fbbf24" },
  },
  paid: {
    label: "To'langan",
    light: { bg: "#dcfce7", color: "#15803d" },
    dark: { bg: "rgba(74,222,128,0.1)", color: "#4ade80" },
  },
  cancelled: {
    label: "Bekor qilingan",
    light: { bg: "#fff1f2", color: "#b91c1c" },
    dark: { bg: "rgba(248,113,113,0.1)", color: "#f87171" },
  },
  expired: {
    label: "Muddati o'tgan",
    light: { bg: "#fff1f2", color: "#b91c1c" },
    dark: { bg: "rgba(248,113,113,0.1)", color: "#f87171" },
  },
  filling: {
    label: "To'ldirilmoqda",
    light: { bg: "#e0f2fe", color: "#0369a1" },
    dark: { bg: "rgba(192,132,252,0.1)", color: "#c084fc" },
  },
  completed: {
    label: "Tugallangan",
    light: { bg: "#dcfce7", color: "#15803d" },
    dark: { bg: "rgba(74,222,128,0.1)", color: "#4ade80" },
  },
  scheduled: {
    label: "Rejalashtirilgan",
    light: { bg: "#e0f2fe", color: "#0369a1" },
    dark: { bg: "rgba(192,132,252,0.1)", color: "#c084fc" },
  },
  success: {
    label: "Muvaffaqiyatli",
    light: { bg: "#dcfce7", color: "#15803d" },
    dark: { bg: "rgba(74,222,128,0.1)", color: "#4ade80" },
  },
  error: {
    label: "Xato",
    light: { bg: "#fff1f2", color: "#b91c1c" },
    dark: { bg: "rgba(248,113,113,0.1)", color: "#f87171" },
  },
  warning: {
    label: "Ogohlantirish",
    light: { bg: "#fef3c7", color: "#b45309" },
    dark: { bg: "rgba(251,191,36,0.1)", color: "#fbbf24" },
  },
};

export default function StatusBadge({
  status,
  label,
  size = "sm",
}: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.inactive;
  const displayLabel = label ?? config.label;

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.5,
        px: size === "sm" ? 1 : 1.5,
        py: size === "sm" ? 0.25 : 0.5,
        borderRadius: "99px",
        "[data-joy-color-scheme='light'] &": {
          bgcolor: config.light.bg,
        },
        "[data-joy-color-scheme='dark'] &": {
          bgcolor: config.dark.bg,
        },
      }}
    >
      {/* Dot */}
      <Box
        sx={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          flexShrink: 0,
          "[data-joy-color-scheme='light'] &": { bgcolor: config.light.color },
          "[data-joy-color-scheme='dark'] &": { bgcolor: config.dark.color },
        }}
      />
      <Typography
        sx={{
          fontFamily: "var(--font-montserrat)",
          fontWeight: 600,
          fontSize: size === "sm" ? "0.6875rem" : "0.75rem",
          "[data-joy-color-scheme='light'] &": { color: config.light.color },
          "[data-joy-color-scheme='dark'] &": { color: config.dark.color },
        }}
      >
        {displayLabel}
      </Typography>
    </Box>
  );
}
