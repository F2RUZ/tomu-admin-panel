// src/components/ui/PageHeader/index.tsx
"use client";

import { Box, Typography, Button, Breadcrumbs } from "@mui/joy";
import { RiAddLine, RiArrowRightSLine } from "react-icons/ri";
import Link from "next/link";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
}

export default function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  action,
}: PageHeaderProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        mb: 3,
        gap: 2,
        flexWrap: "wrap",
      }}
    >
      <Box>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.75 }}
          >
            {breadcrumbs.map((crumb, i) => (
              <Box
                key={i}
                sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
              >
                {crumb.href ? (
                  <Typography
                    component={Link}
                    href={crumb.href}
                    sx={{
                      fontFamily: "var(--font-montserrat)",
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      textDecoration: "none",
                      "[data-joy-color-scheme='light'] &": { color: "#0284c7" },
                      "[data-joy-color-scheme='dark'] &": { color: "#c084fc" },
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    {crumb.label}
                  </Typography>
                ) : (
                  <Typography
                    sx={{
                      fontFamily: "var(--font-montserrat)",
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      color: "text.tertiary",
                    }}
                  >
                    {crumb.label}
                  </Typography>
                )}
                {i < breadcrumbs.length - 1 && (
                  <Box sx={{ color: "text.tertiary", display: "flex" }}>
                    <RiArrowRightSLine size={14} />
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        )}

        <Typography
          sx={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 800,
            fontSize: "1.375rem",
            letterSpacing: "-0.03em",
            color: "text.primary",
            lineHeight: 1.2,
          }}
        >
          {title}
        </Typography>

        {subtitle && (
          <Typography
            sx={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.875rem",
              color: "text.tertiary",
              mt: 0.5,
              fontWeight: 400,
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>

      {action && (
        <Button
          onClick={action.onClick}
          startDecorator={action.icon ?? <RiAddLine size={18} />}
          sx={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 700,
            fontSize: "0.875rem",
            borderRadius: "10px",
            height: 40,
            flexShrink: 0,
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
