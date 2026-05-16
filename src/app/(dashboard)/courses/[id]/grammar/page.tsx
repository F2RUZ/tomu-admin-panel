"use client";
import { useParams } from "next/navigation";
import GrammarTable from "@/components/courses/sections/Grammar/GrammarTable";

export default function GrammarPage() {
  const params = useParams();
  const id = params.id as string;
  return <GrammarTable courseId={Number(id)} />;
}
