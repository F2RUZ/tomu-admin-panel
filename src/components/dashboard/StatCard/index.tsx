// src/components/dashboard/StatCard/index.tsx
"use client";

import { useRef, useEffect } from "react";
import { Box, Typography } from "@mui/joy";
import { gsap } from "@/lib/gsap";

interface StatCardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: React.ReactNode;
  color: "blue" | "purple" | "green" | "orange";
  change?: number;
  index?: number;
}

const COLOR_MAP = {
  blue: {
    light: { bg: "#e0f2fe", icon: "#0284c7", accent: "#0284c7" },
    dark: { bg: "rgba(2,132,199,0.12)", icon: "#38bdf8", accent: "#0284c7" },
  },
  purple: {
    light: { bg: "#f3e8ff", icon: "#9333ea", accent: "#9333ea" },
    dark: { bg: "rgba(147,51,234,0.12)", icon: "#c084fc", accent: "#9333ea" },
  },
  green: {
    light: { bg: "#dcfce7", icon: "#16a34a", accent: "#16a34a" },
    dark: { bg: "rgba(74,222,128,0.1)", icon: "#4ade80", accent: "#16a34a" },
  },
  orange: {
    light: { bg: "#fef3c7", icon: "#d97706", accent: "#d97706" },
    dark: { bg: "rgba(251,191,36,0.1)", icon: "#fbbf24", accent: "#d97706" },
  },
};

export default function StatCard({
  title,
  value,
  prefix = "",
  suffix = "",
  icon,
  color,
  change,
  index = 0,
}: StatCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLSpanElement>(null);
  const colors = COLOR_MAP[color];

  useEffect(() => {
    // Card entrance
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.45,
        ease: "power2.out",
        delay: index * 0.1,
      },
    );

    // CountUp animation
    const obj = { val: 0 };
    gsap.to(obj, {
      val: value,
      duration: 1.4,
      delay: index * 0.1 + 0.2,
      ease: "power2.out",
      onUpdate: () => {
        if (valueRef.current) {
          valueRef.current.textContent =
            prefix + Math.round(obj.val).toLocaleString("uz-UZ") + suffix;
        }
      },
    });
  }, [value, index, prefix, suffix]);

  return (
    <Box
      ref={cardRef}
      sx={{
        borderRadius: "8px",
        border: "1px solid",
        p: 2.5,
        position: "relative",
        overflow: "hidden",
        transition: "all 0.25s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          "[data-joy-color-scheme='light'] &": {
            boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
          },
          "[data-joy-color-scheme='dark'] &": {
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
          },
        },
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
      {/* Top accent line */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          borderRadius: "8px 8px 0 0",
          bgcolor: colors.dark.accent,
        }}
      />

      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        {/* Icon */}
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "[data-joy-color-scheme='light'] &": {
              bgcolor: colors.light.bg,
              color: colors.light.icon,
            },
            "[data-joy-color-scheme='dark'] &": {
              bgcolor: colors.dark.bg,
              color: colors.dark.icon,
            },
          }}
        >
          {icon}
        </Box>

        {/* Change badge */}
        {change !== undefined && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              px: 1,
              py: 0.375,
              borderRadius: "6px",
              fontFamily: "var(--font-montserrat)",
              fontWeight: 700,
              fontSize: "0.75rem",
              ...(change >= 0
                ? {
                    "[data-joy-color-scheme='light'] &": {
                      bgcolor: "#dcfce7",
                      color: "#16a34a",
                    },
                    "[data-joy-color-scheme='dark'] &": {
                      bgcolor: "rgba(74,222,128,0.1)",
                      color: "#4ade80",
                    },
                  }
                : {
                    "[data-joy-color-scheme='light'] &": {
                      bgcolor: "#fff1f2",
                      color: "#dc2626",
                    },
                    "[data-joy-color-scheme='dark'] &": {
                      bgcolor: "rgba(248,113,113,0.1)",
                      color: "#f87171",
                    },
                  }),
            }}
          >
            {change >= 0 ? "↑" : "↓"} {Math.abs(change)}%
          </Box>
        )}
      </Box>

      {/* Value */}
      <Typography
        component="div"
        sx={{
          fontFamily: "var(--font-montserrat)",
          fontWeight: 800,
          fontSize: "1.75rem",
          letterSpacing: "-0.03em",
          color: "text.primary",
          lineHeight: 1,
          mb: 0.75,
        }}
      >
        <span ref={valueRef}>
          {prefix}0{suffix}
        </span>
      </Typography>

      {/* Title */}
      <Typography
        sx={{
          fontFamily: "var(--font-montserrat)",
          fontSize: "0.875rem",
          fontWeight: 500,
          color: "text.tertiary",
        }}
      >
        {title}
      </Typography>
    </Box>
  );
}
