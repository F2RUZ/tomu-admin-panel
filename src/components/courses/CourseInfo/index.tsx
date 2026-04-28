"use client";

import { useState, useEffect, useCallback } from "react";
import { Box, Typography, CircularProgress, Switch, Chip } from "@mui/joy";
import {
  RiBookOpenLine,
  RiVideoLine,
  RiFileTextLine,
  RiTimeLine,
  RiEditLine,
  RiGlobalLine,
} from "react-icons/ri";
import { Course, LANG_OPTIONS } from "@/types/course.types";
import CourseService from "@/services/courseService";
import { useSnackbarStore } from "@/store/snackbarStore";
import CourseModal from "@/components/courses/CourseModal";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatDate } from "@/utils/format";
import { Button } from "@mui/joy";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ?? "";

interface CourseInfoProps {
  courseId: string;
}

export default function CourseInfo({ courseId }: CourseInfoProps) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchCourse = useCallback(async () => {
    setLoading(true);
    try {
      const res = await CourseService.getById(Number(courseId));
      setCourse(res.data);
    } catch {
      useSnackbarStore.getState().error("Kursni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress
          sx={{
            "[data-joy-color-scheme='light'] &": { color: "#0284c7" },
            "[data-joy-color-scheme='dark'] &": { color: "#9333ea" },
          }}
        />
      </Box>
    );
  }

  if (!course) return null;

  const imageUrl = course.imageUrl
    ? course.imageUrl.startsWith("http")
      ? course.imageUrl
      : `${BASE_URL}/${course.imageUrl}`
    : null;

  const langOption = LANG_OPTIONS.find((l) => l.value === course.lang);

  const stats = [
    {
      icon: <RiBookOpenLine size={18} />,
      value: course.alphabetCount ?? 0,
      label: "Alifbo darslari",
    },
    {
      icon: <RiVideoLine size={18} />,
      value: course.lessonCount ?? 0,
      label: "Video darslar",
    },
    {
      icon: <RiFileTextLine size={18} />,
      value: course.grammarCount ?? 0,
      label: "Grammar",
    },
    {
      icon: <RiTimeLine size={18} />,
      value: course.homeworkCount ?? 0,
      label: "Uy vazifalari",
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 800,
              fontSize: "1.25rem",
              letterSpacing: "-0.02em",
              color: "text.primary",
            }}
          >
            Kurs malumotlari
          </Typography>
          <Typography
            sx={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.875rem",
              color: "text.tertiary",
              mt: 0.25,
            }}
          >
            Yaratilgan: {formatDate(course.createdAt)}
          </Typography>
        </Box>

        <Button
          onClick={() => setModalOpen(true)}
          startDecorator={<RiEditLine size={16} />}
          sx={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 700,
            fontSize: "0.875rem",
            borderRadius: "8px",
            height: 38,
            border: "none",
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
          Tahrirlash
        </Button>
      </Box>

      {/* Main card */}
      <Box
        sx={{
          borderRadius: "8px",
          border: "1px solid",
          overflow: "hidden",
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
        {imageUrl && (
          <Box sx={{ height: 240, overflow: "hidden" }}>
            <Box
              component="img"
              src={imageUrl}
              alt={course.title}
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                e.currentTarget.parentElement!.style.display = "none";
              }}
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Box>
        )}

        <Box sx={{ p: 3 }}>
          {/* Title + badges */}
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              mb: 2,
              gap: 2,
            }}
          >
            <Typography
              sx={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 700,
                fontSize: "1.25rem",
                color: "text.primary",
                letterSpacing: "-0.02em",
              }}
            >
              {course.title}
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
              <StatusBadge status={course.isActive ? "active" : "inactive"} />
              {langOption && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    px: 1,
                    py: 0.25,
                    borderRadius: "6px",
                    "[data-joy-color-scheme='light'] &": { bgcolor: "#f1f5f9" },
                    "[data-joy-color-scheme='dark'] &": { bgcolor: "#26262d" },
                  }}
                >
                  <RiGlobalLine size={12} />
                  <Typography
                    sx={{
                      fontFamily: "var(--font-montserrat)",
                      fontSize: "0.6875rem",
                      fontWeight: 600,
                      color: "text.secondary",
                    }}
                  >
                    {langOption.label}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          {/* Description */}
          <Typography
            sx={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.9375rem",
              color: "text.secondary",
              lineHeight: 1.7,
              mb: 3,
            }}
          >
            {course.description}
          </Typography>

          {/* Stats grid */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 1.5,
            }}
          >
            {stats.map((stat) => (
              <Box
                key={stat.label}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  p: 1.5,
                  borderRadius: "8px",
                  "[data-joy-color-scheme='light'] &": { bgcolor: "#f8fafc" },
                  "[data-joy-color-scheme='dark'] &": { bgcolor: "#26262d" },
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    "[data-joy-color-scheme='light'] &": {
                      bgcolor: "#e0f2fe",
                      color: "#0284c7",
                    },
                    "[data-joy-color-scheme='dark'] &": {
                      bgcolor: "rgba(168,85,247,0.12)",
                      color: "#c084fc",
                    },
                  }}
                >
                  {stat.icon}
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontFamily: "var(--font-montserrat)",
                      fontWeight: 700,
                      fontSize: "1.125rem",
                      color: "text.primary",
                      lineHeight: 1,
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "var(--font-montserrat)",
                      fontSize: "0.75rem",
                      color: "text.tertiary",
                      mt: 0.25,
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Edit Modal */}
      <CourseModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchCourse}
        editData={course}
      />
    </Box>
  );
}
