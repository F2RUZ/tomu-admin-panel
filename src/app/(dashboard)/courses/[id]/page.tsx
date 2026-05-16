"use client";
import { useParams } from "next/navigation";
import CourseInfo from "@/components/courses/CourseInfo";

export default function CourseDetailPage() {
  const params = useParams();
  const id = params.id as string;
  return <CourseInfo courseId={id} />;
}
