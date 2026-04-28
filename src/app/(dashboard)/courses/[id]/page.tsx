// src/app/(dashboard)/courses/[id]/page.tsx
"use client";
import { use } from "react";
import CourseInfo from "@/components/courses/CourseInfo";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CourseDetailPage({ params }: PageProps) {
  const { id } = use(params);
  return <CourseInfo courseId={id} />;
}
