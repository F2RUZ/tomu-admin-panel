// src/components/ui/EmptyState/index.tsx
"use client";

import { Box, Typography, Button } from "@mui/joy";
import { RiAddLine, RiInboxLine } from "react-icons/ri";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
}

export default function EmptyState({
  title,
  description,
  action,
  icon,
}: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 8,
        px: 4,
        gap: 2,
        borderRadius: "16px",
        border: "2px dashed",
        textAlign: "center",
        "[data-joy-color-scheme='light'] &": {
          borderColor: "#e2e8f0",
          bgcolor: "#f8fafc",
        },
        "[data-joy-color-scheme='dark'] &": {
          borderColor: "#3a3a44",
          bgcolor: "#1c1c21",
        },
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: "18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          "[data-joy-color-scheme='light'] &": {
            bgcolor: "#e2e8f0",
            color: "#94a3b8",
          },
          "[data-joy-color-scheme='dark'] &": {
            bgcolor: "#26262d",
            color: "#52525e",
          },
        }}
      >
        {icon ?? <RiInboxLine size={32} />}
      </Box>

      <Box>
        <Typography
          sx={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 700,
            fontSize: "1rem",
            color: "text.primary",
            mb: 0.5,
          }}
        >
          {title}
        </Typography>
        {description && (
          <Typography
            sx={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.875rem",
              color: "text.tertiary",
              maxWidth: 320,
            }}
          >
            {description}
          </Typography>
        )}
      </Box>

      {action && (
        <Button
          onClick={action.onClick}
          startDecorator={<RiAddLine size={16} />}
          size="sm"
          sx={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 600,
            borderRadius: "8px",
            mt: 0.5,
            "[data-joy-color-scheme='light'] &": {
              bgcolor: "#0284c7",
              color: "#fff",
              "&:hover": { bgcolor: "#0369a1" },
            },
            "[data-joy-color-scheme='dark'] &": {
              bgcolor: "#9333ea",
              color: "#fff",
              "&:hover": { bgcolor: "#7e22ce" },
            },
          }}
        >
          {action.label}
        </Button>
      )}
    </Box>
  );
}
