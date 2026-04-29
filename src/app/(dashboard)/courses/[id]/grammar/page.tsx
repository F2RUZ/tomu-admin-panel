// src/app/(dashboard)/courses/[id]/grammar/page.tsx
"use client";

import { use } from "react";
import GrammarTable from "@/components/courses/sections/Grammar/GrammarTable";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function GrammarPage({ params }: PageProps) {
  const { id } = use(params);
  return <GrammarTable courseId={Number(id)} />;
}
