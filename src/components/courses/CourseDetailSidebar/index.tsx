// src/components/courses/CourseDetailSidebar/index.tsx
"use client";

import { Box, Typography, IconButton, Tooltip } from "@mui/joy";
import {
  RiInformationLine,
  RiText,
  RiVideoLine,
  RiFileTextLine,
  RiHomeLine,
  RiPriceTagLine,
  RiGroupLine,
  RiArrowLeftLine,
  RiMenuFoldLine,
  RiMenuUnfoldLine,
  RiQuestionLine,
} from "react-icons/ri";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebarStore } from "@/store/sidebarStore";

interface CourseDetailSidebarProps {
  courseId: string;
  courseTitle: string;
}

const getNavItems = (courseId: string) => [
  {
    label: "Umumiy",
    path: `/courses/${courseId}`,
    icon: <RiInformationLine size={18} />,
    exact: true,
  },
  {
    label: "Alifbo",
    path: `/courses/${courseId}/alphabet`,
    icon: <RiText size={18} />,
  },
  {
    label: "Darslar",
    path: `/courses/${courseId}/lessons`,
    icon: <RiVideoLine size={18} />,
  },
  {
    label: "Grammar",
    path: `/courses/${courseId}/grammar`,
    icon: <RiFileTextLine size={18} />,
  },
  {
    label: "Uy vazifalari",
    path: `/courses/${courseId}/homework`,
    icon: <RiHomeLine size={18} />,
  },
  {
    label: "Tariflar",
    path: `/courses/${courseId}/tariffs`,
    icon: <RiPriceTagLine size={18} />,
  },
  {
    label: "Quiz",
    path: `/courses/${courseId}/quiz`,
    icon: <RiQuestionLine size={18} />,
  },
  // {
  {
    label: "Guruhlar",
    path: `/courses/${courseId}/groups`,
    icon: <RiGroupLine size={18} />,
  },
  // },
];

export default function CourseDetailSidebar({
  courseId,
  courseTitle,
}: CourseDetailSidebarProps) {
  const pathname = usePathname();
  const { nestedCollapsed, toggleNested } = useSidebarStore();
  const navItems = getNavItems(courseId);

  return (
    <Box
      sx={{
        width: nestedCollapsed ? 64 : 220,
        flexShrink: 0,
        borderRight: "1px solid",
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        transition: "width 0.3s cubic-bezier(0.4,0,0.2,1)",
        overflow: "hidden",
        "[data-joy-color-scheme='light'] &": { bgcolor: "#ffffff" },
        "[data-joy-color-scheme='dark'] &": { bgcolor: "#18181b" },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: nestedCollapsed ? "center" : "space-between",
          px: nestedCollapsed ? 1 : 2,
          borderBottom: "1px solid",
          borderColor: "divider",
          flexShrink: 0,
          gap: 1,
        }}
      >
        {!nestedCollapsed && (
          <Box
            component={Link}
            href="/courses"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              textDecoration: "none",
              minWidth: 0,
              flex: 1,
              opacity: 0.65,
              transition: "opacity 0.2s",
              "&:hover": { opacity: 1 },
            }}
          >
            <RiArrowLeftLine size={14} style={{ flexShrink: 0 }} />
            <Typography
              sx={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "text.secondary",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {courseTitle || "Kurslar"}
            </Typography>
          </Box>
        )}

        {/* Collapse toggle */}
        <Tooltip
          title={nestedCollapsed ? "Kengaytirish" : "Qisqartirish"}
          placement="right"
          arrow
        >
          <IconButton
            size="sm"
            variant="plain"
            color="neutral"
            onClick={toggleNested}
            sx={{
              borderRadius: "8px",
              flexShrink: 0,
              "[data-joy-color-scheme='light'] &": {
                color: "#64748b",
                "&:hover": { bgcolor: "#f1f5f9" },
              },
              "[data-joy-color-scheme='dark'] &": {
                color: "#71717d",
                "&:hover": { bgcolor: "rgba(255,255,255,0.05)" },
              },
            }}
          >
            {nestedCollapsed ? (
              <RiMenuUnfoldLine size={16} />
            ) : (
              <RiMenuFoldLine size={16} />
            )}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Nav items */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          p: 1,
          display: "flex",
          flexDirection: "column",
          gap: 0.25,
          "&::-webkit-scrollbar": { width: 0 },
        }}
      >
        {!nestedCollapsed && (
          <Typography
            sx={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.6875rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              px: 1,
              py: 0.75,
              "[data-joy-color-scheme='light'] &": { color: "#94a3b8" },
              "[data-joy-color-scheme='dark'] &": { color: "#52525e" },
            }}
          >
            Bo'limlar
          </Typography>
        )}

        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.path
            : pathname.startsWith(item.path);

          const navItem = (
            <Box
              key={item.path}
              component={Link}
              href={item.path}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: nestedCollapsed ? 0 : 1.25,
                px: nestedCollapsed ? 0 : 1.25,
                py: 0.875,
                borderRadius: "8px",
                textDecoration: "none",
                transition: "all 0.15s ease",
                position: "relative",
                justifyContent: nestedCollapsed ? "center" : "flex-start",
                ...(isActive
                  ? {
                      "[data-joy-color-scheme='light'] &": {
                        bgcolor: "#e0f2fe",
                      },
                      "[data-joy-color-scheme='dark'] &": {
                        bgcolor: "rgba(168,85,247,0.12)",
                      },
                    }
                  : {
                      "&:hover": {
                        "[data-joy-color-scheme='light'] &": {
                          bgcolor: "#f1f5f9",
                        },
                        "[data-joy-color-scheme='dark'] &": {
                          bgcolor: "rgba(255,255,255,0.05)",
                        },
                      },
                    }),
              }}
            >
              {/* Active indicator */}
              {isActive && !nestedCollapsed && (
                <Box
                  sx={{
                    position: "absolute",
                    left: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 3,
                    height: 16,
                    borderRadius: "0 3px 3px 0",
                    "[data-joy-color-scheme='light'] &": { bgcolor: "#0284c7" },
                    "[data-joy-color-scheme='dark'] &": { bgcolor: "#a855f7" },
                  }}
                />
              )}

              {/* Icon */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  width: 32,
                  height: 32,
                  borderRadius: "8px",
                  transition: "all 0.15s ease",
                  ...(isActive && {
                    "[data-joy-color-scheme='light'] &": { bgcolor: "#bae6fd" },
                    "[data-joy-color-scheme='dark'] &": {
                      bgcolor: "rgba(168,85,247,0.2)",
                    },
                  }),
                  "[data-joy-color-scheme='light'] &": {
                    color: isActive ? "#0284c7" : "#64748b",
                  },
                  "[data-joy-color-scheme='dark'] &": {
                    color: isActive ? "#c084fc" : "#71717d",
                  },
                }}
              >
                {item.icon}
              </Box>

              {/* Label */}
              {!nestedCollapsed && (
                <Typography
                  sx={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.8125rem",
                    fontWeight: isActive ? 700 : 500,
                    whiteSpace: "nowrap",
                    "[data-joy-color-scheme='light'] &": {
                      color: isActive ? "#0284c7" : "#475569",
                    },
                    "[data-joy-color-scheme='dark'] &": {
                      color: isActive ? "#c084fc" : "#a1a1aa",
                    },
                  }}
                >
                  {item.label}
                </Typography>
              )}
            </Box>
          );

          return nestedCollapsed ? (
            <Tooltip key={item.path} title={item.label} placement="right" arrow>
              <Box>{navItem}</Box>
            </Tooltip>
          ) : (
            navItem
          );
        })}
      </Box>
    </Box>
  );
}
