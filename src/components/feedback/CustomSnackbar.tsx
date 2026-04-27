"use client";

import { useEffect, useRef } from "react";
import { Box, Typography, IconButton } from "@mui/joy";
import {
  RiCheckboxCircleLine,
  RiErrorWarningLine,
  RiInformationLine,
  RiAlertLine,
  RiCloseLine,
} from "react-icons/ri";
import { snackbarEnter, snackbarExit } from "@/lib/gsap";
import {
  useSnackbarStore,
  SnackbarItem,
  SnackbarVariant,
} from "@/store/snackbarStore";

// ─── Icon map ────────────────────────────────────────────────────────────────
const ICONS: Record<SnackbarVariant, React.ReactNode> = {
  success: <RiCheckboxCircleLine size={20} />,
  danger: <RiErrorWarningLine size={20} />,
  warning: <RiAlertLine size={20} />,
  neutral: <RiInformationLine size={20} />,
};

const COLORS: Record<
  SnackbarVariant,
  {
    bg: string;
    border: string;
    icon: string;
    darkBg: string;
    darkBorder: string;
  }
> = {
  success: {
    bg: "#f0fdf4",
    border: "#bbf7d0",
    icon: "#16a34a",
    darkBg: "rgba(74,222,128,0.08)",
    darkBorder: "rgba(74,222,128,0.2)",
  },
  danger: {
    bg: "#fff1f2",
    border: "#fecdd3",
    icon: "#dc2626",
    darkBg: "rgba(248,113,113,0.08)",
    darkBorder: "rgba(248,113,113,0.2)",
  },
  warning: {
    bg: "#fffbeb",
    border: "#fde68a",
    icon: "#d97706",
    darkBg: "rgba(251,191,36,0.08)",
    darkBorder: "rgba(251,191,36,0.2)",
  },
  neutral: {
    bg: "#f0f9ff",
    border: "#bae6fd",
    icon: "#0284c7",
    darkBg: "rgba(168,85,247,0.08)",
    darkBorder: "rgba(168,85,247,0.2)",
  },
};

// ─── Single Snackbar ─────────────────────────────────────────────────────────
function SnackbarCard({ item }: { item: SnackbarItem }) {
  const ref = useRef<HTMLDivElement>(null);
  const remove = useSnackbarStore((s) => s.remove);
  const color = COLORS[item.variant];

  useEffect(() => {
    snackbarEnter(ref.current);

    const timer = setTimeout(() => {
      snackbarExit(ref.current, () => remove(item.id));
    }, item.duration ?? 4000);

    return () => clearTimeout(timer);
  }, [item.id, item.duration, remove]);

  const handleClose = () => {
    snackbarExit(ref.current, () => remove(item.id));
  };

  return (
    <Box
      ref={ref}
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 1.5,
        minWidth: 300,
        maxWidth: 400,
        p: "14px 16px",
        borderRadius: "14px",
        border: "1px solid",
        backdropFilter: "blur(12px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)",
        // Light mode
        bgcolor: color.bg,
        borderColor: color.border,
        // Dark mode override via CSS variable
        "[data-joy-color-scheme='dark'] &": {
          bgcolor: color.darkBg,
          borderColor: color.darkBorder,
        },
      }}
    >
      {/* Icon */}
      <Box
        sx={{
          color: color.icon,
          flexShrink: 0,
          mt: "1px",
          "[data-joy-color-scheme='dark'] &": {
            color: color.icon,
            filter: "brightness(1.3)",
          },
        }}
      >
        {ICONS[item.variant]}
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {item.title && (
          <Typography
            level="title-sm"
            sx={{
              fontWeight: 700,
              fontSize: "0.8125rem",
              color: "text.primary",
              mb: 0.25,
            }}
          >
            {item.title}
          </Typography>
        )}
        <Typography
          level="body-sm"
          sx={{
            fontSize: "0.8125rem",
            color: "text.secondary",
            lineHeight: 1.5,
          }}
        >
          {item.message}
        </Typography>
      </Box>

      {/* Close */}
      <IconButton
        size="sm"
        variant="plain"
        color="neutral"
        onClick={handleClose}
        sx={{
          flexShrink: 0,
          minWidth: 24,
          minHeight: 24,
          borderRadius: "8px",
          color: "text.tertiary",
          "&:hover": { bgcolor: "rgba(0,0,0,0.06)" },
          "[data-joy-color-scheme='dark'] &:hover": {
            bgcolor: "rgba(255,255,255,0.06)",
          },
        }}
      >
        <RiCloseLine size={16} />
      </IconButton>
    </Box>
  );
}

// ─── Snackbar Container (global) ─────────────────────────────────────────────
export default function CustomSnackbar() {
  const items = useSnackbarStore((s) => s.items);

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: 1,
        pointerEvents: "none",
        "& > *": { pointerEvents: "auto" },
      }}
    >
      {items.map((item) => (
        <SnackbarCard key={item.id} item={item} />
      ))}
    </Box>
  );
}
