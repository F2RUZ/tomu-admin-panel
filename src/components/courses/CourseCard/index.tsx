// src/components/courses/CourseCard/index.tsx
"use client";

import { useRef, useEffect } from "react";
import { Box, Typography, IconButton, Tooltip } from "@mui/joy";
import {
  RiEditLine,
  RiDeleteBinLine,
  RiBookOpenLine,
  RiVideoLine,
  RiFileTextLine,
  RiArrowRightLine,
} from "react-icons/ri";
import { Course } from "@/types/course.types";
import { gsap } from "@/lib/gsap";
import StatusBadge from "@/components/ui/StatusBadge";
import Link from "next/link";
import { formatNumber } from "@/utils/format";
import { getImageUrl } from "@/utils/url";

interface CourseCardProps {
  course: Course;
  index: number;
  onEdit: (course: Course) => void;
  onDelete: (course: Course) => void;
}

export default function CourseCard({
  course,
  index,
  onEdit,
  onDelete,
}: CourseCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
        delay: index * 0.07,
      },
    );
  }, [index]);

  const imageUrl = getImageUrl(course.imageUrl);

  return (
    <Box
      ref={cardRef}
      sx={{
        borderRadius: "8px",
        border: "1px solid",
        overflow: "hidden",
        transition: "all 0.25s ease",
        "&:hover": {
          transform: "translateY(-3px)",
          "[data-joy-color-scheme='light'] &": {
            boxShadow: "0 12px 32px rgba(15,23,42,0.1)",
            borderColor: "#0284c7",
          },
          "[data-joy-color-scheme='dark'] &": {
            boxShadow: "0 12px 32px rgba(0,0,0,0.35)",
            borderColor: "#9333ea",
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
      {/* Image */}
      <Box
        sx={{
          position: "relative",
          height: 160,
          overflow: "hidden",
          "[data-joy-color-scheme='light'] &": { bgcolor: "#f1f5f9" },
          "[data-joy-color-scheme='dark'] &": { bgcolor: "#26262d" },
        }}
      >
        {imageUrl ? (
          <Box
            component="img"
            src={imageUrl}
            alt={course.title}
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              e.currentTarget.style.display = "none";
            }}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.3s ease",
              "&:hover": { transform: "scale(1.05)" },
            }}
          />
        ) : (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "text.tertiary",
            }}
          >
            <RiBookOpenLine size={48} />
          </Box>
        )}
        <Box sx={{ position: "absolute", top: 10, left: 10 }}>
          <StatusBadge status={course.isActive ? "active" : "inactive"} />
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ p: 2 }}>
        <Typography
          sx={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 700,
            fontSize: "1rem",
            color: "text.primary",
            mb: 0.5,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {course.title}
        </Typography>
        <Typography
          sx={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.8125rem",
            color: "text.secondary",
            mb: 1.5,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            lineHeight: 1.5,
          }}
        >
          {course.description}
        </Typography>

        {/* Stats */}
        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            mb: 1.5,
            pb: 1.5,
            borderBottom: "1px solid",
            "[data-joy-color-scheme='light'] &": { borderColor: "#f1f5f9" },
            "[data-joy-color-scheme='dark'] &": { borderColor: "#26262d" },
          }}
        >
          {[
            {
              icon: <RiBookOpenLine size={13} />,
              value: course.alphabetCount ?? 0,
              label: "Alifbo",
            },
            {
              icon: <RiVideoLine size={13} />,
              value: course.lessonCount ?? 0,
              label: "Dars",
            },
            {
              icon: <RiFileTextLine size={13} />,
              value: course.grammarCount ?? 0,
              label: "Grammar",
            },
          ].map((stat) => (
            <Box
              key={stat.label}
              sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
            >
              <Box sx={{ color: "text.tertiary", display: "flex" }}>
                {stat.icon}
              </Box>
              <Typography
                sx={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "text.secondary",
                }}
              >
                {formatNumber(stat.value)}
              </Typography>
              <Typography
                sx={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.6875rem",
                  color: "text.tertiary",
                }}
              >
                {stat.label}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Actions */}
        <Box sx={{ display: "flex", gap: 0.75 }}>
          <Box
            component={Link}
            href={`/courses/${course.id}`}
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.75,
              py: 0.875,
              borderRadius: "8px",
              textDecoration: "none",
              fontFamily: "var(--font-montserrat)",
              fontWeight: 600,
              fontSize: "0.8125rem",
              transition: "all 0.2s ease",
              "[data-joy-color-scheme='light'] &": {
                bgcolor: "#f0f9ff",
                color: "#0284c7",
                "&:hover": { bgcolor: "#e0f2fe" },
              },
              "[data-joy-color-scheme='dark'] &": {
                bgcolor: "rgba(168,85,247,0.08)",
                color: "#c084fc",
                "&:hover": { bgcolor: "rgba(168,85,247,0.15)" },
              },
            }}
          >
            Ochish <RiArrowRightLine size={14} />
          </Box>

          <Tooltip title="Tahrirlash" placement="top">
            <IconButton
              size="sm"
              variant="soft"
              onClick={() => onEdit(course)}
              sx={{
                borderRadius: "8px",
                "[data-joy-color-scheme='light'] &": {
                  bgcolor: "#f1f5f9",
                  color: "#475569",
                  "&:hover": { bgcolor: "#e2e8f0" },
                },
                "[data-joy-color-scheme='dark'] &": {
                  bgcolor: "#26262d",
                  color: "#a1a1aa",
                  "&:hover": { bgcolor: "#3a3a44" },
                },
              }}
            >
              <RiEditLine size={16} />
            </IconButton>
          </Tooltip>

          <Tooltip title="O'chirish" placement="top">
            <IconButton
              size="sm"
              variant="soft"
              onClick={() => onDelete(course)}
              sx={{
                borderRadius: "8px",
                "[data-joy-color-scheme='light'] &": {
                  bgcolor: "#fff1f2",
                  color: "#dc2626",
                  "&:hover": { bgcolor: "#fecdd3" },
                },
                "[data-joy-color-scheme='dark'] &": {
                  bgcolor: "rgba(248,113,113,0.08)",
                  color: "#f87171",
                  "&:hover": { bgcolor: "rgba(248,113,113,0.15)" },
                },
              }}
            >
              <RiDeleteBinLine size={16} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
}
