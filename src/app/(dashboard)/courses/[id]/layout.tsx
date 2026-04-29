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
        mx: -3,
        mt: -3,
        minHeight: "calc(100vh - 64px)",
      }}
    >
      {/* Nested Sidebar — sticky */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          height: "calc(100vh - 64px)",
          flexShrink: 0,
          zIndex: 10,
        }}
      >
        <CourseDetailSidebar courseId={id} courseTitle={courseTitle} />
      </Box>

      {/* Content — erkin scroll */}
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          p: 3,
          "[data-joy-color-scheme='light'] &": { bgcolor: "#f1f5f9" },
          "[data-joy-color-scheme='dark'] &": { bgcolor: "#0e0e12" },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
