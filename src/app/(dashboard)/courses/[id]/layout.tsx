// src/app/(dashboard)/courses/[id]/layout.tsx
"use client";

import { Box } from "@mui/joy";
import { use, useEffect, useState } from "react";
import CourseDetailSidebar from "@/components/courses/CourseDetailSidebar";
import CourseService from "@/services/courseService";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export default function CourseDetailLayout({ children, params }: LayoutProps) {
  const { id } = use(params);
  const [courseTitle, setCourseTitle] = useState("");

  useEffect(() => {
    CourseService.getById(Number(id))
      .then((res) => setCourseTitle(res.data?.title ?? ""))
      .catch(() => setCourseTitle("Kurs"));
  }, [id]);

  return (
    <Box
      sx={{
        display: "flex",
        // DashboardLayout main padding ni bekor qilish
        mx: -3,
        mt: -3,
        // Qolgan balandlikni to'ldirish
        height: "calc(100vh - 64px)",
        overflow: "hidden",
      }}
    >
      {/* Nested Sidebar */}
      <CourseDetailSidebar courseId={id} courseTitle={courseTitle} />

      {/* Content — faqat shu yerda scroll */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          p: 3,
          "[data-joy-color-scheme='light'] &": { bgcolor: "#f1f5f9" },
          "[data-joy-color-scheme='dark'] &": { bgcolor: "#0e0e12" },
          "&::-webkit-scrollbar": { width: 5 },
          "&::-webkit-scrollbar-track": { background: "transparent" },
          "[data-joy-color-scheme='light'] &::-webkit-scrollbar-thumb": {
            background: "#cbd5e1",
            borderRadius: "99px",
          },
          "[data-joy-color-scheme='dark'] &::-webkit-scrollbar-thumb": {
            background: "#3a3a44",
            borderRadius: "99px",
          },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
