"use client";
import { use } from "react";
import QuizList from "@/components/courses/sections/Quiz/QuizList";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function QuizPageRoute({ params }: PageProps) {
  const { id } = use(params);
  return <QuizList courseId={Number(id)} />;
}
